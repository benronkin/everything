import { injectStyle, isMobile } from '../js/ui.js'
import { log } from '../js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
textarea {
  border: none;
  text-decoration: none;
  border-radius: var(--border-radius);
  min-height: 1.2em;
  line-height: 1.2em;
  overflow-y: hidden; /* prevent scrollbars */
  resize: none;
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

  el.resize = resize.bind(el)

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
  el.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      el.resize()
    }
  })
  el.addEventListener('change', () => {
    el.resize()
  })
}

// -------------------------------
// Object methods
// -------------------------------

/**
 *
 */
function resize() {
  const { scrollTop } = document.documentElement // or window.pageYOffset
  this.style.height = 'auto'
  this.style.height = 25 + this.scrollHeight + 'px'
  document.documentElement.scrollTop = scrollTop
  console.log('resized to', this.style.height)
}
