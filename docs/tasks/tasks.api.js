import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/tasks`

export async function createTask(title, id) {
  const { error } = await postWebAppJson(`${url}/create`, { title, id })
  return { error }
}

export async function deleteTask(id) {
  const { error } = await getWebApp(`${url}/delete?id=${id}`)
  return { error }
}

export async function fetchTasks() {
  const { tasks, error } = await getWebApp(`${url}/read`)
  return { tasks, error }
}

export async function searchTasks(q) {
  const { journal, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { data: journal, error }
}

export async function update(tasks) {
  const { message, error } = postWebAppJson(`${url}/update`, {
    tasks,
  })
  return { message, error }
}

export async function updateTask({ id, section, value }) {
  const { message, error } = postWebAppJson(`${url}/update-task`, {
    id,
    [section]: value,
  })
  return { message, error }
}
