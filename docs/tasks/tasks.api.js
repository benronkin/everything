import { newState } from '../_assets/js/newState.js'
import { getWebApp, postWebAppJson, postWebAppForm } from '../_assets/js/io.js'

const url = newState.const('APP_URL')

/**
 *
 */
export async function fetchTasks(token) {
  const { tasks, error } = await getWebApp(`${url}/tasks/read?token=${token}`)

  return { tasks, error }
}
