/* 
  This module handles journal events so that the journal.js stays leaner. 
  This module loads aftr all partials were created.
*/

/* global imageCompression */

import { getEl } from '../_assets/js/ui.js'
import { getWebApp, postWebAppForm, postWebAppJson } from '../_assets/js/io.js'

// ----------------------
// Exports
// ----------------------

/**
 * Set multiple the event handlers of the recipes page
 */
export function setEvents() {
  /* When the add photo toggle is clicked */
  getEl('add-photo-toggle').addEventListener('click', handleAddPhotoToggle)

  /* When journal field loses focus */
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })

  /* When a new journal entry is created */
  getEl('add-journal').addEventListener('click', handleJournalCreate)

  /* When a journal entry is confirmed delete */
  document.addEventListener('modal-delete-confirmed', handleDeleteConfirmed)

  /* When the add photo form is submitted */
  getEl('add-photo-form').addEventListener('submit', handleAddPhotoSubmit)
}

/**
 * Format an entry title
 */
export function createEntryTitle(location, visit_date) {
  const [, month, day] = visit_date.split('T')[0].split('-')
  const formatted = `(${month}/${day})`

  const el = document.createElement('span')
  let textNode = document.createTextNode(`${location} `)
  el.appendChild(textNode)
  const innerSpan = document.createElement('span')
  innerSpan.className = 'smaller'
  innerSpan.style.fontWeight = '200'
  textNode = document.createTextNode(formatted)
  innerSpan.appendChild(textNode)
  el.appendChild(innerSpan)

  return el
}

// ----------------------
// Event handlers
// ----------------------

/**
 * Handle the add photo toggle
 */
function handleAddPhotoToggle() {
  getEl('add-photo-toggle').toggleClass('fa-close').toggleClass('fa-camera')

  const addPhotoForm = getEl('add-photo-form')
  addPhotoForm.toggleClass('hidden')
  addPhotoForm.clear()
}

/**
 * Handle journal create
 */
async function handleJournalCreate() {
  getEl('add-journal').disabled = true
  const { id } = await getWebApp(`${state.getWebAppUrl()}/journal/create`)
  const { defaults } = await getWebApp(
    `${state.getWebAppUrl()}/journal/defaults/read`
  )

  const dateString = new Date().toISOString()

  const newEntry = {
    id,
    location: 'New entry',
    created_at: dateString,
    visit_date: dateString,
    city: defaults.city,
    state: defaults.state,
    country: defaults.country,
    notes: '',
  }
  state.push('journal', newEntry)
  state.set('active-doc', newEntry)

  getEl('add-journal').disabled = false
}

/**
 * Handle journal entry field change
 */
async function handleFieldChange(e) {
  const elem = e.target
  const section = elem.name
  let value = elem.value

  if (['location', 'visit_date'].includes(section)) {
    getEl('left-panel-list').getSelected().value = createEntryTitle(
      getEl('journal-location').value,
      getEl('journal-visit-date').value
    )
  }

  const id = getEl('journal-id').value

  const doc = { id, collection: 'journal', key: section, value }
  state.setById(doc)

  try {
    const { message, error } = await postWebAppJson(
      `${state.getWebAppUrl()}/journal/update`,
      {
        id,
        value,
        section,
      }
    )
    if (error) {
      throw new Error(error)
    }
    console.log(message)

    if (['city', 'state', 'country'].includes(section)) {
      await postWebAppJson(`${state.getWebAppUrl()}/journal/defaults/update`, {
        id,
        [section]: value,
      })
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Handle delete journal confirmation
 */
async function handleDeleteConfirmed() {
  const modal = getEl('modal-delete')
  modal.message = ''

  const id = getEl('journal-id').value
  const password = getEl('modal-delete-input').value
  const { error } = await getWebApp(
    `${state.getWebAppUrl()}/journal/delete?id=${id}&password=${password}`
  )

  if (error) {
    modal.message = error
    return
  }
  modal.close()
  state.delete('journal', id)
  getEl('left-panel-list').deleteChild(id)
  getEl('main-panel').hidden = true
}

/**
 * Handle the add photo form submit
 */
async function handleAddPhotoSubmit(e) {
  e.preventDefault()

  const addPhotoForm = getEl('add-photo-form')

  const formData = new FormData(addPhotoForm)

  const file = formData.get('file')
  if (!file || file.size === 0) {
    const message = 'Please select an image'
    console.log(message)
    addPhotoForm.message = message
    return
  }

  addPhotoForm.disabled = true
  addPhotoForm.message = 'Uploading...'

  const compressionOptions = {
    maxWidthOrHeight: 600,
    useWebWorker: true,
    fileType: 'image/jpeg',
    exifOrientation: null,
  }

  try {
    const file = formData.get('file')
    const compressed = await imageCompression(file, compressionOptions)
    formData.set('file', compressed)

    const { message } = await postWebAppForm(
      `${state.getWebAppUrl()}/journal/photos/create`,
      formData
    )
    if (message) {
      addPhotoForm.message = message
      console.log(message)
    }
    addPhotoForm.clear()
    await populateJournalImages(formData.get('entry'))
  } catch (err) {
    console.log(err)
    addPhotoForm.message = err.message
  }
}

/**
 * Handle caption edit of a photo
 */
async function handleCaptionChange(e) {
  const parent = e.target.closest('.image-gallery-item')
  const photoMessageEl = parent.querySelector('.photo-message')

  const id = parent.dataset.id

  const { message, error } = await postWebAppJson(
    `${state.getWebAppUrl()}/journal/photos/update`,
    {
      id,
      value: e.target.value,
      section: 'caption',
    }
  )
  if (error) {
    photoMessageEl.textContent = error.message
    return
  }
  photoMessageEl.textContent = message
}

/**
 * Handle photo deletion
 */
async function handlePhotoDelete(e) {
  const deleteEl = e.target
  const parent = e.target.closest('.image-gallery-item')
  const photoMessageEl = parent.querySelector('.photo-message')

  deleteEl.setAttribute('disabled', true)
  photoMessageEl.textContent = 'Deleting image...'
  const id = parent.dataset.id

  const { error } = await getWebApp(
    `${state.getWebAppUrl()}/journal/photos/delete?id=${id}`
  )

  if (error) {
    deleteEl.removeAttribute('disabled')
    photoMessageEl.textContent = error.message
    return
  }
  parent.remove()
}
