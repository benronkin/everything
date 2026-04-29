import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createTaskBody } from './taskBody.js'
import { state } from '../../assets/js/state.js'

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

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ id: 'main-panel', className: 'mt-20' })

  react(el)
  return el
}

function react(el) {
  state.on('main-documents', 'mainPanel', (docs) => {
    el.appendChild(createTaskBody(docs[0]))
  })
}
