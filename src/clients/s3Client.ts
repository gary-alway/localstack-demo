import { S3, AWSError } from 'aws-sdk'
import { Readable } from 'stream'

const BUCKET = 'images'

export interface S3Client {
  ls: (dir?: string) => Promise<string[]>
  rmdir: (dir?: string) => Promise<void>
  getObject: (filename: string) => Promise<S3.GetObjectOutput>
  putObject: (
    filename: string,
    data: string | Buffer | Uint8Array | Blob | Readable,
    type: string
  ) => Promise<S3.PutObjectOutput | AWSError>
  objectExists: (filename: string) => Promise<boolean>
}

export const createS3Client = (s3: S3): S3Client => {
  const client = s3

  const ls = async (dir?: string) =>
    s3
      .listObjectsV2({
        Bucket: BUCKET,
        Prefix: dir
      })
      .promise()
      .then(({ Contents }) =>
        (Contents || []).map(({ Key }) => Key || 'missing key')
      )

  const rmdir = async (dir?: string): Promise<void> => {
    const listedObjects = await s3
      .listObjectsV2({
        Bucket: BUCKET,
        Prefix: dir ? `${dir}/` : undefined
      })
      .promise()

    if (listedObjects?.Contents?.length === 0) {
      return
    }

    const Objects = listedObjects!.Contents!.reduce<S3.ObjectIdentifierList>(
      (acc, { Key }) => {
        return Key ? [...acc, { Key }] : acc
      },
      []
    )

    await s3
      .deleteObjects({
        Bucket: BUCKET,
        Delete: { Objects }
      })
      .promise()

    if (listedObjects.IsTruncated) {
      await rmdir(dir)
    }
  }

  const getObject = async (filename: string): Promise<S3.GetObjectOutput> =>
    client
      .getObject({
        Bucket: BUCKET,
        Key: filename
      })
      .promise()

  const putObject = async (
    filename: string,
    data: string | Buffer | Uint8Array | Blob | Readable,
    type: string
  ): Promise<S3.PutObjectOutput | AWSError> =>
    client
      .putObject({
        Bucket: BUCKET,
        Key: filename,
        Body: data,
        ContentType: type,
        ACL: 'public-read'
      })
      .promise()

  const objectExists = async (filename: string): Promise<boolean> =>
    client
      .headObject({
        Bucket: BUCKET,
        Key: filename
      })
      .promise()
      .then(() => true)
      .catch(({ code }) => {
        if (code === 'NotFound') {
          return false
        }
        throw Error(code)
      })

  return {
    ls,
    rmdir,
    getObject,
    objectExists,
    putObject
  }
}
