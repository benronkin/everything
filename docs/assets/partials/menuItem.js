/* 
 This module creates a geneeric menu item that can include a span, 
 or as in rightDrawer an anchor. So you need to pass a type that 
 tells the item what sub-partial to insert.
 */

import { injectStyle } from '../js/ui.js'
import { createAnchor } from './anchor.js'
import { createDiv } from './div.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.menu-item {
  cursor: pointer;
}
`

export function createMenuItem({ html, url, id, className } = {}) {
  injectStyle(css)
  const el = createDiv({ id: id || `ev${crypto.randomUUID()}`, className })

  build({ el, html, url })

  return el
}

function build({ el, html, url }) {
  el.appendChild(createAnchor({ html, url }))
}
