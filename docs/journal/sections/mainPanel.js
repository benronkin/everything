/* global imageCompression */

import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createEntryGroup } from './entry.group.js'
import { createPhotoForm } from './photo.form.js'
import { createSpan } from '../../assets/partials/span.js'
import { dangerZone } from './dangerZone.js'
import { photoList } from './photoList.js'
import { addEntryPhoto } from '../journal.api.js'
import { log } from '../../assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#main-panel {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
#main-panel.hidden {
  display: none;
}
#main-panel input.field,
#main-panel textarea.field {
  padding: 0;
  margin: 0;
  border-bottom: 1px dotted var(--gray1);
}
#main-panel textarea.field {
  line-height: 16px;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20 hidden' })

  build(el)
  react(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.appendChild(createEntryGroup())

  const phw = createDiv({
    id: 'photos-header-wrapper',
    className: 'flex mt-20',
  })

  el.appendChild(phw)

  phw.appendChild(createHeader({ type: 'h4', html: 'Photos' }))

  phw.appendChild(
    createIcon({
      id: 'add-photo-toggle',
      classes: { primary: 'fa-camera', other: 'primary btn' },
    })
  )

  const upw = createDiv({
    id: 'upload-photo-wrapper',
  })

  el.appendChild(upw)
  upw.appendChild(createPhotoForm())

  el.appendChild(photoList())

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id' }))

  el.appendChild(createSpan({ id: 'journal-id' }))
}

/**
 * Subscribe to state.
 */
function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    if (appMode !== 'main-panel') {
      el.classList.add('hidden')
      log(`mainPanel is hiding itself on app-mode: ${appMode}`)
      return
    }
    reactAppMode(el)
  })

  state.on('button-click:upload-photo-button', 'mainPanel', ({ e }) => {
    e.preventDefault()
    reactAddPhoto()
  })
}

/**
 *
 */
function reactAppMode(el) {
  const doc = state.get('active-doc')
  el.classList.remove('hidden')
  log('mainPanel is showing itself on active-doc')

  document.querySelector('#photo-list').showPhotos()

  el.querySelector('[data-id="journal-location"]').value = doc.location
  el.querySelector('[data-id="journal-visit-date"]').value =
    doc.visit_date.split('T')[0]
  el.querySelector('[data-id="journal-notes"]').value = doc.notes
  el.querySelector('[data-id="journal-city"]').value = doc.city
  el.querySelector('[data-id="journal-state"]').value = doc.state
  el.querySelector('[data-id="journal-country"]').value = doc.country
  el.querySelector('[data-id="journal-id"]').insertHtml(doc.id)
}

/**
 *
 */
async function reactAddPhoto() {
  const addPhotoForm = document.querySelector('#add-photo-form')
  const formMessage = addPhotoForm.querySelector('.form-message')

  const formData = new FormData(addPhotoForm)

  const file = formData.get('file')
  if (!file || file.size === 0) {
    const message = 'Please select an image'
    console.log(message)
    formMessage.insertHtml(message)
    return
  }

  addPhotoForm.querySelector('button').disabled = true
  formMessage.insertHtml('Uploading...')

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

    formData.set('entry', state.get('active-doc').id)

    const { message } = await addEntryPhoto(formData)

    if (message) {
      formMessage.insertHtml(message)
    }
    // refresh photos to show added photo
    document.querySelector('#photo-list').showPhotos()
  } catch (error) {
    console.error(error)
    formMessage.insertHtml(error.message)
  }
}
