import { state } from '../js/state.js'
import { injectStyle, navList } from '../js/ui.js'
import { createList } from '../partials/list.js'
import { createMenuItem } from '../partials/menuItem.js'

const css = `
.nav {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.nav .menu-item {
  padding: 0;
  margin-bottom: 0;
  border: 1px solid transparent;
  border-radius: 0;
  font-size: 1.1rem;
  text-align: left;
  width: 100%;
  transition: background 200ms ease;
}
.nav .menu-item.active {
  background: var(--purple2);
}  
.nav .menu-item:last-child {
  margin-top: auto;
}
.nav .menu-item a,
.nav .menu-item a:visited {
  padding: 12px 20px;
  display: block;
  width: 100%;
  color: var(--gray5);
  text-shadow: none;
}
.nav .menu-item:hover {
  background: var(--gray2);
  transform: none;
}
.nav .menu-item[data-selected="true"] {
  background: var(--purple2);
}
#right-drawer {
  position: fixed;
  top: var(--nav-height);
  right: 0;
  height: calc(100% - var(--nav-height));
  width: 250px;
  background: var(--gray1);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  transform: translateX(100%);
  transition: transform 300ms ease;
  z-index: 10;
}
#right-drawer.open {
  transform: translateX(0);
}
`

export function createRightDrawer({ active } = {}) {
  injectStyle(css)

  const el = createList({
    id: 'right-drawer',
    className: 'nav',
    itemClass: 'list-item',
  })

  build({ el, active })
  react(el)
  listen({ el })

  return el
}

function build({ el, active }) {
  const listItems = navList.map((ni) =>
    createMenuItem({
      html: `<i class="fa-solid ${ni.icon}"></i> ${ni.label}`,
      url: `../${ni.url}`,
      id: `rd-item-${ni.id}`,
      className: 'menu-item',
    })
  )

  el.addChildren(listItems)
  if (active) {
    const id = `rd-item-${active}`
    const child = el.getChildById(id)
    child.classList.add('active')
  }
}

function react(el) {
  state.on('right-drawer-toggle-click', 'rightDrawer', () => {
    el.classList.toggle('open')
  })
}

function listen({ el }) {
  document.addEventListener('click', (e) => {
    hanleRightDrawerClose(e, el)
  })
}

function hanleRightDrawerClose(e, el) {
  if (
    e.target.closest('[data-id="right-drawer"]') ||
    e.target.closest('#toggle-right-drawer')
  ) {
    // ignore clicks on above items
    return
  }
  el.classList.remove('open')
}
