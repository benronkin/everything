import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/lexicon`

export async function aiEntry({ title }) {
  const newEntry = await getWebApp(`${url}/ai?title=${title}`)
  return { newEntry }
}

export async function createEntry(payload) {
  const { error } = await postWebAppJson(`${url}/create`, payload)
  return { error }
}

export async function deleteEntry(title) {
  const { error } = await getWebApp(`${url}/delete?title=${title}`)
  return { error }
}
export async function deleteSense(id) {
  const { error } = await getWebApp(`${url}/delete-one?id=${id}`)
  return { error }
}

export async function fetchEntry(t) {
  const resp = await getWebApp(`${url}/read-one?title=${t}`)
  const { entry, error } = resp
  return { entry, error }
}

export async function fetchLatestWotd() {
  const resp = await getWebApp(`${url}/wotd`)
  const { entry, error } = resp
  return { entry, error }
}

export async function fetchRecentEntries() {
  const { entries, error } = await getWebApp(`${url}/latest`)
  return { entries, error }
}

export async function searchEntries(q) {
  const { entries, newEntry, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { entries, newEntry, error }
}

export async function updateEntry({ id, section, value }) {
  const { message, error } = await postWebAppJson(`${url}/update-one`, {
    id,
    value,
    section,
  })
  return { message, error }
}

export async function updateEntryAccess({ title }) {
  const { message, error } = await getWebApp(
    `${url}/update-access?title=${title}`
  )
  return { message, error }
}

export async function updateEntries(doc) {
  return await postWebAppJson(`${url}/update`, doc)
}
