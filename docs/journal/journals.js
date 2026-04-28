import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import { createEntry, pageEntries, searchEntries } from './journal.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const messageParam = urlParams.get('message')
    const message = messageParam || 'Loading...'
    setMessage(message)

    build()

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    react()

    const [{ data }, { user }] = await Promise.all([pageEntries(), getMe()])

    state.set('main-documents', data)
    state.set('app-mode', 'left-panel')
    state.set('user', user)
    state.set('default-page', 'journal')

    document
      .querySelector('#next-page')
      .classList.toggle('hidden', data.length < 20)

    if (messageParam) {
      const url = new URL(window.location)
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url)
    } else {
      setMessage()
    }

    window.state = state // avail to browser console
  } catch (error) {
    setMessage(error.message, { type: 'danger' })
    console.trace(error)
  }
})

async function build() {
  document.title = 'Journal | Everything App'
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
  columnsWrapperEl.appendChild(createRightDrawer())

  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('form-submit:left-panel-search', 'journal', reactSearch)

  state.on('icon-click:add-entry', 'journal', reactEntryAdd)

  state.on('button-click:next-page', 'journal', reactPageEntries)
}

/**
 *
 */
async function reactEntryAdd({ id: btnId }) {
  const addBtn = document.getElementById(btnId)
  addBtn.disabled = true

  const id = `ev${crypto.randomUUID()}`
  const visit_date = new Date().toISOString()

  const { error } = await createEntry(id, visit_date)
  if (error) {
    console.error(`Journal server error: ${error}`)
    return
  }

  window.location.href = `./journal.html?id=${id}`
}

/**
 *
 */
async function reactPageEntries() {
  let page = state.get('journal-page')
  if (typeof page === 'undefined') page = 0
  page++
  const { data, error } = await pageEntries(page)

  if (error) {
    console.error(`Journal server error: ${error}`)
    return
  }

  state.set('journal-page', page)
  let entries = []
  if (page === 0) {
    entries = data
  } else {
    entries = [...state.get('main-documents'), ...data]
  }
  state.set('main-documents', entries)

  document
    .querySelector('#next-page')
    .classList.toggle('hidden', data.length < 20)
}

async function reactSearch() {
  let resp

  const query = document.querySelector('[name="search-entry"]').value?.trim()

  if (query.length) {
    resp = await searchEntries(query)
  } else {
    // get most recent entries instead
    resp = await pageEntries()
  }

  const { data, message } = resp
  if (message) {
    console.error(`Journal server error: ${message}`)
    return
  }
  state.set('main-documents', data)
}
