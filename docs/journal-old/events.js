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
  /* When a journal entry is confirmed delete */
  document.addEventListener('modal-delete-confirmed', handleDeleteConfirmed)

  /* When the add photo form is submitted */
  getEl('add-photo-form').addEventListener('submit', handleAddPhotoSubmit)
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
