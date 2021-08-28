import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { S3, SNS, SQS } from 'aws-sdk'
import { IS_OFFLINE, LOCAL_AWS_CONFIG } from '../constants'
import { createDynamoClient, DynamoClient } from './dynamoClient'
import { createS3Client, S3Client } from './s3Client'
import { createSNSClient, SNSClient } from './snsClient'
import { createSQSClient, SQSClient } from './sqsClient'

const dynamoInstance = Object.freeze(
  createDynamoClient(
    new DocumentClient(IS_OFFLINE ? LOCAL_AWS_CONFIG : undefined)
  )
)

const s3Instance = Object.freeze(
  createS3Client(
    new S3(
      IS_OFFLINE ? { ...LOCAL_AWS_CONFIG, s3ForcePathStyle: true } : undefined
    )
  )
)

const snsInstance = Object.freeze(
  createSNSClient(new SNS(IS_OFFLINE ? LOCAL_AWS_CONFIG : undefined))
)

const sqsInstance = Object.freeze(
  createSQSClient(new SQS(IS_OFFLINE ? LOCAL_AWS_CONFIG : undefined))
)

export const getDynamoClient = (): DynamoClient => dynamoInstance
export const getS3Client = (): S3Client => s3Instance
export const getSnsClient = (): SNSClient => snsInstance
export const getSqsClient = (): SQSClient => sqsInstance
