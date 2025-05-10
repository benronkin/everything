// -------------------------------
// Globals
// -------------------------------

let cssInjected = false

const html = `
<div class="nav-wrapper">
  <ul class="nav">
    <li data-value="recipes"><a href="../recipes/index.html">Recipes</a></li>
    <li data-value="shopping"><a href="../shopping/index.html">Shopping</a></li>
    <li data-value="journal"><a href="../journal/index.html">Journal</a></li>
  </ul>
  <ul class="nav nav-admin">
    <li data-value="admin"><a href="../admin/index.html">Admin</a></li>
  </ul>
</div>
`

const css = `
.nav-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.nav-admin {
  margin-bottom: 20px;
}
.nav li {
  font-size: 1.1rem;
  text-align: left;
  width: 100%;
  transition: background 200ms ease;
}
.nav li a,
.nav li a:visited {
  padding: 12px 20px;
  display: block;
  width: 100%;
  color: var(--gray5);
  text-shadow: none;
}
.nav li:hover {
  background: var(--gray2);
}
.nav li.active {
  background: var(--purple2);
}
[data-id="right-drawer"] {
  position: fixed;
  top: var(--nav-height);
  right: 0;
  height: calc(100% - var(--nav-height));
  width: 250px;
  background: var(--gray1);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  transform: translateX(100%);
  transition: transform 300ms ease;
  z-index: 10;
}
[data-id="right-drawer"].open {
  transform: translateX(0);
}
`

// -------------------------------
// Exported functions
// -------------------------------

export function createRightDrawer({ active } = {}) {
  injectStyle(css)
  const el = createElement({ active })
  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Inject style sheet once
 */
function injectStyle(css) {
  if (cssInjected) {
    return
  }
  cssInjected = true
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

/**
 *
 */
function createElement({ active }) {
  const drawerEl = document.createElement('div')
  drawerEl.dataset.id = 'right-drawer'
  drawerEl.innerHTML = html

  if (active) {
    drawerEl.querySelector(`[data-value="${active}"`).classList.add('active')
  }
  return drawerEl
}
