import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/shopping`

export async function fetchCartAndSuggestions() {
  const { shoppingList, shoppingSuggestions } = await getWebApp(`${url}/read`)

  return { shoppingList, shoppingSuggestions }
}

export async function addItem(text) {
  postWebAppJson(`${url}/add`, {
    value: text,
  })
}

export async function deleteItem(text) {
  postWebAppJson(`${url}/delete`, {
    value: text,
  })
}

export async function updateShoppingList(text) {
  postWebAppJson(`${url}/update`, {
    value: text,
  })
}

export async function updateSuggestionsList(text) {
  postWebAppJson(`${url}/suggestions/update`, {
    value: text,
  })
}
