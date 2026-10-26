import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppForm, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/shopping`

/**
 *
 */
export async function addItem(data) {
  const resp = await postWebAppJson(`${url}/add`, data)
  return resp
}

/**
 *
 */
export async function cartRecurring() {
  const resp = await getWebApp(`${url}/cart-recurring`)
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

/**
 *
 */
export async function deleteItem(id, list) {
  const resp = await getWebApp(`${url}/delete?id=${id}&list=${list}`)
  return resp
}

/**
 *
 */
export async function fetchMediaMetadata(id) {
  const { media, error } = await getWebApp(`${url}/media/read?entry=${id}`)
  return { media, error }
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
export async function sortItems(ids, view) {
  const resp = await postWebAppJson(`${url}/sort`, { ids, view })
  return resp
}

/**
 *
 */
export async function updateItem(data) {
  const resp = await postWebAppJson(`${url}/update`, data)
  return resp
}

export async function updateMediaCaption({ id, value }) {
  const { error, message } = await postWebAppJson(`${url}/media/update`, {
    id,
    value: value,
    section: 'caption'
  })
  return { error, message }
}

export async function addMedia(formData) {
  const resp = await postWebAppForm(`${url}/media/create`, formData)
  return resp
}

export async function deleteMedia(id) {
  const { error } = await getWebApp(`${url}/media/delete?id=${id}`)
  return { error }
}
