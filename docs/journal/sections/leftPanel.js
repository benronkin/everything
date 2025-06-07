import { injectStyle } from '../../_assets/js/ui.js'
import { log } from '../../_assets/js/ui.js'
import { newState } from '../../_assets/js/newState.js'
import { createDiv } from '../../_partials/div.js'
import { mainDocumentsList } from './mainDocumentsList.js'
import { createFormHorizontal } from '../../_partials/formHorizontal.js'

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
    createFormHorizontal({
      id: 'left-panel-search',
      formIconClass: 'fa-magnifying-glass',
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
  newState.on('main-documents', 'leftPanel', (docs) => {
    el.classList.remove('hidden')
    log('leftPanel is showing itself on main-documents')

    // If there is an active-doc and it does not appear
    // in main-documents then delete active-doc
    const currentId = newState.get('active-doc')?.id
    if (!currentId) return

    const docExists = docs.findIndex((el) => el.id === currentId)
    if (!docExists) {
      newState.set('active-doc', null)
      log('leftPanel is nullyfing active-doc on main-documents')
      return
    }
  })

  newState.on('active-doc', 'leftPanel', (doc) => {
    if (doc) {
      el.classList.add('hidden')
      log('leftPanel is hiding itself on an active-doc')
    } else {
      el.classList.remove('hidden')
      log('leftPanel is showing itself on a null active-doc')
      el.querySelector('#left-panel-list').reset()
      log('leftPanel is removing active class from all mainDocumentItems')
    }
  })
}

/**
 *
 */
function listen({ el, id }) {
  // el.addEventListener('click', () => {})
}
