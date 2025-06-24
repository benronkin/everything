import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createIcon } from '../partials/icon.js'
import { createSpan } from '../partials/span.js'
import { createModalDelete } from './modalDelete.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createDangerZone({ id, modalId, password } = {}) {
  injectStyle(css)

  const el = createDiv({
    id,
    className: 'danger-zone flex align-center danger-box u-mt-40 u-mb-20',
  })

  build({ el, modalId, password })

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element.
 */
function build({ el, modalId, password }) {
  const modalEl = createModalDelete({
    id: modalId,
    password,
  })
  el.appendChild(modalEl)

  el.appendChild(
    createSpan({
      id: 'danger-zone-header',
    })
  )
  el.appendChild(
    createIcon({
      id: 'show-delete-modal-icon',
      classes: { primary: 'fa-trash' },
    })
  )
}
