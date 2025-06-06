import { newState } from '../../_assets/js/newState.js'
import { injectStyle } from '../../_assets/js/ui.js'
import { createDangerZone } from '../../_partials/dangerZone.js'
import { createEntryTitle } from '../journal.utils.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function dangerZone() {
  injectStyle(css)

  const el = createDangerZone({
    modalId: 'modal-delete',
  })

  react(el)

  el.querySelector('#danger-zone-header').insertHtml('Delete entry')

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function react(el) {
  newState.on('icon-click:show-delete-modal-icon', 'dangerZone', () => {
    const doc = newState.get('active-doc')
    const modalBody = createEntryTitle(doc)

    const modal = el.querySelector('#modal-delete')
    modal.querySelector('#modal-delete-header').insertHtml('Delete entry:')
    modal.querySelector('#modal-delete-body').insertHtml(modalBody)
    modal.dataset.vitest = 'modal-open'
    modal.showModal()
  })
}
