import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

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

export async function fetchNoteMetadata(id) {
  const { note, error } = await getWebApp(`${url}/read-metadata?id=${id}`)
  return { note, error }
}

export async function fetchNotes() {
  const { notes, error } = await getWebApp(`${url}/read`)
  return { notes, error }
}

export async function fetchNoteHistories(id) {
  const { histories } = await getWebApp(`${url}/history/read?id=${id}`)
  return { histories }
}

export async function fetchNoteHistory(id) {
  const { history } = await getWebApp(`${url}/history/read-one?id=${id}`)
  return { history }
}

/**
 * @param {String} q - The search query
 */
export async function searchNotes(q) {
  const { notes, error } = await getWebApp(
    `${url}/search?q=${encodeURIComponent(q.trim().toLowerCase())}`,
  )
  return { data: notes, error }
}

export async function shareNote({ id, peers }) {
  const { message } = await postWebAppJson(`${url}/share`, { id, peers })
  return { message }
}

export async function updateNote({ id, title, note }) {
  const resp = await postWebAppJson(`${url}/update`, { id, title, note })
  const { message } = resp
  return { message }
}

// ------------------------
// NOTES LABELS
// ------------------------

export async function addLabel({ title }) {
  const resp = await postWebAppJson(`${url}/labels/add`, { title })
  const { data, message } = resp
  return { data, message }
}

export async function assignLabel({ labelId, noteId }) {
  // title for server message
  const resp = await postWebAppJson(`${url}/labels/assign`, {
    labelId,
    noteId,
  })
  let { error, message } = resp
  return { error, message }
}

export async function deleteLabel({ labelId }) {
  const resp = await postWebAppJson(`${url}/labels/delete`, { labelId })
  let { error, message } = resp
  return { error, message }
}

export async function fetchLabels() {
  const resp = await getWebApp(`${url}/labels/get`)
  return resp
}

export async function fetchLabelsAssignments() {
  const resp = await getWebApp(`${url}/labels/get-assignments`)
  return resp
}

export async function unassignLabel({ labelId, noteId }) {
  const resp = await postWebAppJson(`${url}/labels/unassign`, {
    labelId,
    noteId,
  })
  let { error, message } = resp
  return { error, message }
}

export async function updateLabel({ labelId, title }) {
  const resp = await postWebAppJson(`${url}/labels/update`, { labelId, title })
  let { error, message } = resp
  return { error, message }
}
