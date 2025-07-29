import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { shoppingList } from './shoppingList.js'
import { suggestionsList } from './suggestionsList.js'
import { addItemForm } from './addItemForm.js'
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
  min-height: 83vh;
}
#main-panel.hidden {
  display: none;
}
#main-panel form {
  gap: 0 !important;
}
#main-panel .list-item .fa-trash {
  font-size: 30px;
}
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20' })

  build(el)
  react(el)
  listen(el)

  el.id = 'main-panel'

  return el
}

function build(el) {
  el.appendChild(addItemForm())

  el.appendChild(suggestionsList())

  el.appendChild(shoppingList())
}

function react() {}

function listen() {}
