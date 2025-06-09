import { newState } from '../_assets/js/newState.js'
import { getWebApp, postWebAppJson, postWebAppForm } from '../_assets/js/io.js'

const url = newState.const('APP_URL')

/**
 *
 */
export async function createEntry() {
  const { id, error } = await getWebApp(`${url}/journal/create`)
  return { id, error }
}

/**
 *
 */
export async function deleteEntry(id, password) {
  const { journal, error } = await getWebApp(
    `${url}/journal/delete?id=${id}&password=${password}`
  )
  return { data: journal, error }
}

/**
 *
 */
export async function fetchDefaults() {
  const { defaults, error } = await getWebApp(`${url}/journal/defaults/read`)
  return { defaults, error }
}

/**
 *
 */
export async function fetchEntryPhotosMetadata(id) {
  const { photos, error } = await getWebApp(
    `${url}/journal/photos/read?entry=${id}`
  )
  return { photos, error }
}

/**
 *
 */
export async function fetchRecentEntries() {
  const { journal, error } = await getWebApp(`${url}/journal/read`)
  return { data: journal, error }
}

/**
 * @param {String} q - The search query
 */
export async function searchEntries(q) {
  const { journal, error } = await getWebApp(
    `${url}/journal/search?q=${q.trim().toLowerCase()}`
  )
  return { data: journal, error }
}

/**
 *
 */
export async function updateEntry({ id, section, value }) {
  const { message, error } = postWebAppJson(`${url}/journal/update`, {
    id,
    value,
    section,
  })
  return { message, error }
}

/**
 *
 */
export async function updateJournalDefaults({ id, section, value }) {
  await postWebAppJson(`${url}/journal/defaults/update`, {
    id,
    [section]: value,
  })
}

/**
 *
 */
export async function updatePhotoCaption({ id, value }) {
  const { error, message } = await postWebAppJson(
    `${url}/journal/photos/update`,
    {
      id,
      value: value,
      section: 'caption',
    }
  )
  return { error, message }
}

/**
 *
 */
export async function addEntryPhoto(formData) {
  const { message } = await postWebAppForm(
    `${url}/journal/photos/create`,
    formData
  )
  return { message }
}

/**
 *
 */
export async function deleteEntryPhoto(id) {
  const { error } = await getWebApp(`${url}/journal/photos/delete?id=${id}`)
  return { error }
}
