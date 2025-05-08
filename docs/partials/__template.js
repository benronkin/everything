// -------------------------------
// Globals
// -------------------------------

let cssInjected = false

const css = `

`

const formString = `
 
`

// -------------------------------
// Exported functions
// -------------------------------

export function create___({} = {}) {
  injectStyle(css)
  return createElement({})
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function injectStyle(css) {
  if (cssInjected || !css) return
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  cssInjected = true
}

/**
 *
 */
function createElement({}) {
  const el = document.createElement('div')
  el.innerHTML = html

  return el
}
