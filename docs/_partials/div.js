import { injectStyle } from '../_assets/js/ui.js'
import { insertHtml } from '../_assets/js/format.js'

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
export function createDiv({ className, id, html } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  el.insertHtml = insertHtml.bind(el)

  build(el)
  react(el)

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
 * Add sub elements to the element. No need
 */
function build(el) {}

/**
 * Subscribe to and set state.
 */
function react(el) {}
