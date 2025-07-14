import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
footer {
  display: flex;
  align-items: center;
  padding: 0;
  font-size: 0.85rem;
  height: 25px;
  }
footer .container {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 0 auto;
}
footer span {
  font-size: 0.75rem;
  margin: 0;
  padding: 0;
}
`

const html = `
<div class="container">
  <span>Version: </span><span id="version-number">5.3.2</span>
</div>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createFooter() {
  injectStyle(css)
  return createElement({})
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({}) {
  const el = document.createElement('footer')
  el.innerHTML = html
  return el
}
