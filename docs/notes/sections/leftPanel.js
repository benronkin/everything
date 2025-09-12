import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { search } from '../../assets/composites/search.js'
import { mainDocumentsList } from './mainDocumentsList.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#left-panel {
  width: 100%;
}

`

export function leftPanel() {
  injectStyle(css)

  const el = createDiv()

  build(el)
  react(el)
  listen({ el, id: 'left-panel' })

  el.id = 'left-panel'
  el.dataset.id = 'left-panel'

  return el
}

function build(el) {
  el.appendChild(
    search({
      id: 'left-panel-search',
      placeholder: 'Search notes...',
      name: 'search-note',
    })
  )

  el.appendChild(mainDocumentsList())
}

function react(el) {
  state.on('app-mode', 'leftPanel', (appMode) => {
    if (appMode !== 'left-panel') {
      // log(`letPanel is hiding itself on app-mode: ${appMode}`)
      el.classList.add('hidden')
      return
    }

    el.classList.remove('hidden')
    // log(`letPanel is showing itself on app-mode: ${appMode}`)
  })

  state.on('main-documents', 'leftPanel', (docs) => {
    const message =
      docs?.length === 1 ? 'One note found' : `${docs.length} notes found`
    el.querySelector('.form-message').insertHtml(message)
  })
}

function listen({ el, id }) {
  // el.addEventListener('click', () => {})
}
