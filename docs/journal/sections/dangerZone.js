import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDangerZone } from '../../assets/composites/dangerZone.js'
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

  el.classList.add('mt-20')
  el.querySelector('#danger-zone-header').insertHtml('Delete entry')

  return el
}

function react(el) {
  state.on('icon-click:show-delete-modal-icon', 'dangerZone', () => {
    const doc = state.get('active-doc')
    const modalBody = createEntryTitle(doc)

    const modal = el.querySelector('#modal-delete')
    modal.querySelector('.modal-header').insertHtml('Delete entry:')
    modal.querySelector('.modal-body').insertHtml(modalBody)
    modal.dataset.vitest = 'modal-open'
    modal.showModal()
  })
}
