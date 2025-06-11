import { state } from '../_assets/js/state.js'
import { getWebApp, postWebAppJson } from '../_assets/js/io.js'
import { log } from '../_assets/js/logger.js'

const url = `${state.const('APP_URL')}/shopping`

/**
 *
 */
export async function fetchCartAndSuggestions() {
  const { shoppingList, shoppingSuggestions } = await getWebApp(`${url}/read`)

  return { shoppingList, shoppingSuggestions }
}

/**
 *
 */
export async function upodateShoppingList(text) {
  postWebAppJson(`${url}/update`, {
    value: text,
  })
}

/**
 *
 */
export async function upodateSuggestionsList(text) {
  postWebAppJson(`${url}/suggestions/update`, {
    value: text,
  })
}
