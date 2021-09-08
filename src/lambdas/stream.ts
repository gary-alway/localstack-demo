import { DynamoDBStreamEvent } from 'aws-lambda'
import { getSqsClient } from '../clients/getClients'
import { STREAM_OUTPUT_QUEUE } from '../constants'

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const sqsClient = getSqsClient()

  const msgs = event.Records.map(record =>
    sqsClient.sendMessage(STREAM_OUTPUT_QUEUE, JSON.stringify({ record }))
  )

  await Promise.all(msgs)
}
