import { newState } from '../../_assets/js/newState.js'
import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'
import { createHeader } from '../../_partials/header.js'
import { createIcon } from '../../_partials/icon.js'
import { createInput } from '../../_partials/input.js'
import { createParagraph } from '../../_partials/paragraph.js'
import { createTextarea } from '../../_partials/textarea.js'
import { form } from './photo.form.js'
import { createDelete } from '../../_sections/delete.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#main-panel {
  padding: 0 20px;
  align-items: center;
  width: calc(100% - var(--sidebar-width));
  padding-left: 20px;
  /* border-left: 1px solid var(--purple2); */
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
  width: 100%;
  margin: 10px 0;
  border-bottom: 1px solid var(--gray3);
}
#main-panel textarea.field {
  min-height: 52px;
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
  listen({ el, id: 'main-panel' })

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
  el.appendChild(createHeader({ type: 'h5', html: 'Location' }))

  el.appendChild(
    createInput({
      name: 'location',
      id: 'journal-location',
      className: 'field',
    })
  )

  el.appendChild(createHeader({ type: 'h5', html: 'Visited on' }))

  el.appendChild(
    createInput({
      name: 'visit-date',
      id: 'journal-visit-date',
      className: 'field',
      type: 'date',
    })
  )

  el.appendChild(createHeader({ type: 'h5', html: 'Notes' }))

  el.appendChild(
    createTextarea({
      name: 'notes',
      id: 'journal-notes',
      className: 'field',
    })
  )

  el.appendChild(createHeader({ type: 'h5', html: 'City' }))

  el.appendChild(
    createInput({
      name: 'city',
      id: 'journal-city',
      className: 'field',
    })
  )

  el.appendChild(createHeader({ type: 'h5', html: 'State' }))

  el.appendChild(
    createInput({
      name: 'state',
      id: 'journal-state',
      className: 'field',
    })
  )

  el.appendChild(createHeader({ type: 'h5', html: 'Country' }))

  el.appendChild(
    createInput({
      name: 'country',
      id: 'journal-country',
      className: 'field',
    })
  )

  const phw = createDiv({
    id: 'photos-header-wrapper',
    className: 'flex mt-20',
  })

  el.appendChild(phw)

  phw.appendChild(createHeader({ type: 'h4', html: 'Photos' }))

  phw.appendChild(
    createIcon({
      id: 'add-photo-toggle',
      className: 'fa-camera primary',
    })
  )

  const upw = createDiv({
    id: 'upload-photo-wrapper',
  })

  el.appendChild(upw)

  el.appendChild(createDiv({ id: 'image-gallery' }))

  el.appendChild(createHeader({ type: 'h5', html: 'Id' }))

  el.appendChild(
    createParagraph({ id: 'journal-id', className: 'smaller mb-20' })
  )

  upw.appendChild(form())

  el.appendChild(
    createDelete({
      id: 'modal-delete',
    })
  )
}

/**
 * Subscribe to and set state.
 */
function react(el) {
  newState.on('active-doc', 'mainPanel', (doc) => {
    el.querySelector('[data-id="journal-location"]').value = doc.location
    el.querySelector('[data-id="journal-visit-date"]').value =
      doc.visit_date.split('T')[0]
    el.classList.remove('hidden')
    el.querySelector('[data-id="journal-notes"]').value = doc.notes
    el.querySelector('[data-id="journal-city"]').value = doc.city
    el.querySelector('[data-id="journal-state"]').value = doc.state
    el.querySelector('[data-id="journal-country"]').value = doc.country
    el.querySelector('[data-id="journal-id"]').insertHtml(doc.id)
  })

  newState.on('main-documents', 'mainPanel', () => el.classList.add('hidden'))
}

/**
 *
 */
function listen({ el, id }) {
  el.addEventListener('click', () => {})
}
