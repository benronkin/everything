/* 
 This module extends the list to a special list that deals only with the main documents
(tasks in tasks.js, etc.)  The main diff is that this lists subscribers to 
main-documents and builds its children by itself.
 */

import { injectStyle } from '../_assets/js/ui.js'
import { createList } from './list.js'
import { newState } from '../_assets/js/newState.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createMainDocumentsList({
  id,

  className,

  emptyState,
}) {
  injectStyle(css)

  const el = createList({
    id,
    className,
    itemClass: 'md-item',
    emptyState,
  })

  // Reactivity for main-document lists
  // ----------------------------------
  newState.on('main-documents', 'mainDocumentsList', ({ docs, render }) => {
    // populate children
    const children = docs.map(render)
    el.deleteChildren().addChildren(children)
    // select previously active child
    const priorDoc = newState.get('active-doc')
    if (priorDoc) {
      const child = el.getChildById(priorDoc.id)
      child && (child.selected = true)
    }
  })

  return el
}
