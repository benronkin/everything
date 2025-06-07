import { newState } from '../_assets/js/newState.js'
import { getWebApp } from '../_assets/js/io.js'

/**
 *
 */
export async function fetchRecentEntries() {
  const { journal, message } = await getWebApp(
    `${newState.const('APP_URL')}/journal/read`
  )
  return { data: journal, message }
}

/**
 * @param {String} q - The search query
 */
export async function searchEntries(q) {
  const { journal, message } = await getWebApp(
    `${newState.const('APP_URL')}/journal/search?q=${q.trim().toLowerCase()}`
  )
  return { data: journal, message }
}
