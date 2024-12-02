// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodo')

// export const handler = middy()
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
//   .handler(async (event) => {
//     const body = JSON.parse(event.body)
//     const userId = getUserId(event)

//     const newTodoItem = await createTodo(body, userId)

//     return {
//       statusCode: 201,
//       body: JSON.stringify({
//         item: newTodoItem
//       })
//     }
//   })

export const handler = async (event) => {
  logger.info('Create todo item')
  const body = JSON.parse(event.body)
  const userId = getUserId(event)

  const newTodoItem = await createTodo(body, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newTodoItem
    })
  }
}
