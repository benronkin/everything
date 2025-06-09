import { injectStyle, isMobile } from '../_assets/js/ui.js'
import { log } from '../_assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
textarea {
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: var(--border-radius);
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 *
 */
export function createTextarea({
  id,
  name,
  value,
  className,
  placeholder,
} = {}) {
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
  placeholder && (el.placeholder = placeholder)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function listen(el) {
  el.addEventListener('keyup', () => resize(el))
  el.addEventListener('change', () => resize(el))
}

/**
 *
 */
function resize(el) {
  el.style.height = '1px'
  el.style.height = 25 + el.scrollHeight + 'px'
}
