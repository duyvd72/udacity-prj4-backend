// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { getTodos } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('getTodos')

// export const handler = middy()
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
//   .handler(async (event) => {
//     const userId = getUserId(event)
//     const todos = await getTodos({ userId })

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ items: todos })
//     }
//   })

export const handler = async (event) => {
  logger.info('Get all todos')
  const userId = getUserId(event)
  const todos = await getTodos({ userId })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ items: todos })
  }
}
