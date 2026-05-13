import { createHeader } from '../../assets/partials/header.js'
import { createList } from '../../assets/partials/list.js'
import { createSpan } from '../../assets/partials/span.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createTaskHeader } from './taskHeader.js'
import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'

const css = `
#templates-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#add-template {
  padding: 5px;
}
`

export function templates(el) {
  injectStyle(css)

  el.innerHTML = ''

  el.appendChild(
    createHeader({
      id: 'templates-header',
      html: [
        createSpan({ html: 'templates' }),
        createIcon({
          id: 'add-template',
          classes: { primary: 'fa-plus' },
        }),
      ],
      type: 'h5',
      className: 'toc-header',
    }),
  )

  el.appendChild(
    createList({
      id: 'templates-list',
    }),
  )

  const templates = state.get('templates')
  if (!templates.length) return

  const children = templates.map((doc) => createTaskHeader(doc, 'template'))
  el.querySelector('#templates-list').addChildren(children)
}
