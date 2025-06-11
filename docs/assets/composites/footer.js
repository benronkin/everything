import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
footer {
  display: flex;
  align-items: center;
  padding: 20px;
  text-align: center;
  font-size: 0.85rem;
  height: 50px;
}
#version-container {
  margin-left: 20px;
  font-size: 0.9rem;
}
`

const html = `
<div class="container">
    <div id="version-container">
      Version: <span id="version-number">5.0.0</span>
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
