// -------------------------------
// Globals
// -------------------------------

let cssInjected = false

const css = `
footer {
  padding: 20px;
  background: var(--gray2);
  color: var(--gray5);
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
      Version: <span id="version-number">2.1.6</span>
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
  const el = document.createElement('footer')
  el.innerHTML = html
  return el
}
