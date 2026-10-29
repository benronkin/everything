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
  addMedia,
  deleteMedia,
  fetchMediaMetadata,
  getItem,
  deleteItem,
  updateItem,
  updateMediaCaption
} from './shopping.api.js'

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

    const [{ item, stores }, { user }] = await Promise.all([
      getItem(id),
      getMe()
    ])

    console.log('stores', stores)

    state.set('main-documents', [item])
    state.set('stores', stores)
    state.set('app-mode', 'main-panel')
    state.set('active-doc', id)
    state.set('user', user)
    state.set('default-page', 'shopping')

    window.state = state // avail to browser console

    if (item.temp) {
      const panel = document.getElementById('main-panel')
      panel.querySelector('#carted').classList.add('disabled')
      panel.querySelector('#recurring').classList.add('disabled')
      setMessage('This is a one-off item')
    } else {
      setMessage()
    }
  } catch (error) {
    setMessage(error.message, { type: 'danger' })
    console.trace(error)
  }
})

async function build() {
  document.title = 'Shopping Item | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper'
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(createRightDrawer())
  wrapperEl.appendChild(createFooter())
}

function react() {
  state.on('active-doc', 'journal', async (id) => {
    const mediaMetadata = await fetchMediaMetadata(id)
    state.set('media-metadata', mediaMetadata)
  })

  state.on(
    'button-click:modal-delete-btn',
    'shoppingItem',
    handleModalDeleteButtonClick
  )

  state.on('field-changed', 'shoppingItem', handleFieldChange)

  state.on('media-form-submit', 'shoppingItem', async (formData) => {
    let id

    try {
      const file = formData.get('file')
      id = state.get('active-doc')
      formData.set('file', file)
      formData.set('parent_id', id)
    } catch (error) {
      console.error(error)
      return
    }

    const { error, message } = await addMedia(formData)
    if (error) {
      state.set('media-upload-response', error)
      setMessage(error, { type: 'danger' })
      return
    }

    state.set('media-upload-response', message)
    // refresh photo list
    const mediaMetadata = await fetchMediaMetadata(id)
    state.set('media-metadata', mediaMetadata)
  })

  state.on('media-delete-request', 'journal', async (id) => {
    const { error, message } = await deleteMedia(id)
    state.set('media-delete-response', { error, message })
    // refresh media list
    const entryId = state.get('active-doc')
    const mediaMetadata = await fetchMediaMetadata(entryId)
    state.set('media-metadata', mediaMetadata)
  })
}

/**
 *
 */
async function handleModalDeleteButtonClick() {
  const modalDelete = document.querySelector('#modal-delete')
  const photoId = modalDelete.dataset.photo
  modalDelete.message('')

  if (photoId) {
    // handle delete entry photo
    const parent = document.getElementById(photoId)
    const trashEl = parent.querySelector('.fa-trash')
    trashEl.disabled = true
    state.set('media-delete-request', photoId)
    modalDelete.dataset.photo = ''
    modalDelete.close()
  } else {
    // handle delete entire entry
    const id = state.get('active-doc')
    const { error } = await deleteItem(id, 'all')

    if (error) {
      modalDelete.message(error)
      return
    }

    window.location = './index.html?message=Journal+entry+deleted'
  }
}

async function handleFieldChange(el) {
  const section = el.name
  let value = el.value

  if (section === 'caption') {
    await handleCaptionChange(el)
    return
  }

  if (['file', 'password', 'caption'].includes(section)) {
    console.log('Ignoring non-field')
    return
  }

  const id = state.get('active-doc')

  const { error, message } = await updateItem({ id, section, value })

  if (error) {
    setMessage(error, { type: 'danger' })
    return
  }

  const docs = [...state.get('main-documents')]
  const idx = docs.findIndex((d) => d.id === id)
  docs[idx][section] = value
  state.set('main-documents', docs)

  setMessage('Saved', { type: 'quiet' })
  return message
}

/**
 *
 */
async function handleCaptionChange(el) {
  if (el.id === 'media-caption-input') {
    // user is filling out caption in upload form
    // not editing existing caption
    return
  }

  const value = el.value

  const parent = el.closest('.media-item')
  const { error, message } = await updateMediaCaption({
    id: parent.id,
    value
  })

  state.set('media-caption-response', { error, message })

  if (error) {
    setMessage(error, { type: 'danger' })
    return
  }

  setMessage('Saved', { type: 'quiet' })
  return message
}
