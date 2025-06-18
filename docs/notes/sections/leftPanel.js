import { injectStyle } from '../../assets/js/ui.js'
import { log } from '../../assets/js/logger.js'
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
      placeholder: 'Search notes...',
      name: 'search-note',
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

/**
 *
 */
function listen({ el, id }) {
  // el.addEventListener('click', () => {})
}
