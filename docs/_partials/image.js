import { injectStyle } from '../_assets/js/ui.js'
import { state } from '../_assets/js/state.js'

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
export function createImage({ id, className, src } = {}) {
  injectStyle(css)

  const el = document.createElement('img')

  build(el)
  react(el)
  listen(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }
  className && (el.className = className)
  src && (el.src = src)

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
