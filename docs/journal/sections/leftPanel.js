import { injectStyle } from '../../assets/js/ui.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { mainDocumentsList } from './mainDocumentsList.js'
import { search } from '../../assets/composites/search.js'

const css = `
#left-panel {
  width: 100%;
}

#next-page {
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
      placeholder: 'Search entries...',
      name: 'search-entry'
    })
  )

  el.appendChild(mainDocumentsList())

  el.appendChild(
    createButton({
      id: 'next-page',
      html: 'Show more',
      className: 'primary hidden'
    })
  )
}
