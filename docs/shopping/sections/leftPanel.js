import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { mainDocumentsList } from './mainDocumentsList.js'
import { addItemForm } from './addItemForm.js'
import { suggestionsList } from './suggestionsList.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#left-panel {
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

export function leftPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20' })

  build(el)
  react(el)
  listen(el)

  el.id = 'left-panel'

  return el
}

function build(el) {
  el.appendChild(addItemForm())
  el.appendChild(suggestionsList())
  el.appendChild(mainDocumentsList())
}

function react() {}

function listen() {}
