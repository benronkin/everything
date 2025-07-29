import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createBook,
  deleteBook,
  fetchRecentBooks,
  searchBooks,
  updateBook,
} from './books.api.js'
// import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()
    listen()

    let [{ books, error }, { user }] = await Promise.all([
      fetchRecentBooks(),
      getMe(),
    ])

    if (error) {
      setMessage({ message: error, type: 'danger' })
      return
    }

    setMessage()
    state.set('main-documents', books)
    state.set('app-mode', 'left-panel')
    state.set('user', user)
    state.set('default-page', 'books')
    window.state = state // avail to browser console
  } catch (error) {
    setMessage({ message: error.message, type: 'danger' })
    console.trace(error)
  }
})

async function build() {
  document.head.title = 'Books | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('icon-click:add-book', 'books', reactBookAdd)

  state.on('button-click:modal-delete-btn', 'books', reactBookDelete)

  state.on('form-submit:left-panel-search', 'books', reactBookSearch)
}

function listen() {
  // When book field loses focus
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })
}

async function reactBookAdd() {
  const addBtn = document.getElementById('add-book')
  addBtn.disabled = true

  const { id, error } = await createBook()
  if (error) {
    console.error(`Books server error: ${error}`)
    return
  }

  const dateString = new Date().toISOString()

  const doc = {
    id,
    title: 'new Book',
    created_at: dateString,
  }

  state.set('main-documents', [doc, ...state.get('main-documents')])
  state.set('active-doc', id)
  state.set('app-mode', 'main-panel')

  delete addBtn.disabled
}

async function reactBookDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc')
  const { error } = await deleteBook(id)

  if (error) {
    modalEl.message(error)
    return
  }
  modalEl.close()

  const filteredDocs = state
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  state.set('main-documents', filteredDocs)
  state.set('app-mode', 'left-panel')
}

async function reactBookSearch() {
  let resp

  const query = document.querySelector('[name="search-book"]').value?.trim()

  if (query.length) {
    resp = await searchBooks(query)
  } else {
    // get most recent entries instead
    resp = await fetchRecentBooks()
  }

  const { data, message } = resp
  if (message) {
    console.error(`Book server error: ${message}`)
    return
  }
  state.set('main-documents', data)
}

async function handleFieldChange(e) {
  const elem = e.target
  const section = elem.name
  let value = elem.value

  const id = state.get('active-doc')
  const docs = state.get('main-documents')
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx][section] = value
  state.set('main-documents', docs)

  try {
    const { error } = await updateBook({ id, section, value })
    if (error) {
      throw new Error(error)
    }
    // log(message)
  } catch (error) {
    setMessage({ message: error, type: 'danger' })
  }
}
