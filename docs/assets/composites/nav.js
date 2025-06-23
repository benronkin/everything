import { injectStyle } from '../js/ui.js'
import { createAvatar } from '../partials/avatar.js'
import { createDiv } from '../partials/div.js'
import { createHeader } from '../partials/header.js'
import { createIcon } from '../partials/icon.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

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
nav .brand h3,
nav .brand i:hover {      
  color: var(--purple3);
}
`

export function createNav({ title } = {}) {
  injectStyle(css)

  const el = document.createElement('nav')

  build(el)
  react(el)
  listen(el)

  el.querySelector('h3').innerHTML = title

  return el
}

function build(el) {
  const containerEl = createDiv({ className: 'container' })
  el.appendChild(containerEl)

  const brandEl = createDiv({ className: 'brand' })
  containerEl.appendChild(brandEl)

  brandEl.appendChild(createHeader({ type: 'h3' }))
}

function react(el) {
  state.on('user', 'nav', (user) => {
    el.querySelector('.container').appendChild(
      createAvatar({
        name: user.first_name,
        url: user.avatar,
        id: 'toggle-right-drawer',
      })
    )
  })
}

function listen(el) {
  el.querySelector('.brand').addEventListener('click', () => {
    if (!document.querySelector('#left-panel')) return
    state.set('app-mode', 'left-panel')
    state.set('active-doc', null)
  })
}
