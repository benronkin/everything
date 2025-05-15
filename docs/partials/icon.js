import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
i {
  border-radius: var(--border-radius);
  cursor: pointer;
}
`

// -------------------------------
// Exported functions
// -------------------------------

export function createIcon(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ id, className, onClick } = {}) {
  const el = document.createElement('i')
  el.dataset.id = id
  el.className = `fa-solid ${className}`
  if (onClick) {
    el.addEventListener('click', onClick)
  }

  return el
}
