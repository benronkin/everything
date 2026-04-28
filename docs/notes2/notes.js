import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'

import { toolbar } from './sections/toolbar.js'
import { leftPanel } from './sections/leftPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { labels } from './sections/labels.js'
import { handlRightDrawerState } from '../assets/js/ui.js'
import { setMessage } from '../assets/js/ui.js'
import {
  createNote,
  fetchNotes,
  searchNotes,
  addLabel,
  assignLabel,
  deleteLabel,
  fetchLabels,
  fetchLabelsAssignments,
  unassignLabel,
  updateLabel,
} from './notes.api.js'
import { getMe } from '../users/users.api.js'

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

    const [{ labels }, { assignments }, { notes }, { user }] =
      await Promise.all([
        fetchLabels(),
        fetchLabelsAssignments(),
        fetchNotes(),
        getMe(),
      ])

    state.set('main-documents', notes)
    state.set(
      'note-labels',
      labels.map(({ id, title }) => [id, title]),
    )
    state.set(
      'note-label-assignments',
      assignments.map(({ label_id, note_id }) => [label_id, note_id]),
    )

    const viewByLabel = localStorage.getItem('notes-by-label')
    if (viewByLabel?.length) {
      document.getElementById('labels').click()
      state.set('view-by-label', viewByLabel)
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
  columnsWrapperEl.appendChild(createRightDrawer())
  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('form-submit:left-panel-search', 'notes', reactSearch)

  state.on('icon-click:add-note', 'notes', reactAddNote)

  state.on('note-label-update', 'notes', handleLabelUpdate)

  state.on('icon-click:labels', 'notes', () => {
    handlRightDrawerState('labels')
    if (state.get('right-drawer-use') === 'labels') {
      labels(document.getElementById('right-drawer'))
    }
  })
}

function listen() {
  document.addEventListener('click', (e) => {
    if (
      !e.target.closest('.fa-ellipsis-vertical') &&
      !e.target.closest('#label-menu')
    ) {
      // not created until ellipsis is clicked for first time
      document.querySelector('#label-menu')?.classList.add('hidden')
    }
  })
}

async function reactAddNote({ id: btnId }) {
  const addBtn = document.getElementById(btnId)
  addBtn.disabled = true

  const { id } = await createNote()

  window.location.href = `./note.html?id=${id}&mode=edit`
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

/**
 *
 */
async function handleLabelUpdate(payload) {
  if (payload.action === 'assign' || payload.action === 'unassign')
    payload.noteId = state.get('active-doc')
  let resp

  switch (payload.action) {
    case 'add':
      resp = await addLabel(payload)
      break
    case 'assign':
      resp = await assignLabel(payload)
      break
    case 'delete':
      resp = await deleteLabel(payload)
      break
    case 'unassign':
      resp = await unassignLabel(payload)
      break
    case 'update':
      resp = await updateLabel(payload)
      break
  }

  const { error, data } = resp
  if (error) {
    setMessage(error, { type: 'danger' })
    return
  }
  state.set('note-label-response', { ...payload, ...data })

  // setMessage(message)
  document.getElementById('labels-dialog').close()
  document.getElementById('label-menu')?.classList.add('hidden')
}
