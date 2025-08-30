import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { tasks } from './tasks.js'
import { wotd } from './wotd.js'
import { navList } from './navList.js'
import { bookmarks } from './bookmarks.js'

const css = `
#main-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  flex-grow: 1;
  justify-content: flex-start;
  padding-top: 20px;
}
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20' })

  build(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

function build(el) {
  el.appendChild(tasks())

  el.appendChild(wotd())

  el.appendChild(navList())

  el.appendChild(bookmarks())
}
