import { injectStyle } from '../../_assets/js/ui.js'
import { newState } from '../../_assets/js/newState.js'
import { createDiv } from '../../_partials/div.js'
import { mainDocumentsList } from './mainDocumentsList.js'
import { search } from './search.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#left-panel {
  width: var(--sidebar-width);
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function leftPanel() {
  injectStyle(css)

  const el = createDiv()

  build(el)
  react(el)
  listen({ el, id: 'left-panel' })

  el.id = 'left-panel'
  el.dataset.id = 'left-panel'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.prepend(search())
  el.appendChild(mainDocumentsList())
}

/**
 * Subscribe to and set state.
 */
function react(el) {
  newState.on('stateVar', 'subscriberName', (stateValue) => {})
}

/**
 *
 */
function listen({ el, id }) {
  el.addEventListener('click', () => {})
}
