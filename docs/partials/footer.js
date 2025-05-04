// -------------------------------
// Globals
// -------------------------------

const html = `
<div class="container">
    <div id="version-container">
      Version: <span id="version-number">2.1.3</span>
    </div>
</div>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createFooter() {
  const el = document.createElement('footer')
  el.innerHTML = html
  return el
}
