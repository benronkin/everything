/* global imageCompression */
import { state } from '../assets/js/state.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { createRightDrawer } from '../assets/partials/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../assets/partials/div.js'
import { createFooter } from '../assets/composites/footer.js'
import { handleTokenQueryParam } from '../assets/js/io.js'
import { getMe } from '../users/users.api.js'
import { setMessage } from '../assets/js/ui.js'
import {
  addEntryPhoto,
  deleteEntry,
  deleteEntryPhoto,
  fetchEntry,
  fetchDefaults,
  fetchEntryPhotosMetadata,
  fetchGeoIndex,
  updateEntry,
  updateJournalDefaults,
  updatePhotoCaption,
} from './journal.api.js'

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

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')

    const [{ journal }, { tree }, { defaults }, { user }] = await Promise.all([
      fetchEntry(id),
      fetchGeoIndex(),
      fetchDefaults(),
      getMe(),
    ])

    state.set('main-documents', [journal])
    state.set('app-mode', 'main-panel')
    state.set('active-doc', id)
    state.set('country-state-city-tree', JSON.parse(tree))
    state.set('country-state-city-page', 0)
    state.set('journal-defaults', defaults)
    state.set('user', user)
    state.set('default-page', 'journal')

    window.state = state // avail to browser console

    setMessage()
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
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(createRightDrawer())
  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('active-doc', 'journal', async (id) => {
    const photosMetadata = await fetchEntryPhotosMetadata(id)
    state.set('photos-metadata', photosMetadata)
  })

  state.on('button-click:modal-delete-btn', 'journal', reactEntryDelete)

  state.on('field-changed', 'journal', handleFieldChange)

  state.on('photo-form-submit', 'recipes.js', async (formData) => {
    const compressionOptions = {
      maxWidthOrHeight: 600,
      useWebWorker: true,
      fileType: 'image/jpeg',
      exifOrientation: null,
    }

    const file = formData.get('file')
    const compressed = await imageCompression(file, compressionOptions)
    const id = state.get('active-doc')

    formData.set('file', compressed)
    formData.set('entry', id)

    const { message } = await addEntryPhoto(formData)

    state.set('photo-upload-response', message)
    // refresh photo list
    const photosMetadata = await fetchEntryPhotosMetadata(id)
    state.set('photos-metadata', photosMetadata)
  })

  state.on('photo-delete-request', 'recipes.js', async (id) => {
    const { error, message } = await deleteEntryPhoto(id)
    state.set('photo-delete-response', { error, message })
    // refresh photo list
    const entryId = state.get('active-doc')
    const photosMetadata = await fetchEntryPhotosMetadata(entryId)
    state.set('photos-metadata', photosMetadata)
  })

  state.on('photo-caption-change', 'recipes.js', async ({ id, value }) => {
    const { error, message } = await updatePhotoCaption({ id, value })
    state.set('photo-caption-response', { error, message })
    // refresh photo list
    const entryId = state.get('active-doc')
    const photosMetadata = await fetchEntryPhotosMetadata(entryId)
    state.set('photos-metadata', photosMetadata)
  })
}

/**
 *
 */
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

  window.location = './index.html?message=Journal+entry+deleted'
}

async function handleFieldChange(el) {
  const section = el.name
  let value = el.value

  if (['file', 'caption', 'password'].includes(section)) {
    console.log('Ignoring non-field')
    return
  }

  const id = state.get('active-doc')
  const docs = [...state.get('main-documents')]
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx][section] = value
  state.set('main-documents', docs)

  updateEntry({ id, section, value })
  setMessage('Saved', { type: 'quiet' })

  if (['city', 'state', 'country'].includes(section)) {
    await updateJournalDefaults({ id, section, value })

    const defaults = state.get('journal-defaults')
    defaults[section] = value
    state.set('journal-defaults', defaults)
  }
}
