import middy from '@middy/core'
import { SQSEvent, Context } from 'aws-lambda'

type Message = {
  type: string
  payload: any
}

export interface InjectorContext {
  messages: Message[]
}

const getSQSMessages = (event: SQSEvent): Message[] => {
  return event?.Records?.reduce((acc, { body, eventSourceARN }) => {
    const type = eventSourceARN.substr(eventSourceARN.lastIndexOf(':') + 1)
    const msg = { type, payload: JSON.parse(body) }

    return [...acc, msg]
  }, [] as Message[])
}

export const extractMessages = (): middy.MiddlewareObject<
  SQSEvent,
  void,
  Context & InjectorContext
> => {
  return {
    before: (
      handler: middy.HandlerLambda<SQSEvent, void, Context & InjectorContext>,
      next: middy.NextFunction
    ) => {
      const { event, context } = handler
      const messages = getSQSMessages(event)
      context.messages = messages

      return next()
    }
  }
}
