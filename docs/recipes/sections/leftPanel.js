import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { mainDocumentsList } from './mainDocumentsList.js'
import { search } from '../../assets/composites/search.js'

const css = `
#left-panel {
  width: 100%;
}
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

  const el = createDiv()

  build(el)

  el.id = 'left-panel'
  return el
}

function build(el) {
  el.appendChild(
    search({
      id: 'left-panel-search',
      placeholder: 'Search recipes...',
      name: 'search-recipe'
    })
  )

  el.appendChild(mainDocumentsList())
}
