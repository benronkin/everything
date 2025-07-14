import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'
import { log } from '../assets/js/logger.js'

const url = `${state.const('APP_URL')}/lexicon`

export async function createEntry({ id, entry }) {
  const { error } = await postWebAppJson(`${url}/create`, { id, entry })
  return { error }
}

export async function deleteEntry(id) {
  const { error } = await getWebApp(`${url}/delete?id=${id}`)
  return { error }
}

export async function fetchEntry(id) {
  const resp = await getWebApp(`${url}/read-one?id=${id}`)
  const { entry, error } = resp
  return { entry, error }
}

export async function fetchRecentEntries() {
  const { entries, error } = await getWebApp(`${url}/latest`)
  return { entries, error }
}

export async function searchEntries(q) {
  const { entries, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { entries, error }
}

export async function updateEntry({ id, section, value }) {
  const { message, error } = await postWebAppJson(`${url}/update`, {
    id,
    value,
    section,
  })
  return { message, error }
}
