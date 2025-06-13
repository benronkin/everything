import { state } from '../js/state.js'
import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'

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
  padding: 8px 14px;
  transition: all 0.2s ease-in-out;
  }
  .list-item:not(:last-child) {
    margin-bottom: 10px;
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
export function createListItem({ html, className, id } = {}) {
  injectStyle(css)
  const el = createDiv()

  el.id = id || `i-${crypto.randomUUID()}`
  el.dataset.id = el.id

  el.className = 'list-item'
  if (className) {
    for (const c of className.split(' ')) {
      el.classList.add(c)
    }
  }

  el.dataset.listItem = true

  if (html) {
    el.insertHtml(html)
  }

  listen({ el })

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 *
 */
function listen({ el }) {
  el.addEventListener('click', () => {
    if (el.draggable) {
      return
    }
    // list manages active class
    state.set('item-click', el.dataset.id)
  })
}
