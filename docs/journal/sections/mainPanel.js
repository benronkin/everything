import { newState } from '../../_assets/js/newState.js'
import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'
import { createHeader } from '../../_partials/header.js'
import { createIcon } from '../../_partials/icon.js'
import { createInput } from '../../_partials/input.js'
import { createParagraph } from '../../_partials/paragraph.js'
import { createTextarea } from '../../_partials/textarea.js'
import { appendEntryDetails } from './entry.form.js'
import { createPhotoForm } from './photo.form.js'
import { dangerZone } from './dangerZone.js'
import { photoList } from './photoList.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#main-panel {
  align-items: center;
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
  border-bottom: 1px solid var(--gray3);
}
#main-panel textarea.field {
  line-height: 13px;
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

  const el = createDiv()

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
  appendEntryDetails(el)

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

  el.appendChild(photoList())

  upw.appendChild(createPhotoForm())

  el.appendChild(dangerZone())
}

/**
 * Subscribe to and set state.
 */
function react(el) {
  // if there is an active doc then show the panel
  // and populate the fields
  newState.on('active-doc', 'mainPanel', (doc) => {
    if (!doc) {
      el.classList.add('hidden')
      return
    }

    el.classList.remove('hidden')

    el.querySelector('[data-id="journal-location"]').value = doc.location
    el.querySelector('[data-id="journal-visit-date"]').value =
      doc.visit_date.split('T')[0]
    el.querySelector('[data-id="journal-notes"]').value = doc.notes
    el.querySelector('[data-id="journal-city"]').value = doc.city
    el.querySelector('[data-id="journal-state"]').value = doc.state
    el.querySelector('[data-id="journal-country"]').value = doc.country
    el.querySelector('[data-id="journal-id"]').insertHtml(doc.id)
  })

  // When new docs come in, hide the panel.
  // If there is an active-doc and it does not appear
  // in main-documents then delete active-doc
  newState.on('main-documents', 'mainPanel', (docs) => {
    // el.classList.add('hidden')
    document.querySelector('#left-panel').classList.add('hidden')

    const currentId = newState.get('active-doc')?.id
    if (!currentId) return

    const docExists = docs.findIndex((el) => el.id === currentId)
    if (docExists) return

    newState.set('active-doc', null)
  })
}
