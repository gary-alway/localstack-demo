import { APIGatewayEvent } from 'aws-lambda'
import middy from '@middy/core'
import { httpErrorHandler } from '../middleware/httpErrorHandler'
import createHttpError from 'http-errors'
import { APIResponse } from '../types'
import { pathOr, trim } from 'ramda'
import { truthy } from '../truthy'
import { getSqsClient } from '../clients/getClients'
import { IMPORT_QUEUE } from '../constants'

const handler = async ({ body }: APIGatewayEvent): Promise<APIResponse> => {
  if (!body) {
    throw createHttpError(400)
  }

  const payload = JSON.parse(body)

  const images = pathOr<string[] | undefined>(undefined, ['images'], payload)

  if (!images || !Array.isArray(images)) {
    throw createHttpError(400)
  }

  const sqsClient = getSqsClient()

  const msgs = images
    .filter(truthy)
    .map(trim)
    .filter(truthy)
    .map(img => sqsClient.sendMessage(IMPORT_QUEUE, JSON.stringify({ img })))

  await Promise.all(msgs)

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok'
    })
  }
}

export const endpoint = middy(handler).use(httpErrorHandler())
