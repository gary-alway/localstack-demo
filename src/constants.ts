export const { IS_OFFLINE } = process.env
export const LOCAL_AWS_CONFIG = {
  region: 'us-east-1',
  accessKeyId: 'root',
  secretAccessKey: 'root',
  endpoint: 'http://localhost:4566'
}
export const IMPORT_QUEUE = 'http://localhost:4566/000000000000/imports'
