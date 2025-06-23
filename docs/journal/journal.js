import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createEntry,
  deleteEntry,
  fetchDefaults,
  fetchGeoIndex,
  fetchRecentEntries,
  searchEntries,
  updateEntry,
  updateGeoIndex,
  updateJournalDefaults,
} from './journal.api.js'
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
    listen()

    const [entriesResp, geoIndexResp, defaultsResp] = await Promise.all([
      fetchRecentEntries(),
      fetchGeoIndex(),
      fetchDefaults(),
    ])

    const { data } = entriesResp
    const { tree } = geoIndexResp
    const { defaults } = defaultsResp
    state.set('main-documents', data)
    state.set('app-mode', 'left-panel')
    state.set('default-page', 'journal')
    state.set('country-state-city-tree', JSON.parse(tree))
    state.set('country-state-city-page', 0)
    state.set('journal-defaults', defaults)
    window.state = state // avail to browser console
  } catch (error) {
    setMessage({ message: error.message, type: 'danger' })
    // window.location.href = `../home/index.html?message=${error.message}`
    console.trace(error)
  }
})

async function build() {
  document.head.title = 'Journal | Everything App'
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
  state.on('form-submit:left-panel-search', 'journal', reactSearch)

  state.on('icon-click:add-entry', 'journal', reactEntryAdd)

  state.on('button-click:modal-delete-btn', 'journal', reactEntryDelete)
}

function listen() {
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })
}

async function reactEntryAdd({ id: btnId }) {
  const addBtn = document.getElementById(btnId)
  addBtn.disabled = true

  const { id, error } = await createEntry()
  if (error) {
    console.error(`Journal server error: ${error}`)
    return
  }

  const defaults = state.get('journal-defaults') || {
    city: '',
    state: '',
    country: '',
  }

  const dateString = new Date().toISOString()

  const doc = {
    id,
    location: 'New entry',
    created_at: dateString,
    visit_date: dateString,
    city: defaults.city,
    state: defaults.state,
    country: defaults.country,
    notes: '',
  }

  state.set('main-documents', [doc, ...state.get('main-documents')])
  state.set('active-doc', doc.id)
  state.set('app-mode', 'main-panel')

  delete addBtn.disabled
}

async function reactEntryDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc')
  const password = modalEl.getPassword()
  const { error } = await deleteEntry(id, password)

  if (error) {
    modalEl.message(error)
    return
  }

  modalEl.setPassword('')
  modalEl.close()

  const filteredDocs = state
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  state.set('main-documents', filteredDocs)
  state.set('app-mode', 'left-panel')
}

async function reactSearch() {
  let resp

  const query = document.querySelector('[name="search-entry"]').value?.trim()

  if (query.length) {
    resp = await searchEntries(query)
  } else {
    // get most recent entries instead
    resp = await fetchRecentEntries()
  }

  const { data, message } = resp
  if (message) {
    console.error(`Journal server error: ${message}`)
    return
  }
  state.set('main-documents', data)
}

async function handleFieldChange(e) {
  const elem = e.target
  const section = elem.name
  let value = elem.value

  const id = state.get('active-doc')
  const docs = [...state.get('main-documents')]
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx][section] = value
  state.set('main-documents', docs)

  try {
    const { error } = await updateEntry({ id, section, value })
    if (error) {
      throw new Error(error)
    }

    if (['city', 'state', 'country'].includes(section)) {
      await updateJournalDefaults({ id, section, value })

      const defaults = state.get('journal-defaults')
      defaults[section] = value
      state.set('journal-defaults', defaults)
    }
  } catch (err) {
    log(err)
  }
}
