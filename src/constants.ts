export const { IS_OFFLINE } = process.env
export const LOCAL_AWS_CONFIG = {
  region: 'us-east-1',
  accessKeyId: 'root',
  secretAccessKey: 'root',
  endpoint: 'http://localhost:4566'
}
export const IMPORT_QUEUE = 'http://localhost:4566/000000000000/imports'
export const DDB_TABLE = 'images'
export const SNS_TOPIC_IMAGE_CREATED =
  'arn:aws:sns:us-east-1:000000000000:image-created'
export const SNS_TOPIC_IMAGE_UPDATED =
  'arn:aws:sns:us-east-1:000000000000:image-updated'
