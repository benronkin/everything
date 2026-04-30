import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/tasks`

export async function createStep(caption, taskId) {
  const resp = await postWebAppJson(`${url}/steps/create`, {
    caption,
    taskId,
  })
  return resp
}

export async function deleteStep(id) {
  const resp = await getWebApp(`${url}/steps/delete?id=${id}`)
  return resp
}

export async function createTask(title, id) {
  const { error, data } = await postWebAppJson(`${url}/create`, { title, id })
  return data
}

export async function deleteTask(id) {
  const resp = await getWebApp(`${url}/delete?id=${id}`)
  return resp
}

export async function fetchTask(id) {
  const { task, error } = await getWebApp(`${url}/read-one?id=${id}`)
  return { task, error }
}

export async function fetchTasks() {
  const { tasks, error } = await getWebApp(`${url}/read`)
  return { tasks, error }
}

export async function fetchSteps(id) {
  const { steps, error } = await getWebApp(`${url}/steps/read?id=${id}`)
  return { steps, error }
}

export async function fetchStepsOfMultipleTasks(task_ids) {
  const { data, error } = await postWebAppJson(`${url}/steps/multi-tasks`, {
    task_ids,
  })

  return { steps: data.steps, error }
}

export async function searchTasks(q) {
  const { journal, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`,
  )
  return { data: journal, error }
}

export async function update(tasks) {
  const { message, error } = postWebAppJson(`${url}/update`, {
    tasks,
  })
  return { message, error }
}

export async function updateStep(payload) {
  // console.log('payload', payload)
  const resp = await postWebAppJson(`${url}/steps/update`, payload)
  return resp
}

export async function updateTask({ id, section, value }) {
  const { message, error } = postWebAppJson(`${url}/update-task`, {
    id,
    [section]: value,
  })
  return { message, error }
}
