import { injectStyle } from '../../_assets/js/ui.js'
import { createDiv } from '../../_partials/div.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#main-panel {
  padding: 0 20px;
  align-items: center;
  width: calc(100% - var(--sidebar-width));
  padding-left: 20px;
  /* border-left: 1px solid var(--purple2); */
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
  width: 100%;
  margin: 10px 0;
  border-bottom: 1px solid var(--gray3);
}
#main-panel textarea.field {
  min-height: 52px;
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

  const el = createDiv()

  build(el)
  react(el)
  listen({ el, id: 'main-panel' })

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
function build(el) {}

/**
 * Subscribe to and set state.
 */
function react(el) {}

/**
 *
 */
function listen({ el, id }) {
  el.addEventListener('click', () => {})
}
