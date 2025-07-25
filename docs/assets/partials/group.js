import { injectStyle } from '../js/ui.js'
import { insertHtml } from '../js/format.js'
import { state } from '../js/state.js'
import { createDiv } from './div.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: var(--border-radius);  
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createGroup({ id, className, html } = {}) {
  injectStyle(css)

  const el = createDiv({ id, className, html })

  el.insertHtml = insertHtml.bind(el)

  build(el)
  react(el)
  listen(el)

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
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

/**
 *
 */
function listen(el) {
  // el.addEventListener('click', () => {})
}
