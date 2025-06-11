/* 
 This module extends the list to a special list that deals only with the main documents
(tasks in tasks.js, etc.)  The main diff is that this lists subscribers to 
main-documents and builds its children by itself.
 */

import { injectStyle } from '../js/ui.js'
import { createList } from './list.js'

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
export function createMainDocumentsList({ id, className, emptyState }) {
  injectStyle(css)

  const el = createList({
    id,
    className,
    emptyState,
  })

  return el
}
