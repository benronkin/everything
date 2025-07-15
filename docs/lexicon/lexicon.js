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
import { createEntry, fetchEntry } from './lexicon.api.js'
import {
  handleSearch,
  handleFieldChange,
  handleNameChange,
  handleEntryDelete,
  handleSenseDelete,
} from './lexicon.handlers.js'

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

    let [{ user }, { users }] = await Promise.all([getMe(), fetchUsers()])

    if (user.prefs) user.prefs = JSON.parse(user.prefs)

    const urlParams = new URLSearchParams(window.location.search)
    const t = urlParams.get('title')
    if (t) {
      const { entry } = await fetchEntry(t)
      if (!entry) {
        setMessage({ message: `"${t}" does not exist` })
        return
      }
      entry.senses = JSON.parse(entry.senses)

      state.set('main-documents', [entry])
      state.set('active-doc', t)
      state.set('app-mode', 'main-panel')
    } else {
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
  state.on('icon-click:add', 'lexicon', reactEntryAdd)

  state.on('button-click:add-entry', 'lexicon', reactEntryAdd)

  state.on('button-click:modal-delete-btn', 'lexicon', () => {
    const { title, id } = state.get('modal-delete-payload')
    if (title) handleEntryDelete()
    if (id) handleSenseDelete()
  })

  state.on('form-submit:left-panel-search', 'lexicon', handleSearch)

  state.on('field-change', 'lexicon', handleFieldChange)

  state.on('name-change', 'lexicon', handleNameChange)
}

async function reactEntryAdd() {
  const title =
    state.get('active-doc') || state.get('lexicon-search').q || 'new entry'

  const id = `ev${crypto.randomUUID()}`

  const sense = {
    id,
    title: title.trim().toLowerCase(),
    created_at: new Date().toISOString(),
    submitter: state.get('user').id,
  }

  const { error } = await createEntry(sense)
  if (error) {
    setMessage({ message: `Lexicon server error: ${error}` })
    return
  }

  const docs = state.get('main-documents')
  let doc = docs.find((d) => d.title === title)
  if (doc) {
    doc.senses.push(sense)
  } else {
    delete sense.entry
    doc = {
      title,
      senses: [sense],
    }
    docs.unshift(doc)
  }

  state.set('main-documents', [...docs])
  state.set('active-doc', title) // reactivate mainPanel
  state.set('app-mode', 'main-panel') // if added from left-panel
}
