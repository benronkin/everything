import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { fetchUsers, getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createEntry,
  deleteEntry,
  fetchRecentEntries,
  searchEntries,
  updateEntry,
} from './lexicon.api.js'
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

    let [{ entries }, { user }, { users }] = await Promise.all([
      fetchRecentEntries(),
      getMe(),
      fetchUsers(),
    ])

    entries = entries.map((e) => {
      const submitterName = users.find((u) => u.id === e.submitter).first_name
      e.submitterName = submitterName
      return e
    })

    setMessage()
    state.set('main-documents', entries)
    state.set('app-mode', 'left-panel')
    state.set('user', user)
    state.set('default-page', 'lexicon')
    window.state = state // avail to browser console
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
  state.on('icon-click:add-entry', 'lexicon', reactEntryAdd)

  state.on('button-click:modal-delete-btn', 'lexicon', reactEntryDelete)

  state.on('form-submit:left-panel-search', 'lexicon', reactEntriesSearch)
}

function listen() {
  // When field loses focus
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })
}

async function reactEntryAdd() {
  const addBtn = document.getElementById('add-entry')
  addBtn.disabled = true

  const doc = {
    id: `ev${crypto.randomUUID()}`,
    entry: 'New entry',
    created_at: new Date().toISOString(),
  }

  const { id, error } = await createEntry(doc)
  if (error) {
    setMessage({ message: `Lexicon server error: ${error}` })
    return
  }

  state.set('main-documents', [doc, ...state.get('main-documents')])
  state.set('active-doc', id)
  state.set('app-mode', 'main-panel')

  delete addBtn.disabled
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

async function reactEntriesSearch() {
  let resp

  const query = document.querySelector('[name="search-lexicon"]').value?.trim()

  if (query.length) {
    resp = await searchEntries(query)
  } else {
    // get most recent entries instead
    resp = await fetchRecentEntries()
  }

  const { data, message } = resp
  if (message) {
    console.error(`Lexicon server error: ${message}`)
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
    const { error } = await updateEntry({ id, section, value })
    if (error) {
      throw new Error(error)
    }
    // log(message)
  } catch (error) {
    setMessage({ message: error, type: 'danger' })
  }
}
