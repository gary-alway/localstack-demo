import { SQSEvent, Context } from 'aws-lambda'
import middy from '@middy/core'
import { extractMessages, InjectorContext } from '../middleware/extractMessages'
import { processImage } from '../domain/imageService'

const messageHandler = async (
  _: SQSEvent,
  context: Context & InjectorContext
): Promise<void> => {
  const { messages } = context

  if (!messages.length) {
    console.warn('Empty message payload', messages)
    return
  }

  await Promise.all(messages.map(({ payload: { img } }) => processImage(img)))
}

export const handler = middy(messageHandler as any).use(
  extractMessages() as any
)
