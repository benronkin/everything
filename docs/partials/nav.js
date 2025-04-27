// -------------------------------
// Globals
// -------------------------------

const navString = `
<div class="container">
    <div class="brand">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
        <rect x="10" y="10" width="80" height="80" rx="8" fill="#fdf6e3" stroke="#333" stroke-width="2"/>
        <path d="M20 20h60v15H20z" fill="#fdd835"/>
        <path d="M25 40h50v4H25zM25 48h50v4H25zM25 56h35v4H25z" fill="#333"/>
        <circle cx="75" cy="70" r="10" fill="#66bb6a" stroke="#333" stroke-width="2"/>
        <path d="M70 70l4 4 8-8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M40 75h20v5H40z" fill="#333"/>
        <path d="M42 77h16v1H42z" fill="#fff"/>
        <text x="50%" y="93%" dominant-baseline="middle" text-anchor="middle" font-size="6" fill="#999" font-family="sans-serif">My Recipes</text>
        </svg>
        <h3></h3>
    </div>
    <i id="toggle-right-drawer" class="fa-solid fa-bars"></i>
</div>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createNav({ title, disableRightDrawer = false, wideNav = false } = {}) {
  const navEl = document.createElement('nav')
  navEl.innerHTML = navString
  navEl.querySelector('h3').innerHTML = title

  if (wideNav) {
    const div = navEl.querySelector('.container')
    div.classList.remove('container')
    div.classList.add('container-wide')
    div.classList.add('ml-20')
  }

  const rightDrawerToggleEl = navEl.querySelector('#toggle-right-drawer')
  if (disableRightDrawer) {
    rightDrawerToggleEl.remove()
  } else {
    rightDrawerToggleEl.addEventListener('click', handleToggleRightDrawer)
  }

  return navEl
}

// -------------------------------
// Event handler functions
// -------------------------------

/**
 * Toggle the right drawer
 */
function handleToggleRightDrawer() {
  document.querySelector('#right-drawer').classList.toggle('open')
}
