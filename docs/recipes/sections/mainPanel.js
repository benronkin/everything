import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createRecipeGroup } from './recipe.group.js'
import { createSpan } from '../../assets/partials/span.js'
import { dangerZone } from './dangerZone.js'
import { log } from '../../assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

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

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20 hidden' })

  build(el)
  react(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element
 */
function build(el) {
  el.appendChild(createRecipeGroup())

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-20' }))

  el.appendChild(createSpan({ id: 'recipe-id' }))
}

/**
 * Subscribe to state.
 */
function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    if (appMode !== 'main-panel') {
      el.classList.add('hidden')
      // log(`mainPanel is hiding itself on app-mode: ${appMode}`)
      return
    }
    reactAppMode(el)
  })
}

/**
 *
 */
function reactAppMode(el) {
  const id = state.get('active-doc')
  const doc = { ...state.get('main-documents').find((d) => d.id === id) }
  el.classList.remove('hidden')
  // log('mainPanel is showing itself on active-doc')

  el.querySelector('[data-id="recipe-title"]').value = doc.title || ''
  el.querySelector('[data-id="recipe-notes"]').value = doc.notes || ''
  el.querySelector('[data-id="recipe-notes"]').resize()
  el.querySelector('[data-id="recipe-related"]').value = doc.related || ''
  el.querySelector('[data-id="recipe-ingredients"]').value =
    doc.ingredients || ''
  el.querySelector('[data-id="recipe-ingredients"]').resize()
  el.querySelector('[data-id="recipe-method"]').value = doc.method || ''
  el.querySelector('[data-id="recipe-method"]').resize()
  el.querySelector('[data-id="recipe-category"]').value = doc.category || ''
  el.querySelector('[data-id="recipe-tags"]').value = doc.tags || ''
  el.querySelector('[data-id="recipe-id"]').insertHtml(doc.id)
}
