/* 
 This module extends the menuItem (that is used in both the left panel list and right drawer)
 to a special item that deals only with the main documents (tasks in tasks.js, etc.)
 The main diff is that this item sets the active-doc instead of the regular item-click.
 */

import { injectStyle } from '../js/ui.js'
import { createListItem } from './listItem.js'
import { state } from '../js/state.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.md-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 4px;
  padding: 4px 14px;
  transition: all 0.2s ease-in-out;
}
.md-item .icons {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}
.md-item i {
  color: inherit;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function createMainDocumentItem({ id, selected, hidden, html } = {}) {
  injectStyle(css)

  const el = createListItem({
    id,
    selected,
    hidden,
    html,
  })

  el.insertHtml(html)

  // replace the element type class
  el.classList.remove('list-item')
  el.classList.add('md-item')

  // Augment the base listItem click state with active-doc
  el.addEventListener('click', handleMainDocumentClick)

  return el
}

// -------------------------------
// Event listeners
// -------------------------------

/**
 * Handle click on the item. Exported for
 * mainDocumentItem to overeride
 */
export function handleMainDocumentClick(e) {
  const el = e.target.closest('.md-item')

  const mainDocuments = state.get('main-documents')
  const activeDoc = mainDocuments.find((doc) => doc.id === el.id)
  state.set('active-doc', activeDoc)
  state.set('app-mode', 'main-panel')
}
