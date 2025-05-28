import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
footer {
  padding: 20px;
  text-align: center;
  font-size: 0.85rem;
}
#version-container {
  margin-left: 20px;
  font-size: 0.9rem;
}
`

const html = `
<div class="container">
    <div id="version-container">
      Version: <span id="version-number">3.1.3</span>
    </div>
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
