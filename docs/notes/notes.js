import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { toolbar } from './sections/toolbar.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { setMessage } from '../assets/js/ui.js'
import { createNote, deleteNote, fetchNotes, searchNotes } from './notes.api.js'
import { createModalShare } from '../assets/composites/modalShare.js'
import { getMe } from '../users/users.api.js'
import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    build()

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()

    const [{ notes }, { user }] = await Promise.all([fetchNotes(), getMe()])

    state.set('main-documents', notes)
    state.set('app-mode', 'left-panel')
    // state.set('app-mode', 'main-panel')
    // state.set('active-doc', 'i-9fef4948-5e88-4b11-8b2a-c61817797c3b')
    // setTimeout(() => document.querySelector('#edit').click(), 50)
    state.set('user', user)
    state.set('default-page', 'notes')

    window.state = state // avail to browser console
    setMessage({ message: '' })
  } catch (error) {
    console.trace(error)
    setMessage({ message: error.message, type: 'danger' })
    // window.location.href = `../home/index.html?message=${error.message}`
  }
})

function build() {
  document.head.title = 'Notes | Everything App'
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
  wrapperEl.appendChild(createModalShare({}))
  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('form-submit:left-panel-search', 'notes', reactSearch)

  state.on('icon-click:add-note', 'notes', reactAddNote)

  state.on('button-click:modal-delete-btn', 'notes', reactNoteDelete)

  state.on('sharer-click', 'notes', () => {
    const modalEl = document.querySelector('#modal-share')
    modalEl.showModal()
  })
}

async function reactAddNote({ id: btnId }) {
  const addBtn = document.getElementById(btnId)
  addBtn.disabled = true

  const { id, title } = await createNote()

  const doc = {
    id,
    title,
    note: '',
  }

  state.set('main-documents', [doc, ...state.get('main-documents')])
  state.set('active-doc', id)
  state.set('app-mode', 'main-panel')

  delete addBtn.disabled
  document.querySelector('#edit').click()
}

async function reactNoteDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc')
  const { message } = await deleteNote(id)

  setMessage({ message })

  modalEl.close()

  state.set('active-doc', null)
  const filteredDocs = state
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  state.set('main-documents', filteredDocs)
  state.set('app-mode', 'left-panel')
}

async function reactSearch() {
  let resp

  const query = document.querySelector('[name="search-note"]').value?.trim()

  if (query.length) {
    resp = await searchNotes(query)
  } else {
    // get most recent notes instead
    resp = await fetchNotes()
  }

  const { data, message } = resp
  if (message) {
    console.error(`Notes server error: ${message}`)
    return
  }
  state.set('main-documents', data)
}
