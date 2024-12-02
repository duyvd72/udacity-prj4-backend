// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('deleteTodo')

export const handler = async (event) => {
  logger.info('Delete todo item', { todoId: event.pathParameters.todoId })
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  await deleteTodo({ userId, todoId })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: undefined
  }
}
