import { state } from '../assets/js/state.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { nav } from './sections/nav.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { handlRightDrawerState } from '../assets/js/ui.js'
import { toolbar } from './sections/toolbar.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { labels } from './sections/labels.js'
import { setMessage } from '../assets/js/ui.js'
import {
  deleteNote,
  fetchNote,
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
    const urlParams = new URLSearchParams(window.location.search)
    const url = new URL(window.location)
    const messageParam = urlParams.get('message')
    const message = messageParam || 'Loading...'
    setMessage(message)

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    build()
    listen()
    react()

    const id = urlParams.get('id')

    const [{ note }, { labels }, { assignments }, { user }] = await Promise.all(
      [fetchNote(id), fetchLabels(), fetchLabelsAssignments(), getMe()],
    )

    if (note.user_id === user.id) note.role = 'owner'

    state.set('main-documents', [note])
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

    const mode = urlParams.get('mode')
    if (mode === 'edit') {
      document.getElementById('edit-note').click()
      requestAnimationFrame(() => {
        document.getElementById('note-title').focus()
      })
      url.searchParams.delete('mode')
      window.history.replaceState({}, '', url)
    }
    if (!messageParam) {
      setMessage()
    } else {
      url.searchParams.delete('message')
    }
    window.state = state // avail to browser console
  } catch (error) {
    console.trace(error)
    setMessage(error.message, { type: 'danger' })
  }
})

function build() {
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
  wrapperEl.appendChild(createModalShare({}))
  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('main-documents', 'note', (docs) => {
    document.title = `${docs[0].title} | Everything App`
  })
  state.on('field-changed', 'note', handleFieldChange)

  state.on('button-click:modal-delete-btn', 'note', reactNoteDelete)

  state.on('sharer-click', 'note', () => {
    const modalEl = document.querySelector('#modal-share')
    modalEl.showModal()
  })

  state.on('note-label-update', 'note', handleLabelUpdate)

  state.on('icon-click:labels', 'note', () => {
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

  window.location = `./index.html?message=${message}`
}

/**
 *
 */
async function handleFieldChange(el) {
  if (!el) return

  if (['label-title'].includes(el.name)) return

  const id = state.get('active-doc')
  const doc = state.get('main-documents')[0]
  const title = document.querySelector('#note-title').value
  const note = document.querySelector('.markdown-editor').value

  let updated_at = doc.updated_at

  if (state.get('update-in-process')) {
    console.log('update in process')
    return
  }

  state.set('update-in-process', true)

  const { error, data } = await updateNote({ id, title, note, updated_at })

  if (error) {
    setMessage(error, { type: 'danger' })
    if (data) {
      const { debug } = data
      console.log(debug)
    }
    document.querySelector('.markdown-editor').disabled = true
    state.set('update-in-process', false)
    return
  }

  doc.updated_at = data.updated_at
  state.set('main-documents', [doc])

  document.querySelector('.markdown-wrapper').updateViewer()
  state.set('update-in-process', false)
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
