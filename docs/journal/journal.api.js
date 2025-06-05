import { newState } from '../_assets/js/newState.js'
import { getWebApp } from '../_assets/js/io.js'

/**
 *
 */
export async function fetchMainDocuments() {
  const { journal } = await getWebApp(
    `${newState.const('APP_URL')}/journal/read`
  )
  return journal
}
