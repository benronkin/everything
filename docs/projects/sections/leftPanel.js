import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { search } from '../../assets/composites/search.js'
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

  return el
}

function build(el) {
  el.appendChild(
    search({
      id: 'left-panel-search',
      placeholder: 'Search projects...',
      name: 'search-projects'
    })
  )

  el.appendChild(mainDocumentsList())
}
