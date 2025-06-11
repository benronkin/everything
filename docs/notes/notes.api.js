import { state } from '../_assets/js/state.js'
import { getWebApp, postWebAppJson } from '../_assets/js/io.js'
import { log } from '../_assets/js/logger.js'

const url = `${state.const('APP_URL')}/notes`

/**
 *
 */
export async function createNote() {
  const { id, title } = await getWebApp(`${url}/create`)
  return { id, title }
}

/**
 *
 */
export async function deleteNote(id) {
  const { message } = await getWebApp(`${url}/delete?id=${id}`)
  return { message }
}

/**
 *
 */
export async function fetchNote(id) {
  const { note, error } = await getWebApp(`${url}/read-one?id=${id}`)
  return { note, error }
}

/**
 *
 */
export async function fetchNotes() {
  const { notes, error } = await getWebApp(`${url}/read`)
  return { notes, error }
}

/**
 *
 */
export async function updateNote({ id, title, note }) {
  const { message } = await postWebAppJson(`${url}/update`, { id, title, note })
  return { message }
}
