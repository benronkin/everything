const footerString = `
<div class="container">
    <div id="version-container">
      Version: <span id="version-number">1.2.2</span>
    </div>
</div>
`

export function populateFooter() {
  const footerEl = document.querySelector('footer')
  footerEl.innerHTML = footerString
}
