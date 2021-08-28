import { SQSEvent, Context } from 'aws-lambda'
import middy from '@middy/core'
import { extractMessages, InjectorContext } from '../middleware/extractMessages'

const messageHandler = async (
  _: SQSEvent,
  context: Context & InjectorContext
): Promise<void> => {
  const { messages } = context

  if (!messages.length) {
    console.warn('Empty message payload', messages)
    return
  }

  console.log(messages)
}

export const handler = middy(messageHandler as any).use(
  extractMessages() as any
)
