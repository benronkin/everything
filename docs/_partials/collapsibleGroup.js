import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'
import { createGroup } from './group.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.collapsible-group {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  border: 1px solid var(--gray2);
  border-radius: var(--border-radius);
  width: fit-content;
  transition: all 0.2s ease-in-out;
  padding: 4px 20px;
  box-sizing: content-box;
}
.collapsible-group.collapsed {
  width: 36px;
  border-radius: 8px;
  padding: 6px 2px;
}
.collapsible-group.collapsed i:not(:first-child), 
.collapsible-group.collapsed button:not(:first-child) {
  display: none;
}
.collapsible-group i:first-child {
  margin: 6px 0;
} 
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createCollapsibleGroup({
  id,
  className,
  html,
  collapsed = false,
} = {}) {
  injectStyle(css)

  const el = createGroup({ id, className })

  build({ el, html })
  react(el)
  listen(el)

  el.classList.add('collapsible-group')
  el.classList.add('collapsed')

  if (!collapsed) {
    el.querySelector('.toggler').click()
  }

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build({ el, html }) {
  const toggler = createIcon({
    classes: {
      primary: 'fa-chevron-right',
      secondary: 'fa-chevron-left',
      other: ['toggler', 'btn'],
    },
  })
  el.appendChild(toggler)
  for (const child of html) {
    el.appendChild(child)
  }
}

/**
 * Subscribe to state.
 */
function react(el) {
  const stateKey = `icon-click:${el.querySelector('.toggler').id}`
  newState.on(stateKey, 'collapsibleGroup', () => {
    el.classList.toggle('collapsed')
  })
}

/**
 *
 */
function listen(el) {
  // el.addEventListener('click', () => {})
}
