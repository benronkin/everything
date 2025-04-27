// -------------------------------
// Globals
// -------------------------------

const drawerString = `
<ul class="nav">
  <li data-value="recipes"><a href="../recipes/index.html">Recipes</a></li>
  <li data-value="shopping"><a href="../shopping/index.html">Shopping</a></li>
  <li data-value="journal"><a href="../journal/index.html">Journal</a></li>
</ul>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createRightDrawer({ active } = {}) {
  const drawerEl = document.createElement('div')
  drawerEl.setAttribute('id', 'right-drawer')
  drawerEl.innerHTML = drawerString

  if (active) {
    drawerEl.querySelector(`[data-value="${active}"`).classList.add('active')
  }
  return drawerEl
}
