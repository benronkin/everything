import { injectStyle } from '../js/ui.js'
import { createNavAvatar } from '../partials/navAvatar.js'
import { createDiv } from '../partials/div.js'
import { createHeader } from '../partials/header.js'
import { createIcon } from '../partials/icon.js'
import { createAnchor } from '../partials/anchor.js'
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
nav .purple,
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
nav #breadcrumbs * {
  font-size: 1.5rem !important;
}
nav #breadcrumbs .fa-chevron-right {
  color: var(--gray2);
}
nav #breadcrumbs #bc-root {
  margin: 0;
}
nav .text-link {
  margin-left: -10px;
}
`

export function createNav(obj) {
  injectStyle(css)

  const el = document.createElement('nav')

  if (obj.primaryIcon) {
    build(el, obj)
    react(el)
  } else {
    buildOld(el, obj)
    react(el)
    listen(el)
  }

  return el
}

/**
 * This should be sunset in favor of build()
 */
function buildOld(el, obj) {
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

  if (obj.isHome) {
    el.querySelector('#bc-root').innerHTML = obj.title
  } else {
    el.querySelector('.brand h3').innerHTML = obj.title
  }
}

/**
 *
 */
function build(el, obj) {
  // containerEl also holds use avatar that gets created in react()
  const containerEl = createDiv({ className: 'container' })
  el.appendChild(containerEl)
  const breadcrumbs = createDiv({ id: 'breadcrumbs' })
  containerEl.appendChild(breadcrumbs)

  const homeIconLink = createAnchor({
    url: '../home/index.html',
    html: createIcon({ classes: { primary: 'fa-home' } }),
    className: 'purple',
  })
  breadcrumbs.appendChild(homeIconLink)

  const isHome =
    window.location.pathname.includes('/home.index.html') ||
    window.location.pathname.includes('/home/')

  if (isHome) {
    const homeTextLink = createAnchor({
      url: '../home/index.html',
      html: obj.primaryText,
      className: 'text-link purple',
    })
    breadcrumbs.appendChild(homeTextLink)
    return
  }

  const firstRightChevron = createIcon({
    classes: { primary: 'fa-chevron-right' },
  })
  breadcrumbs.appendChild(firstRightChevron)

  const primaryIconLink = createAnchor({
    url: './index.html',
    html: createIcon({ classes: { primary: obj.primaryIcon } }),
    className: 'purple',
  })
  breadcrumbs.appendChild(primaryIconLink)

  const primaryTextLink = createAnchor({
    url: './index.html',
    html: obj.primaryText,
    className: 'text-link purple',
  })

  if (!obj.secondaryIcon) {
    breadcrumbs.appendChild(primaryTextLink)
    return
  }

  const urlParams = new URLSearchParams(window.location.search)
  const secondaryParm = urlParams.get(obj.secondaryParam)
  if (secondaryParm) {
    const secondRightChevron = createIcon({
      classes: { primary: 'fa-chevron-right' },
    })
    breadcrumbs.appendChild(secondRightChevron)
    breadcrumbs.appendChild(
      createIcon({
        classes: { primary: obj.secondaryIcon, other: ['purple'] },
      }),
    )
    return
  }

  breadcrumbs.appendChild(primaryTextLink)
}

/**
 *
 */
function react(el) {
  state.on('user', 'nav', (user) => {
    el.querySelector('#toggle-right-drawer')?.remove()

    el.querySelector('.container').appendChild(
      createNavAvatar({
        name: user.first_name,
        url: user.avatar,
        id: 'toggle-right-drawer',
        color: user.color,
      }),
    )
  })
}

/**
 *
 */
function listen(el) {
  el.querySelector('.brand').addEventListener('click', handleBrandClick)
  el.querySelector('#bc-root .fa-home').addEventListener(
    'click',
    handleHomeClick,
  )
}

/**
 * Remove when migrating to build()
 */
export function handleBrandClick() {
  window.location = './index.html'
}

/**
 * Remove when migrating to build()
 */
function handleHomeClick() {
  window.location = '../home/index.html'
}
