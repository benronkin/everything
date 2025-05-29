import { createIcon } from '../partials/icon.js'
import { getEl, injectStyle, setMessage } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
[data-id="main-icon-group"] {
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
[data-id="main-icon-group"].collapsed {
  width: 40px;
  padding: 6px 4px;
}
[data-id="left-panel"] {
  transition: width 300ms ease;
  margin-right: 0;
  color: var(--gray6);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: var(--sidebar-width);
}
[data-id="left-panel"].collapsed {
  display: none;
}
[data-id="left-panel"].collapsed + #main-panel {
  border-left: none;
  padding-left: 5px;
}
`

// -------------------------------
// Exported functions
// -------------------------------

export function createMainIconGroup({
  collapsable = true,
  children,
  shouldAllowCollapse,
} = {}) {
  injectStyle(css)
  const el = createElement({ children, collapsable, shouldAllowCollapse })
  return el
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Handle left panel toggle
 */
function handleLeftPanelToggle() {
  const group = getEl('main-icon-group')
  if (!group.shouldAllowCollapse.cb()) {
    setMessage({
      message: group.shouldAllowCollapse.message,
      position: 'TOP_LEFT',
    })
    getEl('left-panel-toggle').shake()
    return
  }

  if (group.classList.contains('collapsed')) {
    group.expand()
  } else {
    group.collapse()
  }
}

// -------------------------------
// Object methods
// -------------------------------

/**
 *
 */
function collapse() {
  getEl('left-panel').classList.add('collapsed')
  getEl('main-panel').classList.remove('hidden')
  const toggle = document.querySelector('[data-id="left-panel-toggle"]')
  toggle.classList.add('fa-chevron-right')
  toggle.classList.remove('fa-chevron-left')
  const group = getEl('main-icon-group')
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
  getEl('left-panel').classList.remove('collapsed')
  if (isMobile()) {
    getEl('main-panel').classList.add('hidden')
  }
  const toggle = document.querySelector('[data-id="left-panel-toggle"]')
  toggle.classList.remove('fa-chevron-right')
  toggle.classList.add('fa-chevron-left')
  const group = getEl('main-icon-group')
  group.classList.remove('collapsed')
  for (const el of group.children) {
    el.classList.remove('hidden')
  }
}

// -------------------------------
// Constructor
// -------------------------------

/**
 * Create the HTML element.
 */
function createElement({ collapsable, children, shouldAllowCollapse }) {
  const el = document.createElement('div')
  el.dataset.id = 'main-icon-group'
  el.dataset.testId = 'main-icon-group-test'
  if (collapsable) {
    el.appendChild(
      createIcon({
        id: 'left-panel-toggle',
        className: 'fa-chevron-left',
        events: { click: handleLeftPanelToggle },
      })
    )
  }

  // undefined is not iterable
  // hence the check
  if (children) {
    for (const child of children) {
      el.appendChild(child)
    }
  }

  // if and when to block the collapse
  el.shouldAllowCollapse = shouldAllowCollapse || {
    cb() {
      return true
    },
  }

  el.expand = expand.bind(el)
  el.collapse = collapse.bind(el)
  el.toggle = handleLeftPanelToggle.bind(el)
  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Check if the client is mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}
