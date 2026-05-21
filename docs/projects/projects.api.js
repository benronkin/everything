import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/projects`

export async function createProject({ title, starts_at, type }) {
  const resp = await postWebAppJson(`${url}/create`, {
    title,
    starts_at,
    type
  })
  return resp
}

/**
 *
 */
export async function attachProjectItem({ project_id, item_id, type }) {
  const resp = await postWebAppJson(`${url}/attach-item`, {
    project_id,
    item_id,
    type
  })
  return resp
}

/**
 *
 */
export async function createProjectItem({ id, type }) {
  const resp = await postWebAppJson(`${url}/create-item`, {
    id,
    type
  })
  return resp
}

/**
 *
 */
export async function deleteProject(id) {
  const resp = await getWebApp(`${url}/delete?id=${id}`)
  return resp
}

/**
 *
 */
export async function detachProjectItem({ item_id }) {
  const resp = await postWebAppJson(`${url}/detach-item`, {
    item_id
  })
  return resp
}

/**
 *
 */
export async function fetchProject(id) {
  const { project, error } = await getWebApp(`${url}/read-one?id=${id}`)
  return { project, error }
}

export async function fetchProjects() {
  const { projects, error } = await getWebApp(`${url}/read`)
  return { projects, error }
}

export async function searchProjects(q) {
  const resp = await getWebApp(`${url}/search?q=${q.trim().toLowerCase()}`)
  return resp
}

export async function shareProject(payload) {
  const resp = await postWebAppJson(`${url}/share`, payload)
  return resp
}

export async function updateProject(obj) {
  const { id, section, value } = obj
  const { message, error } = postWebAppJson(`${url}/update`, {
    id,
    [section]: value
  })
  return { message, error }
}
