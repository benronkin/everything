import { state } from '../js/state.js'
import { injectStyle } from '../js/ui.js'
import { createList } from '../partials/list.js'
import { createMenuItem } from '../partials/menuItem.js'

// -------------------------------
// Globals
// -------------------------------

const items = [
  {
    html: '<i class="fa-solid fa-list-check"></i> Tasks',
    url: '../tasks/index.html',
    id: 'rd-item-tasks',
  },
  {
    html: '<i class="fa-solid fa-cake-candles"></i> Recipes',
    url: '../recipes/index.html',
    id: 'rd-item-recipes',
  },
  {
    html: '<i class="fa-solid fa-cart-shopping"></i> Shopping',
    url: '../shopping/index.html',
    id: 'rd-item-shopping',
  },
  {
    html: '<i class="fa-solid fa-note-sticky"></i> Notes',
    url: '../notes/index.html',
    id: 'rd-item-notes',
  },
  {
    html: '<i class="fa-solid fa-book"></i> Journal',
    url: '../journal/index.html',
    id: 'rd-item-journal',
  },
  {
    html: '<i class="fa-solid fa-lock"></i> Admin',
    url: '../admin/index.html',
    id: 'rd-item-admin',
  },
]

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

// -------------------------------
// Exported functions
// -------------------------------

export function createRightDrawer({ active }) {
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

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function build({ el, active }) {
  const listItems = items.map(({ html, url, id }) =>
    createMenuItem({ value: html, url, id, type: 'anchor' })
  )
  el.addChildren(listItems)
  if (active) {
    const id = `rd-item-${active}`
    const child = el.getChildById(id)
    child.selected = true
  }
}

/**
 * Subscribe to and set state.
 */
function react(el) {
  state.on('icon-click:toggle-right-drawer', 'rightDrawer', () => {
    el.classList.toggle('open')
  })
}

/**
 *
 */
function listen({ el }) {
  document.addEventListener('click', (e) => {
    hanleRightDrawerClose(e, el)
  })
}

/**
 * Close rightDrawer when clicking on document
 */
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
