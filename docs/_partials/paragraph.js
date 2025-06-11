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
export function createParagraph({ id, className, html } = {}) {
  injectStyle(css)

  const el = document.createElement('p')
  el.insertHtml = insertHtml.bind(el)

  build(el)
  react(el)
  listen({ el, id })

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  if (className) {
    el.className = className
  }

  if (html) {
    el.insertHtml(html)
  }

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
function listen({ el, id }) {
  // el.addEventListener('click', () => {})
}
