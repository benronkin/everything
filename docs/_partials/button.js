import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'
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

  listen(el)

  id && (el.id = id)
  className && (el.className = className)
  html && el.insertHtml(html)
  disabled && (el.disabled = true)
  type && (el.type = type)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function listen(el) {
  el.addEventListener('click', (e) => {
    const stateKey = `button-click:${el.id}`
    newState.set(stateKey, {
      id: el.id,
      e,
    })
  })
}
