import { injectStyle } from '../js/ui.js'
import { createAvatar } from '../partials/avatar.js'
import { createDiv } from '../partials/div.js'
import { createHeader } from '../partials/header.js'
import { createIcon } from '../partials/icon.js'
import { state } from '../js/state.js'

const css = `

nav {
  background: var(--nav-gradient);
  display: flex;
  height: var(--nav-height);
}
nav ul,
nav .container,
nav .brand {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}
nav ul,
nav .container {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
nav .brand {
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  }
nav .brand h3 {
  margin: 0;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
}
nav h3,
nav .brand i:hover {      
  color: var(--purple3);
}
nav #breadcrumbs, nav #breadcrumbs #bc-root {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  text-transform: uppercase;
}
nav #breadcrumbs .fa-chevron-right {
  color: var(--gray2);
}
nav #breadcrumbs #bc-root {
  margin: 0;
}
`

export function createNav({ title, isHome = false } = {}) {
  injectStyle(css)

  const el = document.createElement('nav')

  build(el)
  react(el)
  listen(el)

  if (isHome) {
    el.querySelector('#bc-root').innerHTML = title
  } else {
    el.querySelector('.brand h3').innerHTML = title
  }

  return el
}

export function handleBrandClick() {
  window.location = './index.html'
}

function handleHomeClick() {
  window.location = '../home/index.html'
}

function build(el) {
  const containerEl = createDiv({ className: 'container' })
  el.appendChild(containerEl)

  const breadcrumbs = createDiv({ id: 'breadcrumbs' })
  containerEl.appendChild(breadcrumbs)

  breadcrumbs.appendChild(
    createHeader({
      id: 'bc-root',
      type: 'h3',
      html: [
        createIcon({ classes: { primary: 'fa-home' } }),
        createIcon({ classes: { primary: 'fa-chevron-right' } }),
      ],
    }),
  )

  const brandEl = createDiv({ className: 'brand' })
  breadcrumbs.appendChild(brandEl)

  brandEl.appendChild(createHeader({ type: 'h3' }))
}

function react(el) {
  state.on('user', 'nav', (user) => {
    el.querySelector('#toggle-right-drawer')?.remove()

    el.querySelector('.container').appendChild(
      createAvatar({
        name: user.first_name,
        url: user.avatar,
        id: 'toggle-right-drawer',
      }),
    )
  })
}

function listen(el) {
  el.querySelector('.brand').addEventListener('click', handleBrandClick)
  el.querySelector('#bc-root .fa-home').addEventListener(
    'click',
    handleHomeClick,
  )
}
