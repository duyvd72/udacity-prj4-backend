import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateTodo')

export const handler = async (event) => {
  logger.info('Update todo item', { todoId: event.pathParameters.todoId })
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  await updateTodo({ userId, todoId, updatedTodo })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: undefined
  }
}
