import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDangerZone } from '../../assets/composites/dangerZone.js'

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
    password: false,
  })

  react(el)

  el.classList.add('mt-20')
  el.querySelector('#danger-zone-header').insertHtml('Delete note')

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function react(el) {
  state.on('icon-click:show-delete-modal-icon', 'dangerZone', () => {
    const doc = state.get('active-doc')
    const modalBody = doc.title

    const modal = el.querySelector('#modal-delete')
    modal.querySelector('.modal-header').insertHtml('Delete note:')
    modal.querySelector('.modal-body').insertHtml(modalBody)
    modal.dataset.vitest = 'modal-open'
    modal.showModal()
  })
}
