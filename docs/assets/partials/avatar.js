import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createImage } from './image.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
`

export function createAvatar({ className = '', name, url } = {}) {
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

  return el
}

function build(el) {}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen(el) {
  // el.addEventListener('click', () => {
  //   state.set('stateVar', 'value')
  // })
}
