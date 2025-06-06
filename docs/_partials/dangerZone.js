import { injectStyle } from '../_assets/js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createSpan } from './span.js'
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
export function createDangerZone({ id, modalId } = {}) {
  injectStyle(css)

  const el = createDiv({
    id,
    className: 'danger-zone flex danger-box u-mt-40 u-mb-20',
  })

  build({ el, modalId })

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element.
 */
function build({ el, modalId }) {
  const modalEl = createModalDelete({
    id: modalId,
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
