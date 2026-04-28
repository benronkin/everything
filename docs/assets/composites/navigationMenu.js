import { injectStyle, navList } from '../js/ui.js'
import { createList } from '../partials/list.js'
import { createMenuItem } from '../partials/menuItem.js'

const css = `
`

export function createNavigationMenu({ container, active } = {}) {
  injectStyle(css)

  container.innerHTML = ''

  const el = createList({
    className: 'nav',
    itemClass: 'list-item',
  })

  build({ el, active })

  container.appendChild(el)
}

function build({ el, active }) {
  const listItems = navList.map((ni) =>
    createMenuItem({
      html: `<i class="fa-solid ${ni.icon}"></i> ${ni.label}`,
      url: `../${ni.url}`,
      id: `rd-item-${ni.id}`,
      className: 'menu-item',
    }),
  )

  el.addChildren(listItems)
  if (active) {
    const id = `rd-item-${active}`
    const child = el.getChildById(id)
    child.classList.add('active')
  }
}
