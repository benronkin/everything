import { injectStyle } from '../_assets/js/ui.js'
import { insertHtml } from '../_assets/js/format.js'
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
export function create({ id, className, html } = {}) {
  injectStyle(css)

  const el = document.createElement('')

  el.insertHtml = insertHtml.bind(el)

  build(el)
  react(el)
  listen(el)

  id && (el.id = id)
  className && (el.className = className)
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
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

/**
 * Set event handlers which can set state.
 */
function listen(el) {
  // el.addEventListener('click', () => {
  //   state.set('stateVar', 'value')
  // })
}
