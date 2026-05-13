import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/shopping`

export async function fetchShopping() {
  const resp = await getWebApp(`${url}/read`)
  return resp
}

export async function addItem(text) {
  await postWebAppJson(`${url}/add`, {
    value: text,
  })
}

export async function deleteItem(text) {
  const resp = await postWebAppJson(`${url}/delete`, {
    value: text,
  })
  return resp
}

export async function updateShoppingList(text) {
  const resp = await postWebAppJson(`${url}/update`, {
    value: text,
  })
  return resp
}

export async function updateSuggestionsList(text) {
  await postWebAppJson(`${url}/suggestions/update`, {
    value: text,
  })
}

export async function updateRecurring(text) {
  await postWebAppJson(`${url}/recurring/update`, {
    value: text,
  })
}
