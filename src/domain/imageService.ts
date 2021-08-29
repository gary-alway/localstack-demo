import { pathOr } from 'ramda'
import stringHash from 'string-hash'
import request from 'superagent'
import { DynamoClient } from '../clients/dynamoClient'
import {
  getDynamoClient,
  getS3Client,
  getSnsClient
} from '../clients/getClients'
import {
  DDB_TABLE,
  S3_BUCKET,
  SNS_TOPIC_IMAGE_CREATED,
  SNS_TOPIC_IMAGE_UPDATED
} from '../constants'

type ImageType = {
  id: number
  originalUrl: string
  url?: string
}

export const processImage = async (url: string) => {
  if (!url) {
    throw new Error('processImage: URL not defined')
  }
  const { data, type } = await request
    .get(url)
    .buffer(true)
    .parse(request.parse.image)
    .then(res => ({
      type: pathOr<string>('unknown', ['headers', 'content-type'], res),
      data: res.body
    }))

  const hash = stringHash(url)
  const filename = `${hash}`
  const record: ImageType = { id: hash, originalUrl: url }

  const s3Client = getS3Client()
  const exists = await s3Client.objectExists(filename)

  await Promise.all([
    s3Client.putObject(filename, data, type),
    getDynamoClient().putItem(record, DDB_TABLE),
    getSnsClient().publish(
      exists ? SNS_TOPIC_IMAGE_UPDATED : SNS_TOPIC_IMAGE_CREATED,
      JSON.stringify({ ...record, exists })
    )
  ])
}

export const getImages = async (
  client: DynamoClient = getDynamoClient()
): Promise<ImageType[]> =>
  client.scan(DDB_TABLE).then(res =>
    pathOr<ImageType[]>([], ['Items'], res).map(({ originalUrl, id }) => ({
      originalUrl,
      id,
      url: `${S3_BUCKET}/${id}`
    }))
  )
