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
import {
  createNote,
  deleteNote,
  fetchNotes,
  fetchNote,
  searchNotes,
} from './notes.api.js'
import { createModalShare } from '../assets/composites/modalShare.js'
import { getMe } from '../users/users.api.js'
import { log } from '../assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage('Loading...')

    build()

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()
    listen()

    const [{ notes }, { user }] = await Promise.all([fetchNotes(), getMe()])

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if (id) {
      const docExists = notes.find((note) => note.id === id)
      if (!docExists) {
        const newDoc = await fetchNote(id)
        notes.unshift(newDoc)
      }
      state.set('main-documents', notes)
      state.set('app-mode', 'main-panel')
      state.set('active-doc', id)
    } else {
      state.set('main-documents', notes)
      state.set('app-mode', 'left-panel')
    }

    state.set('user', user)
    state.set('default-page', 'notes')

    window.state = state // avail to browser console
    setMessage()
  } catch (error) {
    console.trace(error)
    setMessage(error.message, { type: 'danger' })
  }
})

function build() {
  document.title = 'Notes | Everything App'
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

function listen() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#right-panel')) {
      document.querySelector('#right-panel').classList.remove('open')
      document
        .querySelectorAll('[data-right-pannel-toggler]')
        .forEach((i) => i.classList.remove('on'))
    }
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
  if (document.querySelector('.editor').classList.contains('hidden')) {
    document.querySelector('#edit').click()
  }
}

async function reactNoteDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc')
  const { message } = await deleteNote(id)

  setMessage(message)

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
