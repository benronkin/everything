import { injectStyle } from '../_assets/js/ui.js'
import { createIcon } from './icon.js'
import { insertHtml } from '../_assets/js/format.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
button {
  cursor: pointer;
  padding: 10px;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createButton({ id, className, disabled, html, type } = {}) {
  injectStyle(css)

  const el = document.createElement('button')

  el.insertHtml = insertHtml.bind(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  type && (el.type = type)
  className && (el.className = className)
  html && el.insertHtml(html)

  if (disabled) {
    el.dataset.disabled = 'true'
    el.disabled = true
  }

  return el
}
