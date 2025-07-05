import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
// import { createHeader } from '../../assets/partials/header.js'
// import { createAnchor } from '../../assets/partials/anchor.js'
// import { createForm } from '../../assets/partials/form.js'
// import { createInputGroup } from '../../assets/partials/inputGroup.js'
// import { createButton } from '../../assets/partials/button.js'
// import { createSpan } from '../../assets/partials/span.js'
// import { setMessage } from '../../assets/js/ui.js'
import { bookmarksSubPanel } from './bookmarksSubPanel.js'
import { log } from '../../assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#main-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  flex-grow: 1;
  justify-content: flex-start;
  padding-top: 20px;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function mainPanel() {
  injectStyle(css)

  const el = createDiv()

  build(el)
  listen(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.appendChild(bookmarksSubPanel())
}

/**
 * Subscribe to state.
 */
function listen() {}
