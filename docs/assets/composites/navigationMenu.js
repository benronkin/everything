import { injectStyle, navList } from '../js/ui.js'
import { createList } from '../partials/list.js'
import { createMenuItem } from '../partials/menuItem.js'
import { createHeader } from '../partials/header.js'

const css = `
.nav-category {
  margin: 20px 20px 10px;
  border-bottom: 1px solid var(--gray3);
}
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
  const listItems = []
  const categories = []

  for (const ni of navList) {
    if (ni.category && !categories.includes(ni.category)) {
      listItems.push(
        createHeader({
          type: 'h5',
          html: ni.category,
          className: 'nav-category',
        }),
      )
      categories.push(ni.category)
    }

    listItems.push(
      createMenuItem({
        html: `<i class="fa-solid ${ni.icon}"></i> ${ni.label}`,
        url: `../${ni.url}`,
        id: `rd-item-${ni.id}`,
        className: 'menu-item',
      }),
    )
  }

  el.addChildren(listItems)
  if (active) {
    const id = `rd-item-${active}`
    const child = el.getChildById(id)
    child.classList.add('active')
  }
}
