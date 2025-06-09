import { injectStyle } from '../_assets/js/ui.js'
import { insertHtml } from '../_assets/js/format.js'
// import { log } from '../_assets/js/logger.js'

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

  id && (el.id = id)
  className && (el.className = className)
  html && el.insertHtml(html)

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
