import { newState } from '../../_assets/js/newState.js'
import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'
import { createHeader } from '../../_partials/header.js'
import { createIcon } from '../../_partials/icon.js'
import { createEntryGroup } from './entry.group.js'
import { createPhotoForm } from './photo.form.js'
import { createSpan } from '../../_partials/span.js'
import { dangerZone } from './dangerZone.js'
import { photoList } from './photoList.js'
import { log } from '../../_assets/js/ui.js'

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

  el.appendChild(photoList())

  upw.appendChild(createPhotoForm())

  // el.appendChild(createHeader({ type: 'h5', html: 'ID' }))

  // el.appendChild(
  //   createParagraph({ id: 'journal-id', className: 'smaller mb-20' })
  // )

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id' }))

  el.appendChild(createSpan({ id: 'journal-id' }))
}

/**
 * Subscribe to state.
 */
function react(el) {
  newState.on('app-mode', 'mainPanel', (appMode) => {
    if (appMode !== 'main-panel') {
      el.classList.add('hidden')
      log(`mainPanel is hiding itself on app-mode: ${appMode}`)
      return
    }

    const doc = newState.get('active-doc')
    el.classList.remove('hidden')
    log('mainPanel is showing itself on active-doc')

    el.querySelector('[data-id="journal-location"]').value = doc.location
    el.querySelector('[data-id="journal-visit-date"]').value =
      doc.visit_date.split('T')[0]
    el.querySelector('[data-id="journal-notes"]').value = doc.notes
    el.querySelector('[data-id="journal-city"]').value = doc.city
    el.querySelector('[data-id="journal-state"]').value = doc.state
    el.querySelector('[data-id="journal-country"]').value = doc.country
    el.querySelector('[data-id="journal-id"]').insertHtml(doc.id)
  })
}
