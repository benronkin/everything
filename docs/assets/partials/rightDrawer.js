import { handlRightDrawerState } from '../js/ui.js'
import { injectStyle } from '../js/ui.js'
import { createList } from './list.js'

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
  /* make the pane itself scrollable */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;   /* smooth momentum scroll on iOS */
  z-index: 1000;
  background: var(--gray1);
  width: 250px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  transition: all 300ms ease;
  transform: translateX(100%);
}
#right-drawer.open {
  transform: translateX(0);
}
.toc-header {
  position: sticky;
  top: 0;
  background: var(--teal2);
  color: black;
  font-weight: 700;
  padding: 20px 10px;
  transition: all 0.3s ease-in-out;
  margin: 0 0 20px 0;
}
.toc-item {
  cursor: pointer;
  padding: 10px;
}
.toc-item.p-left-0 {
  margin-top: 15px;
}
.toc-item:hover,
.toc-item.active {
  background: var(--gray2);
}
`

export function createRightDrawer() {
  injectStyle(css)

  const el = createList({
    id: 'right-drawer',
    className: 'nav',
    itemClass: 'list-item',
  })

  listen(el)

  return el
}

/**
 *
 */
function listen(el) {
  document.querySelector('body').addEventListener('click', (e) => {
    if (
      !e.target.closest('#right-drawer') &&
      !e.target.closest('#toggle-right-drawer')
    )
      handlRightDrawerState('close')
  })
}
