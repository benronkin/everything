import { newState } from '../_assets/js/newState.js'
import { getWebApp } from '../_assets/js/io.js'

/**
 *
 */
export async function createEntry() {
  const { id, error } = await getWebApp(
    `${newState.const('APP_URL')}/journal/create`
  )
  return { id, error }
}

/**
 *
 */
export async function deleteEntry(id, password) {
  const { journal, error } = await getWebApp(
    `${newState.const('APP_URL')}/journal/delete?id=${id}&password=${password}`
  )
  return { data: journal, error }
}

/**
 *
 */
export async function fetchDefaults() {
  const { defaults, error } = await getWebApp(
    `${newState.const('APP_URL')}/journal/defaults/read`
  )
  return { defaults, error }
}

/**
 *
 */
export async function fetchEntryPhotosMetadata(id) {
  const { photos, error } = await getWebApp(
    `${newState.const('APP_URL')}/journal/photos/read?entry=${id}`
  )
  return { photos, error }
}

/**
 *
 */
export async function fetchRecentEntries() {
  const { journal, error } = await getWebApp(
    `${newState.const('APP_URL')}/journal/read`
  )
  return { data: journal, error }
}

/**
 * @param {String} q - The search query
 */
export async function searchEntries(q) {
  const { journal, error } = await getWebApp(
    `${newState.const('APP_URL')}/journal/search?q=${q.trim().toLowerCase()}`
  )
  return { data: journal, error }
}
