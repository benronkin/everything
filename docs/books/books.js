import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { modalBookCards } from './sections/modalBookCards.js'
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
  fetchBook,
  fetchRecentBooks,
  searchBooks,
  updateBook
} from './books.api.js'
// import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()
    setMessage('Loading...')

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()

    let [{ data, error }, { user }] = await Promise.all([
      fetchRecentBooks(),
      getMe()
    ])

    if (error) {
      setMessage(error, { type: 'danger' })
      return
    }

    const books = data
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if (id) {
      const docExists = books.find((book) => book.id === id)
      if (!docExists) {
        const newDoc = await fetchBook(id)
        books.unshift(newDoc)
      }
      state.set('main-documents', books)
      state.set('active-doc', id)
      state.set('app-mode', 'main-panel')
    } else {
      state.set('main-documents', books)
      state.set('app-mode', 'left-panel')
    }

    state.set('user', user)
    state.set('default-page', 'books')
    window.state = state // avail to browser console
    setMessage()
  } catch (error) {
    setMessage(error.message, { type: 'danger' })
    console.trace(error)
  }
})

async function build() {
  document.title = 'Books | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper'
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(createRightDrawer())
  wrapperEl.appendChild(createFooter())
  wrapperEl.appendChild(modalBookCards())
}

function react() {
  state.on('icon-click:add-book', 'books', reactBookAdd)

  state.on('icon-click:book-info', 'books', reactBookInfo)

  state.on('button-click:modal-delete-btn', 'books', reactBookDelete)

  state.on('form-submit:left-panel-search', 'books', reactBookSearch)

  state.on('field-changed', 'books', handleFieldChange)

  state.on('card-click', 'books', reactBookCardClick)
}
async function reactBookAdd() {
  const addBtn = document.getElementById('add-book')
  addBtn.disabled = true

  const { id, error } = await createBook()
  if (error) {
    console.error(`Books server error: ${error}`)
    return
  }

  const date = new Date()
  const created_at = date.toISOString()
  const read_year = date.getFullYear()

  const doc = {
    id,
    title: 'new Book',
    created_at,
    read_year,
    completed: '0'
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

  if (query?.length) {
    resp = await searchBooks(query)
  } else {
    // get most recent entries instead
    resp = await fetchRecentBooks()
  }

  const { data, error } = resp

  if (error) {
    console.log('Server error:', error)
  }

  state.set('main-documents', data)
  state.set('app-mode', 'left-panel')
}

/**
 *
 */
async function reactBookInfo() {
  const el = document.getElementById('book-info')
  try {
    setMessage('Fetching books, one moment...')
    el.classList.add('disabled')
    const title = getBookTitle()
    const url = getBookListUrl(title)
    const bookList = await getBookList(url, title)
    // const bookList = await getDummyBookList()

    const dialog = document.getElementById('dialog')
    dialog.setHeader('Select book')
    dialog.setBody(bookList)
    setMessage()
    dialog.showModal()
    // Reset after opening, since dialog autofocus can scroll to Cancel.
    dialog.scrollTop = 0
  } catch (error) {
    console.log(error)
    setMessage(error.message)
  } finally {
    el.classList.remove('disabled')
  }
}

/**
 *
 */
async function reactBookCardClick(book) {
  try {
    book.description = await getBookDescription(book)
  } catch (error) {
    console.log(error)
    setMessage(error.message)
  }

  let el = document.getElementById('book-author')
  el.value = book.author_name
  handleFieldChange(el)
  el = document.getElementById('book-published-year')
  el.value = book.first_publish_year
  handleFieldChange(el)
  el = document.querySelector('.markdown-wrapper')
  el.updateEditor(book.description)
  handleFieldChange(document.querySelector('.markdown-editor'))
}

async function handleFieldChange(el) {
  const id = state.get('active-doc')
  if (!id) return

  const section = el.name
  let value = el.value

  if (section === 'completed') {
    value = value ? '1' : '0'
  }

  const docs = state.get('main-documents')
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx][section] = value
  state.set('main-documents', docs)

  updateBook({ id, section, value })
  setMessage('Saved', { type: 'quiet' })
}

/**
 *
 */
function getBookTitle() {
  const title = document.getElementById('book-title').value?.trim()
  if (!title) {
    throw new Error(`Enter a title and try again`)
  }
  return title
}

/**
 *
 */
function getBookListUrl(title) {
  const params = {
    title: title.trim(),
    fields: 'key,title,author_name,first_publish_year',
    limit: '20'
  }

  const queryString = new URLSearchParams(params).toString()
  const url = `https://openlibrary.org/search.json?${queryString}`
  return url
}

/**
 *
 */
async function getBookList(url, title) {
  const resp = await fetch(url)
  if (!resp.ok) {
    throw new Error(`OpenLibrary returned HTTP ${resp.status}`)
  }

  const data = await resp.json()
  if (!data.numFound) {
    throw new Error(`OpenLibrary has no book with title "${title}"`)
  }
  return data.docs
}

/**
 *
 */
async function getBookDescription(book) {
  if (!book?.key) throw new Error(`Did not receive book key`)
  const resp = await fetch(`https://openlibrary.org${book.key}.json`)
  if (!resp.ok) {
    throw new Error(`OpenLibrary returned HTTP ${resp.status}`)
  }

  const data = await resp.json()
  const description =
    typeof data.description === 'string'
      ? data.description
      : data.description?.value || 'No details availble'
  return description
}

/**
 *
 */
function getDummyBookList() {
  return [
    {
      author_name: ['Richard K. Morgan'],
      first_publish_year: 2004,
      key: '/works/OL5730140W',
      title: 'Market Forces'
    },
    {
      author_name: ['Molly Dunigan', 'Ulrich Petersohn'],
      first_publish_year: 2015,
      key: '/works/OL21283132W',
      title: 'Markets for Force'
    }
  ]
}
