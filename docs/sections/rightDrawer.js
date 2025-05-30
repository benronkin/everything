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
    html: '<i class="fa-solid fa-note-sticky"></i> notes',
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
  const el = createElement({ active })

  Object.defineProperties(el, {
    open: {
      get() {
        return el.dataset.open === 'true'
      },
      set(value) {
        el.dataset.open = value
        el.classList.toggle('open', value)
      },
    },
    toggle: {
      value() {
        el.open = !el.open
      },
    },
  })

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

document.addEventListener('click', (e) => {
  if (
    e.target.closest('[data-id="right-drawer"]') ||
    e.target.closest('#toggle-right-drawer')
  ) {
    // ignore clicks on above items
    return
  }
  const drawer = document.querySelector('[data-id="right-drawer"]')
  drawer.open = false
})

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ active }) {
  const listEl = createList({ id: 'right-drawer', className: 'nav' })

  const listItems = items.map(({ html, url, id }) =>
    createMenuItem({ value: html, url, id, type: 'anchor' })
  )
  listEl.addChildren(listItems)
  if (active) {
    const id = `rd-item-${active}`
    const child = listEl.getChildById(id)
    child.selected = true
  }

  return listEl
}
