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

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  listen(el)

  type && (el.type = type)
  className && (el.className = className)
  html && el.insertHtml(html)

  if (disabled) {
    el.dataset.disabled = 'true'
    el.disabled = true
  }

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function listen(el) {
  el.addEventListener('click', () => {
    const stateKey = `button-click:${el.id}`
    newState.set(stateKey, {
      id: el.id,
    })
  })
}
