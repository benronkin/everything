import { injectStyle } from '../_assets/js/ui.js'
import { insertHtml } from '../_assets/js/format.js'
import { newState } from '../_assets/js/newState.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-radius: var(--border-radius);  
  padding: 10px;
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

  const el = document.createElement('')

  el.insertHtml = insertHtml.bind(el)

  build(el)
  react(el)
  listen(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }
  className && (el.className = className)
  el.classList.add('group')
  html && el.insertHtml(html)

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
