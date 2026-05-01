import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { createFormHorizontal } from '../../assets/partials/formHorizontal.js'
import { mainDocumentsList } from './mainDocumentsList.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.category {
  color: var(--gray3);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 20px 0;
}
`

export function leftPanel() {
  injectStyle(css)

  const el = createDiv({ id: 'left-panel' })

  build(el)
  react(el)

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
    }),
  )

  el.appendChild(mainDocumentsList())
}

function react(el) {
  state.on('main-documents', 'leftPanel', (docs) => {
    if (!docs.length) {
      const message = `<i class="fa-solid fa-umbrella-beach"></i> <span>Nothing to do today...</span>`
      el.querySelector('.form-message').insertHtml(message)
    }
  })
}
