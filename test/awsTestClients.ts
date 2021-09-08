import { S3, SNS, SQS } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDynamoClient } from '../src/clients/dynamoClient'
import { createS3Client } from '../src/clients/s3Client'
import { createSNSClient } from '../src/clients/snsClient'
import { createSQSClient } from '../src/clients/sqsClient'
import {
  DDB_TABLE,
  DDB_TABLE_PK,
  IMPORT_DL_QUEUE,
  IMPORT_QUEUE,
  LOCAL_AWS_CONFIG,
  STREAM_OUTPUT_QUEUE,
  TEST_QUEUE
} from '../src/constants'

export const testDynamoClient = createDynamoClient(
  new DocumentClient(LOCAL_AWS_CONFIG)
)
export const testS3Client = createS3Client(
  new S3({ ...LOCAL_AWS_CONFIG, s3ForcePathStyle: true })
)
export const testSnsClient = createSNSClient(new SNS(LOCAL_AWS_CONFIG))
export const testSqsClient = createSQSClient(new SQS(LOCAL_AWS_CONFIG))

export const purgeAll = async () =>
  Promise.all([
    testS3Client.rmdir(),
    testDynamoClient.truncateTable(DDB_TABLE, DDB_TABLE_PK),
    testSqsClient.purgeQueue(STREAM_OUTPUT_QUEUE),
    testSqsClient.purgeQueue(IMPORT_QUEUE),
    testSqsClient.purgeQueue(IMPORT_DL_QUEUE),
    testSqsClient.purgeQueue(TEST_QUEUE)
  ])
