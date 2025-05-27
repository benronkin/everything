/* 
  This module handles journal events so that the journal.js stays leaner. 
  This module loads aftr all dynamic fields have been created.
*/

/* global imageCompression */

import { state } from '../js/state.js'
import { getEl, isMobile, resizeTextarea, toggleExpander } from '../js/ui.js'
import { getWebApp, postWebAppForm, postWebAppJson } from '../js/io.js'
import { createImageGalleryItem } from '../partials/imageGalleryItem.js'
import { createMenuItem } from '../partials/menuItem.js'

// ----------------------
// Exports
// ----------------------

/**
 * Set multiple the event handlers of the recipes page
 */
export function setEvents() {
  /* When recipes array state changes */
  document.addEventListener('journal-state-changed', handleJournalStateChanged)

  /* When active recipe state changes */
  document.addEventListener(
    'active-journal-state-changed',
    handleActiveJournalStateChanged
  )

  /* When the add photo toggle is clicked */
  getEl('add-photo-toggle').addEventListener('click', handleAddPhotoToggle)

  /* When journal field loses focus */
  document.querySelectorAll('.field').forEach((field) => {
    field.addEventListener('change', handleFieldChange)
  })

  /* When a new journal entry is created */
  getEl('add-journal').addEventListener('click', handleJournalCreate)

  /* When the trash journal button is clicked */
  getEl('delete-entry-btn').addEventListener(
    'click',
    handleJournalDeleteBtnClick
  )

  /* When a journal entry is confirmed delete */
  document.addEventListener('delete-confirmed', handleDeleteConfirmed)

  /* When the add photo form is submitted */
  getEl('add-photo-form').addEventListener('submit', handleAddPhotoSubmit)
}

// ----------------------
// Event handlers
// ----------------------

/**
 * This reactive function is called when the document receives
 * journal-state-changed event from state.set('journal).
 */
function handleJournalStateChanged(e) {
  if (isMobile()) {
    getEl('main-icon-group').expand()
  }
  const children = e.detail.map((j) =>
    createMenuItem({
      id: j.id,
      value: createEntryTitle(j.location, j.visit_date),
      events: { click: handleJournalLinkClick },
    })
  )
  getEl('left-panel-list').deleteChildren().addChildren(children)
  if (!state.get('active-journal')) {
    return
  }

  // select the active recipe if it exists in the updated list
  const priorRecipe = getEl('left-panel-list').getChildById(
    state.get('active-journal')
  )
  if (!priorRecipe) {
    state.set('active-journal', null)
    return
  }
  priorRecipe.selected = true
}

/**
 * Load the journal object to the page
 */
function handleActiveJournalStateChanged(e) {
  const id = e.detail
  if (!id) {
    // active recipe has been cleared
    getEl('main-icon-group').expand()
    return
  }

  // Handle main-panel

  const journal = state.getJournalById(id)

  getEl('journal-location').value = journal.location
  getEl('journal-visit-date').value = new Date(journal.visit_date)
    .toISOString()
    .split('T')[0]
  const notesEl = getEl('journal-notes')
  notesEl.value = journal.notes
  resizeTextarea(notesEl)
  getEl('journal-city').value = journal.city
  getEl('journal-state').value = journal.state
  getEl('journal-country').value = journal.country
  getEl('journal-id').textContent = journal.id
  getEl('photo-entry-id').value = journal.id
  getEl('image-gallery').value = ''
  populateJournalImages(journal.id)
  getEl('main-panel').hidden = false
}

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
  state.set('active-journal', id)

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
 * Handle sidebar link click
 */
async function handleJournalLinkClick(e) {
  const elem = e.target.closest('.menu-item')
  state.set('active-journal', elem.dataId)
}

/**
 * Handle button click to show delete modal
 */
function handleJournalDeleteBtnClick() {
  const modal = document.querySelector('dialog[data-id="modal-delete"]')
  const name = createEntryTitle(
    getEl('journal-location').value,
    getEl('journal-visit-date').value
  )
  modal.body = `Delete entry: ${name.textContent}?`
  modal.showModal()
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
    maxSizeMB: 0.5,
    maxWidthOrHeight: 600,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
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

// ----------------------
// Helpers
// ----------------------

/**
 * Populate the journal photos
 */
async function populateJournalImages(id) {
  const { photos } = await getWebApp(
    `${state.getWebAppUrl()}/journal/photos/read?entry=${id}`
  )
  if (!photos.length) {
    return
  }
  for (const photo of photos) {
    const el = createImageGalleryItem({
      id: photo.id,
      imgSrc: photo.url,
      caption: photo.caption,
      expanderCb: toggleExpander,
      inputCb: handleCaptionChange,
      trashCb: handlePhotoDelete,
    })
    getEl('image-gallery').appendChild(el)
  }
}

/**
 * Format an entry title
 */
function createEntryTitle(location, visit_date) {
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
