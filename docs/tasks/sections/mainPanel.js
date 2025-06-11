import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { titleDetailsList } from './titleDetailsList.js'
import { createFormHorizontal } from '../../assets/partials/formHorizontal.js'
// import { state } from '../../assets/js/state.js'
// import { log } from '../../assets/js/logger.js'

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
      id: 'tasks-form',
      type: 'text',
      name: 'task',
      placeholder: 'Add task',
      autocomplete: 'off',
      formIconClass: 'fa-thumbtack',
      disabled: true,
    })
  )

  el.appendChild(titleDetailsList({ className: 'mt-20' }))
}

/**
 *
 */
function react() {}

/**
 *
 */
function listen() {}
