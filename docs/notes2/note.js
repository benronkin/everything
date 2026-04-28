import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
mport { createRightDrawer } from '../assets/partials/rightDrawer.js'

import { handlRightDrawerState } from '../assets/js/ui.js'
import { toolbar } from './sections/toolbar.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { labels } from './sections/labels.js'
import { setMessage } from '../assets/js/ui.js'
import {
  deleteNote,
  updateNote,
  addLabel,
  assignLabel,
  deleteLabel,
  fetchLabels,
  fetchLabelsAssignments,
  unassignLabel,
  updateLabel,
} from './notes.api.js'
import { createModalShare } from '../assets/composites/modalShare.js'
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

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')

    const [{ labels }, { assignments }, { user }] = await Promise.all([
      fetchLabels(),
      fetchLabelsAssignments(),
      getMe(),
    ])

    state.set('app-mode', 'main-panel')
    state.set('active-doc', id)
    state.set(
      'note-labels',
      labels.map(({ id, title }) => [id, title]),
    )
    state.set(
      'note-label-assignments',
      assignments.map(({ label_id, note_id }) => [label_id, note_id]),
    )

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
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(createRightDrawer())
  columnsWrapperEl.appendChild(createDiv({ id: 'right-drawer' }))
  wrapperEl.appendChild(createModalShare({}))
  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('field-changed', 'notes', handleFieldChange)

  state.on('button-click:modal-delete-btn', 'notes', reactNoteDelete)

  state.on('sharer-click', 'notes', () => {
    const modalEl = document.querySelector('#modal-share')
    modalEl.showModal()
  })

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
    const dialog = document.querySelector('#dialog')

    if (dialog?.open) return

    if (!e.target.closest('#right-drawer')) {
      document.querySelector('#right-drawer').classList.remove('open')
      document
        .querySelectorAll('[data-right-pannel-toggler]')
        .forEach((i) => i.classList.remove('on'))
      state.set('right-drawer-use', null)
    }

    if (
      !e.target.closest('.fa-ellipsis-vertical') &&
      !e.target.closest('#label-menu')
    ) {
      // not created until ellipsis is clicked for first time
      document.querySelector('#label-menu')?.classList.add('hidden')
    }
  })
}

async function reactNoteDelete() {
  const modalEl = document.querySelector('#modal-delete')
  modalEl.message('')

  const id = state.get('active-doc')
  const { message } = await deleteNote(id)

  setMessage(message)

  modalEl.close()

  // remove the id=note_id query param from the address bar
  // and from browser history (if needed, not sure it is)
  const url = new URL(window.location)
  url.searchParams.delete('id')
  window.history.replaceState({}, '', url)

  state.set('active-doc', null)
  const filteredDocs = state
    .get('main-documents')
    .filter((doc) => doc.id !== id)
  state.set('main-documents', filteredDocs)
  state.set('app-mode', 'left-panel')
}

async function handleFieldChange(el) {
  if (!el) return

  if (['search-note', 'label-title'].includes(el.name)) return

  const id = state.get('active-doc')
  const title = document.querySelector('#note-title').value
  const note = document.querySelector('.markdown-editor').value

  document.querySelector('.markdown-wrapper').updateViewer()

  updateNote({ id, title, note })
  setMessage('Saved', { type: 'quiet' })
}

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
