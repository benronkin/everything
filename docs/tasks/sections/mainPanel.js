import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { titleDetailsList } from './titleDetailsList.js'
import { createFormHorizontal } from '../../assets/partials/formHorizontal.js'
// import { state } from '../../assets/js/state.js'

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

  const el = createDiv({ className: 'mt-20' })

  build(el)

  el.id = 'main-panel'

  return el
}

function build(el) {
  el.appendChild(
    createFormHorizontal({
      id: 'tasks-form',
      type: 'text',
      name: 'task',
      placeholder: 'Add task',
      autocomplete: 'off',
      classes: { icon: 'fa-thumbtack' },
      disabled: true,
    })
  )

  el.appendChild(titleDetailsList({ className: 'mt-20' }))
}
