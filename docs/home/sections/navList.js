import { injectStyle, navList as navListArr } from '../../assets/js/ui.js'
import { createList } from '../../assets/partials/list.js'
import { createMenuItem } from '../../assets/partials/menuItem.js'
import { state } from '../../assets/js/state.js'

const css = `
#home-nav-list {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.nav-list-item {
  display: flex;
  background: var(--gray0);
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius) !important;
  padding: 5px !important;
}
.nav-list-item a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: auto;
  color: var(--gray6);
  transition: all 0.3s ease-in-out;
}
.nav-list-item a:hover {
  color: var(--purple3);
}
`

export function navList() {
  injectStyle(css)

  const el = createList({
    id: 'home-nav-list',
    className: 'outer-wrapper mt-40',
  })

  const items = navListArr.filter((na) => na.id !== 'home')

  const children = items.map((ni) => {
    const item = createMenuItem({
      html: `<i class="fa-solid ${ni.icon}"></i> ${ni.label}`,
      url: `../${ni.url}`,
      id: `nl-item-${ni.id}`,
      className: 'nav-list-item',
    })
    item.classList.add('nav-list-item')
    return item
  })
  el.addChildren(children)

  return el
}
