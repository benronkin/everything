import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'
import { createFormHorizontal } from '../../_partials/formHorizontal.js'
// import { newState } from '../../_assets/js/newState.js'
// import { log } from '../../_assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#main-panel {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-height: 83vh;
}
#main-panel.hidden {
  display: none;
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

  const el = createDiv({ className: 'mt-20' })

  build(el)
  react(el)
  listen(el)

  el.id = 'main-panel'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.appendChild(
    createFormHorizontal({
      id: 'shopping-form',
      type: 'text',
      name: 'ingredient',
      placeholder: 'Add item',
      autocomplete: 'off',
      formIconClass: 'fa-shopping-cart',
      disabled: true,
    })
  )
}

/**
 *
 */
function react() {}

/**
 *
 */
function listen() {}
