import { newState } from '../_assets/js/newState.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_composites/footer.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { setMessage } from '../_assets/js/ui.js'
import {
  createEntry,
  deleteEntry,
  fetchDefaults,
  fetchRecentEntries,
  searchEntries,
} from './journal.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    build()

    react()

    const { data } = await fetchRecentEntries()
    newState.set('main-documents', data)
    newState.set('app-mode', 'left-panel')
    newState.set('default-page', 'journal')

    window.newState = newState // avail to browser console
  } catch (error) {
    console.trace(error)
    // window.location.href = `../index.html?error=${error.message}`
  }
})

// ------------------------
// Helper functions
// ------------------------

/**
 *
 */
async function build() {
  document.head.title = 'Journal | Ben'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })

  body.prepend(wrapperEl)

  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())
  wrapperEl.appendChild(columnsWrapperEl)
  wrapperEl.appendChild(createFooter())

  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())
}

/**
 *
 */
function react() {
  newState.on('form-submit:left-panel-search', 'journal', reactSearch)
  newState.on('icon-click:add-entry', 'journal', reactEntryAdd)
  newState.on('button-click:modal-delete-btn', 'journal', reactEntryDelete)
}

/**
 * Add a journal entry
 */

async function reactEntryAdd({ id: btnId }) {
  const addBtn = document.getElementById(btnId)
  addBtn.disabled = true

  const { id, error } = await createEntry()
  if (error) {
    console.error(`Journal server error: ${error}`)
    return
  }

  const { defaults, error: error2 } = await fetchDefaults()
  if (error2) {
    console.error(`Journal server error: ${error2}`)
    return
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

  newState.set('main-documents', [doc, ...newState.get('main-documents')])
  newState.set('active-doc', doc)
  newState.set('app-mode', 'main-panel')

  delete addBtn.disabled
}

/**
 *
 */
async function reactEntryDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = newState.get('active-doc').id
  const password = modalEl.getPassword()
  const { error } = await deleteEntry(id, password)

  if (error) {
    modalEl.message(error)
    return
  }

  modalEl.setPassword('')
  modalEl.close()

  const filteredDocs = newState
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  newState.set('main-documents', filteredDocs)
  newState.set('app-mode', 'left-panel')
}

/**
 *
 */
async function reactSearch(doc) {
  let resp

  if (doc['search-entry'].trim().length) {
    resp = await searchEntries(doc['search-entry'])
  } else {
    // get most recent entries instead
    resp = await fetchRecentEntries()
  }

  const { data, message } = resp
  if (message) {
    console.error(`Journal server error: ${message}`)
    return
  }
  newState.set('main-documents', data)
}
