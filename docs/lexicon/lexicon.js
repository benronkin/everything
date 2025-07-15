import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { getMe, fetchUsers } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createEntry,
  deleteEntry,
  fetchEntry,
  fetchRecentEntries,
  updateEntry,
} from './lexicon.api.js'
import { fetchOrSearch } from './lexicon.handlers.js'
import { log } from '../assets/js/logger.js'

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

    let [{ entries, error: entriesError }, { user }, { users }] =
      await Promise.all([fetchRecentEntries(), getMe(), fetchUsers()])

    if (entriesError) {
      setMessage({
        message: `fetchRecentEntries server error: ${entriesError}`,
        type: 'danger',
      })
      return
    }

    if (user.prefs) user.prefs = JSON.parse(user.prefs)

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if (id) {
      const docExists = entries.find((e) => e.id === id)
      if (!docExists) {
        const newDoc = await fetchEntry(id)
        entries.unshift(newDoc)
      }
      state.set('main-documents', entries)
      state.set('active-doc', id)
      state.set('app-mode', 'main-panel')
    } else {
      state.set('main-documents', entries)
      state.set('app-mode', 'left-panel')
    }

    state.set('user', user)
    state.set('users', users)
    state.set('default-page', 'lexicon')
    window.state = state // avail to browser console
    setMessage()
  } catch (error) {
    setMessage({ message: error.message, type: 'danger' })
    console.trace(error)
  }
})

async function build() {
  document.head.title = 'Lexicon | Everything App'
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
  state.on('button-click:add-entry', 'lexicon', reactEntryAdd)

  state.on('button-click:modal-delete-btn', 'lexicon', reactEntryDelete)

  state.on('form-submit:left-panel-search', 'lexicon', fetchOrSearch)
}

function listen() {
  // When field loses focus
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })
}

async function reactEntryAdd() {
  const id = `ev${crypto.randomUUID()}`

  const doc = {
    id,
    entry: state.get('lexicon-search').q || 'new entry',
    created_at: new Date().toISOString(),
    submitter: state.get('user').id,
    submitterName: state.get('user').first_name,
  }

  const { error } = await createEntry(doc)
  if (error) {
    setMessage({ message: `Lexicon server error: ${error}` })
    return
  }

  state.set('main-documents', [doc, ...state.get('main-documents')])
  state.set('active-doc', id)
  state.set('app-mode', 'main-panel')
}

async function reactEntryDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc')
  const { error } = await deleteEntry(id)

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
    const { error } = await updateEntry({ id, section, value })
    if (error) {
      throw new Error(error)
    }
    // log(message)
  } catch (error) {
    setMessage({ message: error, type: 'danger' })
  }
}
