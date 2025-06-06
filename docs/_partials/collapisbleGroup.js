import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'
import { createGroup } from './group.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.collapsible-group {
  border: 1px solid var(--gray2);
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createCollapisbleGroup({ id, className, html } = {}) {
  injectStyle(css)

  const el = createGroup({ id, className, html })

  build(el)
  react(el)
  listen(el)

  el.classList.add('collapisble-group')

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {}

/**
 * Subscribe to state.
 */
function react(el) {
  newState.on('stateVar', 'subscriberName', (stateValue) => {})
}

/**
 *
 */
function listen(el) {
  el.addEventListener('click', () => {})
}
