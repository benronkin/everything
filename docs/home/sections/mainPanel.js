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
}
a, a:visited {
  color: var(--gray6);
}
.equal-cols {
  flex-direction: column;
}
.equal-cols > * {
  width: 100%;
}
@media (min-width: 768px) {
  .equal-cols {
    flex-direction: row;
  }
  .equal-cols > * {
    flex: 1; /* Forces all items to share space equally only on wide screens */
    width: auto; /* Reset width to allow flex-grow to work */
  }
  .tasks-wrapper {
    margin-top: 0;
  }
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
  el.appendChild(navList())

  const div = createDiv({ className: 'flex align-center equal-cols gap-20' })

  el.appendChild(div)

  div.appendChild(tasks())

  div.appendChild(wotd())

  el.appendChild(bookmarks())
}
