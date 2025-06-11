import { injectStyle } from '../../js/ui.js'
import { log } from '../../js/logger.js'
import { state } from '../../js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { mainDocumentsList } from './mainDocumentsList.js'
import { search } from '../../assets/composites/search.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#left-panel {
  width: 100%;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
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

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.appendChild(
    search({
      id: 'left-panel-search',
      placeholder: 'Search entries...',
      name: 'search-entry',
    })
  )

  el.appendChild(mainDocumentsList())
}

/**
 * Subscribe to state.
 */
function react(el) {
  state.on('app-mode', 'leftPanel', (appMode) => {
    if (appMode !== 'left-panel') {
      log(`letPanel is hiding itself on app-mode: ${appMode}`)
      el.classList.add('hidden')
      return
    }

    el.classList.remove('hidden')
    log(`letPanel is showing itself on app-mode: ${appMode}`)

    // If there is an active-doc and it does not appear
    // in main-documents then delete active-doc
    const currentId = state.get('active-doc')?.id
    if (!currentId) {
      el.querySelector('#left-panel-list').reset()
      return
    }

    const docs = state.get('main-documents')
    const docExists = docs.findIndex((el) => el.id === currentId)
    if (!docExists) {
      state.set('active-doc', null)
      log('leftPanel is nullyfing active-doc on main-documents')
      return
    }
  })
}

/**
 *
 */
function listen({ el, id }) {
  // el.addEventListener('click', () => {})
}
