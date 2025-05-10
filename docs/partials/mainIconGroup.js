import { createIcon } from './icon.js'
import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

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
  font-size: 1.1rem;
  transition: all 200ms ease;
}
#main-icon-group.collapsed {
  width: 40px;
  padding: 6px 4px;
}
#left-panel {
  transition: width 300ms ease;
  margin-right: 0;
  color: var(--gray6);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: var(--sidebar-width);
}
#left-panel.collapsed {
  display: none;
}
#left-panel.collapsed + #main-panel {
  border-left: none;
  padding-left: 5px;
}
`

// -------------------------------
// Exported functions
// -------------------------------

export function createMainIconGroup(config) {
  injectStyle(css)
  const el = createElement(config)
  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Create the HTML element.
 */
function createElement({ children } = {}) {
  const el = document.createElement('div')
  el.setAttribute('id', 'main-icon-group')
  el.appendChild(
    createIcon({
      id: 'left-panel-toggle',
      className: 'fa-chevron-left',
      onClick: handleLeftPanelToggle,
    })
  )

  // undefined is not iterable
  // hence the check
  if (children) {
    for (const child of children) {
      el.appendChild(child)
    }
  }

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
  const toggle = document.querySelector('[data-id="left-panel-toggle"]')
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
  const toggle = document.querySelector('[data-id="left-panel-toggle"]')
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
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}
