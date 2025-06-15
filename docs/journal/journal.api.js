import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson, postWebAppForm } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/journal`

/**
 *
 */
export async function createEntry() {
  const { id, error } = await getWebApp(`${url}/create`)
  return { id, error }
}

/**
 *
 */
export async function deleteEntry(id, password) {
  const { journal, error } = await getWebApp(
    `${url}/delete?id=${id}&password=${password}`
  )
  return { data: journal, error }
}

/**
 *
 */
export async function fetchDefaults() {
  const { defaults, error } = await getWebApp(`${url}/defaults/read`)
  return { defaults, error }
}

/**
 *
 */
export async function fetchEntryPhotosMetadata(id) {
  const { photos, error } = await getWebApp(`${url}/photos/read?entry=${id}`)
  return { photos, error }
}

export async function fetchGeoIndex() {
  const { tree, error } = await getWebApp(`${url}/geo-index/read`)
  return { tree, error }
}

/**
 *
 */
export async function fetchRecentEntries() {
  const { journal, error } = await getWebApp(`${url}/read`)
  return { data: journal, error }
}

/**
 * @param {String} q - The search query
 */
export async function searchEntries(q) {
  const { journal, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { data: journal, error }
}

/**
 *
 */
export async function updateEntry({ id, section, value }) {
  const { message, error } = postWebAppJson(`${url}/update`, {
    id,
    value,
    section,
  })
  return { message, error }
}

export async function updateGeoIndex({ tree }) {
  await postWebAppJson(`${url}/geo-index/update`, {
    tree,
  })
}

/**
 *
 */
export async function updateJournalDefaults({ id, section, value }) {
  await postWebAppJson(`${url}/defaults/update`, {
    id,
    [section]: value,
  })
}

/**
 *
 */
export async function updatePhotoCaption({ id, value }) {
  const { error, message } = await postWebAppJson(`${url}/photos/update`, {
    id,
    value: value,
    section: 'caption',
  })
  return { error, message }
}

/**
 *
 */
export async function addEntryPhoto(formData) {
  const { message } = await postWebAppForm(`${url}/photos/create`, formData)
  return { message }
}

/**
 *
 */
export async function deleteEntryPhoto(id) {
  const { error } = await getWebApp(`${url}/photos/delete?id=${id}`)
  return { error }
}
