// -------------------------------
// Globals
// -------------------------------

let cssInjected = false

const css = `
#main-icon-group {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background-color: var(--gray1);
  border: 1px solid var(--gray3);
  border-radius: 10px;
  padding: 6px 10px;
  width: max-content;
}
#main-icon-group.collapsed {
  width: 40px;
  padding: 6px 4px;
}
`

const html = `
 <i id="left-panel-toggle" class="fa-solid fa-chevron-left"></i>
`

// -------------------------------
// Exported functions
// -------------------------------

export function createMainIconGroup({ elements = [] } = {}) {
  injectStyle(css)
  const el = createElement({ elements })
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
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  cssInjected = true
}

/**
 * Create the HTML element.
 */
function createElement({ elements }) {
  const el = document.createElement('div')
  el.setAttribute('id', 'main-icon-group')
  el.className = 'i-group'
  el.innerHTML = html

  for (const element of elements) {
    el.appendChild(element)
  }

  el.querySelector('#left-panel-toggle').addEventListener('click', handleLeftPanelToggle)

  el.expand = expand.bind(el)
  el.collapse = collapse.bind(el)
  el.toggle = handleLeftPanelToggle.bind(el)
  return el
}

/**
 * Handle left panel toggle
 */
function handleLeftPanelToggle() {
  const group = document.querySelector('#main-icon-group')
  if (group.classList.contains('collapsed')) {
    group.expand()
  } else {
    group.collapse()
  }
}

/**
 *
 */
function collapse() {
  document.querySelector('#left-panel').classList.add('collapsed')
  document.querySelector('#main-panel').classList.remove('hidden')
  const toggle = document.querySelector('#left-panel-toggle')
  toggle.classList.add('fa-chevron-right')
  toggle.classList.remove('fa-chevron-left')
  const group = document.querySelector('#main-icon-group')
  group.classList.add('collapsed')
  for (const el of group.children) {
    if (el !== toggle) {
      el.classList.add('hidden')
    }
  }
}

/**
 *
 */
function expand() {
  document.querySelector('#left-panel').classList.remove('collapsed')
  if (isMobile()) {
    document.querySelector('#main-panel').classList.add('hidden')
  }
  const toggle = document.querySelector('#left-panel-toggle')
  toggle.classList.remove('fa-chevron-right')
  toggle.classList.add('fa-chevron-left')
  const group = document.querySelector('#main-icon-group')
  group.classList.remove('collapsed')
  for (const el of group.children) {
    el.classList.remove('hidden')
  }
}

/**
 * Check if the client is mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
