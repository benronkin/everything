import { injectStyle } from '../_assets/js/ui.js'

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
// Constructor
// -------------------------------

/**
 *
 */
function createElement({ className, id, html, url }) {
  const el = document.createElement('a')

  Object.defineProperties(el, {
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = id
      },
    },
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
  className && (el.className = className)
  id && (el.dataId = id)

  return el
}
