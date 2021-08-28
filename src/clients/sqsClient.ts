import { SQS } from 'aws-sdk'
import { QueueUrlList } from 'aws-sdk/clients/sqs'

export interface SQSClient {
  sendMessage: (QueueUrl: string, MessageBody: string) => Promise<void>
  receiveMessage: (
    QueueUrl: string,
    MaxNumberOfMessages: number
  ) => Promise<SQS.Message[]>
  deleteMessage: (QueueUrl: string, ReceiptHandle: string) => Promise<void>
  purgeQueue: (QueueUrl: string) => Promise<void>
  listQueues: () => Promise<QueueUrlList>
  findQueue: (queueName: string) => Promise<string | undefined>
}

export const createSQSClient = (client: SQS): SQSClient => {
  const sendMessage = async (
    QueueUrl: string,
    MessageBody: string
  ): Promise<void> => {
    const params: SQS.SendMessageRequest = {
      MessageBody,
      QueueUrl
    }
    await client.sendMessage(params).promise()
  }

  const receiveMessage = async (
    QueueUrl: string,
    MaxNumberOfMessages = 1
  ): Promise<SQS.Message[]> => {
    return new Promise<SQS.Message[]>((resolve, reject) => {
      client.receiveMessage(
        {
          AttributeNames: ['ApproximateReceiveCount'],
          QueueUrl,
          MaxNumberOfMessages
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: Error | null, data: any) => {
          if (error) {
            reject(error)
          } else {
            resolve(data.Messages || [])
          }
        }
      )
    })
  }

  const deleteMessage = async (
    QueueUrl: string,
    ReceiptHandle: string
  ): Promise<void> => {
    const params: SQS.DeleteMessageRequest = {
      ReceiptHandle,
      QueueUrl
    }
    await client.deleteMessage(params).promise()
  }

  const purgeQueue = async (QueueUrl: string): Promise<void> => {
    const params: SQS.PurgeQueueRequest = {
      QueueUrl
    }
    await client.purgeQueue(params).promise()
  }

  const listQueues = async (): Promise<QueueUrlList> =>
    (await client.listQueues().promise()).QueueUrls || []

  const findQueue = async (queueName: string): Promise<string | undefined> => {
    const queues = await listQueues()
    return queues.find(q => q.toLocaleLowerCase().includes(queueName))
  }

  return {
    sendMessage,
    findQueue,
    receiveMessage,
    deleteMessage,
    purgeQueue,
    listQueues
  }
}
