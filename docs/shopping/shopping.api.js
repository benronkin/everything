import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/shopping`

/**
 *
 */
export async function addItem(title, listName) {
  const resp = await postWebAppJson(`${url}/add`, {
    title,
    listName
  })
  return resp
}

/**
 *
 */
export async function cartItems(titles) {
  const resp = await postWebAppJson(`${url}/cart`, {
    titles
  })
  return resp
}

export async function deleteItem(id, list) {
  const resp = await getWebApp(`${url}/delete?id=${id}&list=${list}`)
  return resp
}

/**
 *
 */
export async function getItem(id) {
  const resp = await getWebApp(`${url}/read-one?id=${id}`)
  return resp
}

/**
 *
 */
export async function getItems() {
  const resp = await getWebApp(`${url}/read`)
  return resp
}

/**
 *
 */
export async function updateItem(data) {
  const resp = await postWebAppJson(`${url}/update`, data)
  return resp
}
