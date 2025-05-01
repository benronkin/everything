import { state } from '../js/state.js'
import { createNav } from '../partials/nav.js'
import { createFooter } from '../partials/footer.js'
import { createSidebarLink } from '../partials/left-sidebar-link.js'
import { createRightDrawer } from '../partials/right-drawer.js'
import { MODAL, initDialog, setDialog } from '../partials/modal.js'
import { createImageGalleryItem } from '../partials/imageGalleryItem.js'
import { setMessage, resizeTextarea, isMobile, toggleExpander } from '../js/ui.js'
import { handleTokenQueryParam, getWebApp, postWebAppForm, postWebAppJson } from '../js/io.js'

// ----------------------
// Globals
// ----------------------

const leftPanelToggle = document.querySelector('#left-panel-toggle')
const addJournalBtn = document.querySelector('#add-journal')
const searchJournalsEl = document.querySelector('#search-journals')
const searchJournalsMessageEl = document.querySelector('#search-journals-message')
const leftSidebarList = document.querySelector('#left-sidebar-list')
const mainPanelEl = document.querySelector('#main-panel')
const journalDeleteBtn = document.querySelector('#delete-entry-btn')
const addPhotoToggle = document.querySelector('#add-photo-toggle')
const addPhotoForm = document.querySelector('#add-photo-form')

const locationEl = document.querySelector('#journal-location')
const visitDateEl = document.querySelector('#journal-visit-date')
const cityEl = document.querySelector('#journal-city')
const stateEl = document.querySelector('#journal-state')
const countryEl = document.querySelector('#journal-country')
const notesEl = document.querySelector('#journal-notes')
const idEl = document.querySelector('#journal-id')
const photoFileEl = document.querySelector('#photo-file-input')
const photoEntryIdEl = document.querySelector('#photo-entry-id')
const addPhotoSubmit = document.querySelector('#add-photo-submit')
const addPhotoMessage = document.querySelector('#add-photo-message')
const imageGallery = document.querySelector('#image-gallery')

let journalDefaults

// ----------------------
// Event handlers
// ----------------------

/* When page is loaded */
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

/* When the left panel toggle is clicked */
leftPanelToggle.addEventListener('click', handleLeftPanelToggle)

/* When the add photo toggle is clicked */
addPhotoToggle.addEventListener('click', handleAddPhotoToggle)

/* When add journal entry button is clicked */
addJournalBtn.addEventListener('click', handleJournalCreate)

/* When search journals input key down */
searchJournalsEl.addEventListener('keydown', handleJournalSearch)

/* When journal field loses focus */
document.querySelectorAll('.field').forEach((field) => {
  field.addEventListener('change', handleFieldChange)
})

/* When the trash journal button is clicked */
journalDeleteBtn.addEventListener('click', handleJournalDeleteBtnClick)

/* When a journal entry is confirmed delete */
document.addEventListener('delete-confirmed', handleDeleteConfirmed)

/* When the add photo form is submitted */
addPhotoSubmit.addEventListener('click', handleAddPhotoSubmit)

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  handleTokenQueryParam()

  const token = localStorage.getItem('authToken')
  if (!token) {
    window.location.href = '../index.html'
    return
  }

  setMessage('Loading...')

  const { journal } = await getWebApp(`${state.getWebAppUrl()}/journal/read`)

  setMessage('')

  state.set('journal', journal)
  if (journal.length === 0) {
    searchJournalsMessageEl.textContent = 'No journal entries found'
  } else {
    populateJournalEntries()
  }

  // create and add page elements
  const wrapperEl = document.querySelector('.wrapper')

  const navEl = createNav({ title: 'Journal' })
  wrapperEl.prepend(navEl)

  const rightDrawerEl = createRightDrawer({ active: 'journal' })
  document.querySelector('main').prepend(rightDrawerEl)

  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)

  initDialog()

  state.setDefaultPage('journal')
}

/**
 * Handle left panel toggle
 */
function handleLeftPanelToggle() {
  toggleExpander(leftPanelToggle)
  searchJournalsEl.classList.toggle('hidden')
  leftSidebarList.classList.toggle('hidden')
  document.querySelector('.left-sidebar').classList.toggle('collapsed')
  if (isMobile()) {
    mainPanelEl.classList.toggle('hidden')
  }
}

/**
 * Handle the add photo toggle
 */
function handleAddPhotoToggle() {
  addPhotoToggle.classList.toggle('fa-close')
  addPhotoToggle.classList.toggle('fa-camera')
  addPhotoForm.classList.toggle('hidden')
  addPhotoForm.reset()
  addPhotoSubmit.removeAttribute('disabled')
  photoFileEl.value = ''
}

/**
 * Handle journal create
 */
async function handleJournalCreate() {
  addJournalBtn.disabled = true
  const { id } = await getWebApp(`${state.getWebAppUrl()}/journal/create`)
  const { defaults } = await getWebApp(`${state.getWebAppUrl()}/journal/defaults/read`)

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

  const li = createSidebarLink({ id, title: createEntryTitle(newEntry.location, dateString), cb: handleSidebarLinkClick })

  leftSidebarList.appendChild(li)
  li.click()
  addJournalBtn.disabled = false
}

/**
 * Handle journal search
 */
async function handleJournalSearch(e) {
  if (e.key !== 'Enter') {
    return
  }
  const value = e.target.value.toLowerCase().trim()
  if (value.length === 0) {
    return
  }
  searchJournalsMessageEl.textContent = 'Searching...'

  const { journal } = await getWebApp(`${state.getWebAppUrl()}/journal/search?q=${value}`)

  if (journal.length === 0) {
    searchJournalsMessageEl.textContent = 'No journal entries found'
  } else {
    searchJournalsMessageEl.textContent = ''
  }

  state.set(journal, journal)
}

/**
 * Handle journal entry field change
 */
async function handleFieldChange(e) {
  document.querySelector('.sidebar-link.active').textContent = createEntryTitle(locationEl.value, visitDateEl.value)

  const elem = e.target
  const id = idEl.textContent
  const doc = { id, collection: 'journal', key: elem.name, value: elem.value }
  state.setById(doc)

  try {
    const { message, error } = await postWebAppJson(`${state.getWebAppUrl()}/journal/update`, {
      id,
      value: elem.value,
      section: elem.name,
    })
    if (error) {
      throw new Error(error)
    }
    console.log(message)

    if (['city', 'state', 'country'].includes(elem.name)) {
      await postWebAppJson(`${state.getWebAppUrl()}/journal/defaults/update`, {
        id,
        [elem.name]: elem.value,
      })
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Handle sidebar link click
 */
async function handleSidebarLinkClick(elem) {
  document.querySelector('.sidebar-link.active')?.classList.remove('active')

  // hide the left panel if mobile
  if (isMobile()) {
    handleLeftPanelToggle(elem)
  }

  document.querySelector(`.sidebar-link[data-id="${elem.dataset.id}"]`).classList.add('active')
  const id = elem.dataset.id
  const journal = state.getById('journal', id)
  if (!journal) {
    console.log(`handleSidebarLinkClick error: Journal not found for id: ${id}`)
    console.log('Journal:', state.getCollection('journal'))
    return
  }

  loadJournal(journal)
}

/**
 * Handle button click to show delete modal
 */
function handleJournalDeleteBtnClick() {
  setDialog({
    type: MODAL.DELETE,
    header: 'Confirm Delete',
    body: `Delete "${createEntryTitle(locationEl.value, visitDateEl.value)}"?`,
    id: idEl.textContent,
  })
  const dialog = document.querySelector('dialog')
  dialog.showModal()
}

/**
 * Handle delete journal confirmation
 */
async function handleDeleteConfirmed(e) {
  const modalMessageEl = document.querySelector('#modal-message')
  modalMessageEl.innerText = ''
  const id = e.detail.id
  const password = document.querySelector('#modal-delete-input').value
  const { error } = await getWebApp(`${state.getWebAppUrl()}/journal/delete?id=${id}&password=${password}`)

  if (error) {
    modalMessageEl.innerText = error
    return
  }
  state.delete('recipes', id)
  document.querySelector(`.sidebar-link[data-id="${id}"`).remove()
  console.log(`handleDeleteRecipe message: ${message}`)
  document.querySelector('dialog').close()
  mainPanelEl.classList.add('hidden')
}

/**
 * Handle the add photo form submit
 */
async function handleAddPhotoSubmit(e) {
  e.preventDefault()
  const formData = new FormData(addPhotoForm)

  const file = formData.get('file')
  if (!file || file.size === 0) {
    const message = 'Please select an image'
    console.log(message)
    addPhotoMessage.textContent = message
    return
  }

  addPhotoSubmit.setAttribute('disabled', true)
  addPhotoMessage.textContent = 'Loading...'

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

    const { message } = await postWebAppForm(`${state.getWebAppUrl()}/journal/photos/create`, formData)
    if (message) {
      console.log(message)
      addPhotoMessage.textContent = message
    }
    addPhotoForm.reset()
    await populateJournalImages(formData.get('entry'))
  } catch (err) {
    console.log(err)
    addPhotoMessage.textContent = err.message
  }
}

/**
 * Handle caption edit of a photo
 */
async function handleCaptionChange(e) {
  const parent = e.target.closest('.image-gallery-item')
  const photoMessageEl = parent.querySelector('.photo-message')

  const id = parent.dataset.id

  const { message, error } = await postWebAppJson(`${state.getWebAppUrl()}/journal/photos/update`, {
    id,
    value: e.target.value,
    section: 'caption',
  })
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

  const { error } = await getWebApp(`${state.getWebAppUrl()}/journal/photos/delete?id=${id}`)

  if (error) {
    deleteEl.removeAttribute('disabled')
    photoMessageEl.textContent = error.message
    return
  }
  parent.remove()
}

// ------------------------
// Helper functions
// ------------------------

/**
 * Populate the journal elements
 */
function populateJournalEntries() {
  const journal = state.get('journal')
  if (!journal) {
    console.log(`populateJournalEntries error: state does not have journal: ${journal}`)
    return
  }

  leftSidebarList.innerHTML = ''
  for (const { id, location, visit_date } of journal) {
    const li = createSidebarLink({ id, title: createEntryTitle(location, visit_date), cb: handleSidebarLinkClick })
    leftSidebarList.appendChild(li)
  }
}

/**
 * Populate the journal photos
 */
async function populateJournalImages(id) {
  const { photos } = await getWebApp(`${state.getWebAppUrl()}/journal/photos/read?entry=${id}`)
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
    imageGallery.appendChild(el)
  }
}

/**
 * Load the journal object to the page
 */
function loadJournal(journal) {
  mainPanelEl.classList.remove('hidden')
  locationEl.value = journal.location
  visitDateEl.value = new Date(journal.visit_date).toISOString().split('T')[0]
  notesEl.value = journal.notes
  resizeTextarea(notesEl)
  cityEl.value = journal.city
  stateEl.value = journal.state
  countryEl.value = journal.country
  idEl.textContent = journal.id
  photoEntryIdEl.value = journal.id
  imageGallery.innerHTML = ''
  populateJournalImages(journal.id)
}

/**
 * Format an entry title
 */
function createEntryTitle(location, visit_date) {
  const [_, month, day] = visit_date.split('T')[0].split('-')
  const formatted = `(${month}/${day})`
  return `${location} ${formatted}`
}
