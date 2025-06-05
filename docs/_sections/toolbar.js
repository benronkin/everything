import { injectStyle } from '../_assets/js/ui.js'
import { createDiv } from '../_partials/div.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
#toolbar {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin: 20px 0;

}
#toolbar .container div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--gray1);
  border-radius: 10px;
  padding: 6px 20px;
  font-size: 1.1rem;
  // transition: all 200ms ease;
}
`

// -------------------------------
// Exported functions
// -------------------------------

export function createToolbar({ children = [], classes = {} } = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  build({ el, classes, children })

  el.id = 'toolbar'
  el.dataset.id = 'toolbar'
  el.dataset.testId = 'toolbar'

  return el
}

// -------------------------------
// Constructor
// -------------------------------

/**
 * Create the HTML element.
 */
function build({ el, children, classes }) {
  const containerEl = createDiv()
  containerEl.className = 'container'
  el.appendChild(containerEl)

  const divEl = createDiv()
  containerEl.appendChild(divEl)

  for (const child of children) {
    divEl.appendChild(child)
  }

  classes.other || (classes.other = ['w-fc'])
  for (const c of classes.other) {
    divEl.classList.add(c)
  }
  classes.primary && divEl.classList.add(classes.primary)
}
