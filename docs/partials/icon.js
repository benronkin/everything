import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
i {
  padding: 7px;
  border-radius: 6px;
  cursor: pointer;
}
i.primary {
  background-color: var(--purple2);
}
i.secondary {
  background-color: var(--teal1);
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
