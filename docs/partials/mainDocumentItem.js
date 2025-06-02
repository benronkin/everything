/* 
 This module extends the menuItem (that is used in both the left panel list and right drawer)
 to a special item that deals only with the main documents (tasks in tasks.js, etc.)
 The main diff is that this item sets the active-doc instead of the regular item-click.
 */

import { injectStyle } from '../js/ui.js'
import { createMenuItem, handleMemuItemClick } from './menuItem.js'
import { newState } from '../js/newState.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.md-item {
  align-items: center;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
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
export function createMainDocumentItem({
  id,
  selected,
  hidden,
  value,
  icons,
  classes,
} = {}) {
  injectStyle(css)

  const el = createMenuItem({
    id,
    selected,
    hidden,
    type: 'span',
    value,
    icons,
    classes,
  })

  // replace the element type class
  el.classList.remove('menu-item')
  el.classList.add('md-item')

  // replace menuItem's click event hanlder that sets item-click
  // with active-doc, since mainDocumentItem works exclusively
  // with the main documents
  el.removeEventListener('click', handleMemuItemClick)
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

  el.selected = !el.selected

  newState.set('active-doc', el.dataId)
}
