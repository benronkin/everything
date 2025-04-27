// -------------------------------
// Globals
// -------------------------------

const footerString = `
<div class="container">
    <div id="version-container">
      Version: <span id="version-number">1.2.4</span>
    </div>
</div>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createFooter() {
  const footerEl = document.createElement('footer')
  footerEl.innerHTML = footerString
  return footerEl
}
