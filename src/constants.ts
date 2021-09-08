export const { IS_OFFLINE } = process.env
export const LOCAL_AWS_CONFIG = {
  region: 'us-east-1',
  accessKeyId: 'root',
  secretAccessKey: 'root',
  endpoint: 'http://localhost:4566'
}
export const STREAM_OUTPUT_QUEUE =
  'http://localhost:4566/000000000000/stream-output'
export const IMPORT_QUEUE = 'http://localhost:4566/000000000000/imports'
export const IMPORT_DL_QUEUE = 'http://localhost:4566/000000000000/imports-dlq'
export const TEST_QUEUE = 'http://localhost:4566/000000000000/test'
export const DDB_TABLE = 'images'
export const DDB_TABLE_PK = 'id'
export const SNS_TOPIC_IMAGE_CREATED =
  'arn:aws:sns:us-east-1:000000000000:image-created'
export const SNS_TOPIC_IMAGE_UPDATED =
  'arn:aws:sns:us-east-1:000000000000:image-updated'
export const S3_BUCKET = 'http://localhost:4566/images'
export const API = 'http://localhost:21001/images'
