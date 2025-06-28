import { injectStyle } from '../js/ui.js'
import { insertHtml } from '../js/format.js'
// import { log } from '../js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for custom span element
 */
export function createDiv({ className, id, html, dataset = {} } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  el.insertHtml = insertHtml.bind(el)

  build(el)
  react(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }
  className && (el.className = className)
  html && el.insertHtml(html)

  for (const [k, v] of Object.entries(dataset)) {
    el.dataset[k] = v
  }

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 */
function build(el) {}

/**
 * Subscribe to and set state.
 */
function react(el) {}
