import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// const html = `
// `

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Create a custom anchor element
 * (Params for VS Code:)
 */
export function createAnchor({ className, id, html, url } = {}) {
  injectStyle(css)
  return createElement({ className, id, html, url })
}

// -------------------------------
// Event handlers
// -------------------------------

// -------------------------------
// Constructor
// -------------------------------

/**
 *
 */
function createElement({ className, id, html, url }) {
  const el = document.createElement('a')

  Object.defineProperties(el, {
    url: {
      get() {
        return el.href
      },
      set(newUrl) {
        el.href = newUrl
      },
    },
    value: {
      get() {
        return el.innerHTML
      },
      set(newValue) {
        el.innerHTML = newValue
      },
    },
  })

  el.value = html
  el.url = url

  if (className) {
    el.className = className
  }
  if (id) {
    el.id = id
  }

  return el
}
