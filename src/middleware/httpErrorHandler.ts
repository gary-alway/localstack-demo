import middy from '@middy/core'
import { ALBEvent, ALBResult } from 'aws-lambda'
import { pathOr } from 'ramda'

const httpErrorHandler = (): middy.MiddlewareObject<ALBEvent, ALBResult> => {
  return {
    onError: (handler: middy.HandlerLambda, next: middy.NextFunction) => {
      const { error } = handler

      const statusCode = pathOr(500, ['statusCode'], error)

      let errors = [{ message: 'Something went wrong' }]
      if (statusCode < 500) {
        errors = Array.isArray(error) ? error : [error]
      }

      Object.assign(handler, {
        response: {
          statusCode,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ status: 'error', errors })
        }
      })

      return next()
    }
  }
}

export { httpErrorHandler }
