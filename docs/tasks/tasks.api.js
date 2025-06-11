import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/tasks`

/**
 *
 */
export async function createTask(title) {
  const { id, error } = await postWebAppJson(`${url}/create`, { title })
  return { id, error }
}

/**
 *
 */
export async function deleteTask(id) {
  const { error } = await getWebApp(`${url}/delete?id=${id}`)
  return { error }
}

/**
 *
 */
export async function fetchTasks(token) {
  const { tasks, error } = await getWebApp(`${url}/read?token=${token}`)

  return { tasks, error }
}

/**
 * @param {String} q - The search query
 */
export async function searchTasks(q) {
  const { journal, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { data: journal, error }
}

/**
 *
 */
export async function updateTask({ id, section, value }) {
  const { message, error } = postWebAppJson(`${url}/update-task`, {
    id,
    [section]: value,
  })
  return { message, error }
}
