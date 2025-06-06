import { injectStyle, isMobile } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
textarea {
  border: none;
  cursor: pointer;
  text-decoration: none;
  padding: 7px 3px;
  min-height: 51px;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 *
 */
export function createTextarea({ id, name, value, className } = {}) {
  injectStyle(css)

  const el = document.createElement('textarea')

  listen(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }
  className && (el.className = className)
  value && (el.value = value)
  name && (el.name = name)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function listen(el) {
  el.addEventListener('change', () => resize(el))
}

/**
 * Resize the textarea
 */
export function resize(el) {
  // First, set the textarea to the default height
  el.style.height = 'auto'
  el.style.height = '0'

  // Get the scroll height of the TA content
  let minHeight = el.scrollHeight

  // If the scroll height is more than the default height, expand TA
  if (minHeight > el.clientHeight) {
    el.style.height = Math.max(minHeight + 5, 51) + 'px'
  }

  if (isMobile()) {
    const height = parseFloat(el.style.height) || 0
    el.style.height = Math.max(height / 2.4, 51) + 'px'
  }
}
