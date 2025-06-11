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
import { createNote, deleteNote, fetchNotes } from './notes.api.js'
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

    const resp = await fetchNotes()
    const { notes, error } = resp

    if (error) {
      setMessage({ message: error, type: 'danger' })
    }

    state.set('main-documents', notes)
    state.set('active-doc', state.get('main-documents')[0]) // <<<<<< DELETE
    state.set('app-mode', 'main-panel')
    state.set('default-page', 'notes')
    window.state = state // avail to browser console
    setMessage({ message: '' })
  } catch (error) {
    console.trace(error)
    setMessage({ message: error.message, type: 'danger' })
    // window.location.href = `../home/index.html?message=${error.message}`
  }
})

// ------------------------
// Helpers
// ------------------------

/**
 *
 */
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

  wrapperEl.appendChild(createFooter())
}

/**
 * Subscribe to state.
 */
function react() {
  state.on('icon-click:add-note', 'notes', reactAddNote)
  state.on('button-click:modal-delete-btn', 'notes', reactNoteDelete)
}

/**
 * Add a journal entry
 */

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
  state.set('active-doc', doc)
  state.set('app-mode', 'main-panel')

  delete addBtn.disabled
}

/**
 *
 */
async function reactNoteDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc').id
  const { message } = await deleteNote(id)

  setMessage({ message })

  modalEl.close()

  const filteredDocs = state
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  state.set('main-documents', filteredDocs)
  state.set('app-mode', 'left-panel')
}
