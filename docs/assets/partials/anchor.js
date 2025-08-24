import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
a {
  color: var(--grey6);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
a:hover {
  color: var(--purple3);
}
`

export function createAnchor({ className, id, html, url } = {}) {
  injectStyle(css)
  return createElement({ className, id, html, url })
}

function createElement({ className, id, html, url }) {
  const el = document.createElement('a')

  el.innerHTML = html
  el.url = url
  className && (el.className = className)
  id && (el.id = id)

  return el
}
