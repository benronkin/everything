import { newState } from '../_assets/js/newState.js'
import { injectStyle } from '../_assets/js/ui.js'
import { createAnchor } from './anchor.js'
import { createSpan } from './span.js'
import { createInput } from './input.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.list-item {
  align-items: center;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 14px;
  transition: all 0.2s ease-in-out;
}
.list-item .icons {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}
.list-item i {
  color: inherit;
}
.list-item[data-draggable="true"] i.fa-bars {
  display: inline-block !important;
}
.list-item[data-draggable="true"] i:not(.fa-bars) {
  display: none;
}
.list-item[data-selected="true"] i:not(.fa-bars) {
  display: inline-block !important;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for a custom listItem element
 */
export function createListItem({ html, id } = {}) {
  injectStyle(css)
  const el = document.createElement('div')

  el.dataId = id || crypto.randomUUID()
  el.className = 'list-item'

  listen({ el, id })

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 *
 */
function listen({ el, id }) {
  el.addEventListener('click', (e) => {
    const el = e.target.closest('.list-item')

    if (el.draggable) {
      return
    }

    el.selected = !el.selected

    newState.set('item-click', el.dataId)
  })
}
