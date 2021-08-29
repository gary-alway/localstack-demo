import middy from '@middy/core'
import { httpErrorHandler } from '../middleware/httpErrorHandler'
import { APIGatewayEvent } from 'aws-lambda'
import { APIResponse } from '../types'
import { getImages } from '../domain/imageService'

const handler = async (_: APIGatewayEvent): Promise<APIResponse> => {
  const data = await getImages()

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      data
    })
  }
}

export const endpoint = middy(handler).use(httpErrorHandler())
