import { newState } from '../_assets/js/newState.js'
import { injectStyle } from '../_assets/js/ui.js'
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
  const el = createDiv()

  el.id = id || crypto.randomUUID()
  el.dataset.id = el.id
  el.className = 'list-item'

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

    el.classList.toggle('active')

    newState.set('item-click', el.dataset.id)
  })
}
