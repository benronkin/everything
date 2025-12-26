import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createLexiconGroup } from './lexicon.sense.js'
import { dangerZone } from './dangerZone.js'

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
#main-panel input.field,
#main-panel textarea.field {
  padding: 0;
  margin: 0;
  border-bottom: 1px dotted var(--gray1);
}
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20 hidden' })

  react(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    const search = document.querySelector('[name="search-lexicon"]')
    search.focus()

    if (appMode !== 'main-panel') {
      el.classList.add('hidden')
      return
    }
  })

  state.on('active-doc', 'mainPanel', (e) => {
    el.innerHTML = ''
    if (!e) return

    const doc = {
      ...state.get('main-documents').find((d) => d.title === e),
    }
    el.classList.remove('hidden')

    const titleInput = createInputGroup({
      id: 'title',
      name: 'title',
      value: doc.title,
      placeholder: 'Entry',
      autocomplete: 'off',
      classes: { group: 'mb-40', input: 'field w-100', icon: 'fa-cube' },
    })
    el.appendChild(titleInput)

    titleInput.addEventListener('change', (e) => state.set('name-change', e))

    titleInput.addEventListener('keydown', (e) => {
      if (e.metaKey && e.key === 's') {
        e.preventDefault()
        state.set('name-change', e)
      }
    })

    if (doc.senses.length === 1) {
      el.appendChild(
        createLexiconGroup({ sense: doc.senses[0], noFaMinus: true })
      )
    } else {
      doc.senses.forEach((sense) =>
        el.appendChild(createLexiconGroup({ sense }))
      )
    }

    el.appendChild(dangerZone())
  })
}
