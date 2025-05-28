import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
nav {
  color: var(--gray5);
  background: var(--nav-gradient);
  display: flex;
  height: var(--nav-height);
}
nav ul,
nav .container,
nav .brand {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}
nav ul,
nav .container {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
nav .brand {
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
}
nav .brand h3 {
  margin: 0;
  padding-left: 5px;
  white-space: nowrap;
  font-weight: 600;

  letter-spacing: 0.5px;
}
nav svg {
  width: 35px;
}
`

const html = `
<div class="container">
    <div class="brand">
        <h3></h3>
    </div>
    <i id="toggle-right-drawer" class="fa-solid fa-bars"></i>
</div>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createNav({
  title = '',
  disableRightDrawer = false,
  wideNav = false,
}) {
  injectStyle(css)
  return createElement({ title, disableRightDrawer, wideNav })
}

// -------------------------------
// Event handler functions
// -------------------------------

/**
 * Toggle the right drawer
 */
function handleToggleRightDrawer() {
  const drawer = document.querySelector('[data-id="right-drawer"]')
  drawer.classList.toggle('open')
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ title, disableRightDrawer, wideNav }) {
  const navEl = document.createElement('nav')
  navEl.innerHTML = html
  navEl.querySelector('h3').innerHTML = title

  const rightDrawerToggleEl = navEl.querySelector('#toggle-right-drawer')
  if (disableRightDrawer) {
    rightDrawerToggleEl.remove()
  } else {
    rightDrawerToggleEl.addEventListener('click', handleToggleRightDrawer)
  }

  return navEl
}
