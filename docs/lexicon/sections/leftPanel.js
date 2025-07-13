import { injectStyle } from '../../assets/js/ui.js'
import { log } from '../../assets/js/logger.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { mainDocumentsList } from './mainDocumentsList.js'
import { search } from '../../assets/composites/search.js'

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

  el.id = 'left-panel'

  return el
}

function build(el) {
  el.appendChild(
    search({
      id: 'left-panel-search',
      placeholder: 'Search lexicon...',
      name: 'search-lexicon',
    })
  )

  el.appendChild(mainDocumentsList())
}

function react(el) {
  state.on('app-mode', 'leftPanel', (appMode) => {
    if (appMode !== 'left-panel') {
      el.classList.add('hidden')
      return
    }

    el.classList.remove('hidden')
    const currentId = state.get('active-doc')
    if (!currentId) {
      el.querySelector('#left-panel-list').reset()
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
