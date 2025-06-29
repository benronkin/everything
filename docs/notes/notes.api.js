import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'
import { log } from '../assets/js/logger.js'

const url = `${state.const('APP_URL')}/notes`

export async function createNote() {
  const { id, title } = await getWebApp(`${url}/create`)
  return { id, title }
}

export async function deleteNote(id) {
  const { message } = await getWebApp(`${url}/delete?id=${id}`)
  return { message }
}

export async function fetchNote(id) {
  const { note, error } = await getWebApp(`${url}/read-one?id=${id}`)
  return { note, error }
}

export async function fetchNotes() {
  const { notes, error } = await getWebApp(`${url}/read`)
  return { notes, error }
}

/**
 * @param {String} q - The search query
 */
export async function searchNotes(q) {
  const { notes, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { data: notes, error }
}

export async function shareNote({ id, peers }) {
  const { message } = await postWebAppJson(`${url}/share`, { id, peers })
  return { message }
}

export async function updateNote({ id, title, note }) {
  const { message } = await postWebAppJson(`${url}/update`, { id, title, note })
  return { message }
}
