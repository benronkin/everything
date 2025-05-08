// ------------------------
// Globals
// ------------------------

let cssInjected = false

const css = `
.left-panel-link {
  cursor: pointer;
  color: var(--gray4);
  padding: 10px;
  margin-bottom: 10px;
}
.left-panel-link.active {
  background: var(--purple2);
  color: var(--gray6);
}
`

// ------------------------
// Exported functions
// ------------------------

/**
 * Create a sidebar link element
 */
export function createLeftPanelLink({ id, title, icon, cb }) {
  injectStyle(css)
  const el = createElement({ id, title, icon, cb })
  return el
}

// ------------------------
// Helpers
// ------------------------

/**
 * Inject style sheet once
 */
function injectStyle(css) {
  if (cssInjected) {
    return
  }
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  cssInjected = true
}

/**
 * Create the HTML element.
 */
function createElement({ id, title, icon, cb }) {
  const li = document.createElement('li')
  if (icon) {
    li.innerHTML = `<i class="fa-full ${icon}></i> `
  }
  li.innerHTML += title
  li.classList.add('left-panel-link')
  li.dataset.id = id
  li.addEventListener('click', () => {
    cb(li)
  })

  li.addEventListener('click', handleClick)

  return li
}

/**
 *
 */
function handleClick(e) {
  const li = e.target
  const ul = document.querySelector('#left-panel-list')
  ul.querySelector('.active')?.classList.remove('active')

  // this can be a related link, hence li is not in the left-panel
  document
    .querySelector(`.left-panel-link[data-id="${li.dataset.id}"]`)
    .classList.add('active')

  // hide the left panel if mobile
  if (isMobile()) {
    document.querySelector('#main-icon-group').collapse()
  }
}

/**
 * Detect if mobile device
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}
