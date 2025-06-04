import { newState } from '../_assets/js/newState.js'
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
export function createDangerZone({ id } = {}) {
  injectStyle(css)

  const el = createDiv({
    className: 'danger-zone flex danger-box u-mt-40 u-mb-20',
  })

  addElementParts({ el })

  id && (el.dataId = id)

  newState.on('show-delete-modal-icon-click', 'dangerZone', () => {
    const modal = el.querySelector('#modal-delete')
    modal.dataset.vitest = 'modal-open'
    try {
      modal.showModal()
    } catch (e) {
      // fail silently for vitest
    }
  })

  return el
}

// -------------------------------
// Object methods
// -------------------------------

// -------------------------------
// Event handlers
// -------------------------------

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function addElementParts({ el }) {
  const modalEl = createModalDelete({
    id: 'modal-delete',
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
      className: 'fa-trash',
    })
  )
}
