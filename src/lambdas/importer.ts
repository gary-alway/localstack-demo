import { APIGatewayEvent } from 'aws-lambda'
import middy from '@middy/core'
import { httpErrorHandler } from '../middleware/httpErrorHandler'
import createHttpError from 'http-errors'
import { APIResponse } from '../types'

const handler = async ({ body }: APIGatewayEvent): Promise<APIResponse> => {
  if (!body) {
    throw createHttpError(400)
  }

  const payload = JSON.parse(body)

  console.log(payload)

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok'
    })
  }
}

export const endpoint = middy(handler).use(httpErrorHandler())
