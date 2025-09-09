import { state } from '../assets/js/state.js'
import { getWebApp, postWebAppJson } from '../assets/js/io.js'

const url = `${state.const('APP_URL')}/books`

export async function createBook() {
  const { id, error } = await getWebApp(`${url}/create`)
  return { id, error }
}

export async function deleteBook(id) {
  const { book, error } = await getWebApp(`${url}/delete?id=${id}`)
  return { data: book, error }
}

export async function fetchRecentBooks() {
  const resp = await getWebApp(`${url}/read`)
  const { books, error } = resp
  return { data: books, error }
}

export async function fetchBook(id) {
  const resp = await getWebApp(`${url}/read-one?id=${id}`)
  const { book, error } = resp
  return { book, error }
}

export async function searchBooks(q) {
  const { books, error } = await getWebApp(
    `${url}/search?q=${q.trim().toLowerCase()}`
  )
  return { data: books, error }
}

export async function updateBook({ id, section, value }) {
  const { message, error } = await postWebAppJson(`${url}/update`, {
    id,
    value,
    section,
  })
  return { message, error }
}
