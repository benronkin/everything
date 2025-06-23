import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createImage } from './image.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.avatar {
  background-color: var(--purple4);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  color: var(--gray1);
  font-weight: 700;
}
`

export function createAvatar({ className = '', name, url, id } = {}) {
  injectStyle(css)

  const el = url
    ? createImage({ src: url, className: 'avatar' })
    : createDiv({
        className: 'avatar',
        html: name ? name[0].toUpperCase() : 'U',
      })

  build(el)
  react(el)
  listen(el)

  if (className.length) {
    for (const c of className.split(' ')) {
      el.classList.add(c)
    }
  }
  id && (el.id = id)

  return el
}

function build(el) {}

function react(el) {}

function listen(el) {
  el.addEventListener('click', () => {
    state.set('right-drawer-toggle-click', true)
  })
}
