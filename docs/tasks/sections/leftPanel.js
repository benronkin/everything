import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { tasksList } from './tasksList.js'
import { createFormHorizontal } from '../../assets/partials/formHorizontal.js'
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

export function leftPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20' })

  build(el)
  react(el)

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

  el.appendChild(tasksList({ className: 'mt-20' }))
}

function react(el) {
  state.on('app-mode', 'leftPanel', (appMode) => {
    if (appMode !== 'left-panel') {
      el.classList.add('hidden')
      return
    }

    el.classList.remove('hidden')

    // If there is an active-doc and it does not appear
    // in main-documents then delete active-doc
    const currentId = state.get('active-doc')
    if (!currentId) {
      el.querySelector('#tasks-list').reset()
      return
    }

    const docs = state.get('main-documents')
    const docExists = docs.findIndex((el) => el.id === currentId)
    if (!docExists) {
      state.set('active-doc', null)
      return
    }
  })
}
