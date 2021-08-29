import middy from '@middy/core'
import { httpErrorHandler } from '../middleware/httpErrorHandler'
import { APIGatewayEvent } from 'aws-lambda'
import { APIResponse } from '../types'

const handler = async (_: APIGatewayEvent): Promise<APIResponse> => {
  console.log('query')

  const data: any = []

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      data
    })
  }
}

export const endpoint = middy(handler).use(httpErrorHandler())
