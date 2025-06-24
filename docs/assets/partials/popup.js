import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.popup {
  position: fixed;
  z-index: 3;
  background-color: black;
  cursor: pointer;
  padding: 10px;
}
`

export function createPopup({ id, className = '', html } = {}) {
  injectStyle(css)

  const el =
    document.querySelector('.popup') ||
    createDiv({ className: 'popup hidden', id })

  build(el)
  react(el)
  listen(el)

  id && (el.id = id)
  if (className.length) {
    for (const c of className.split(' ')) {
      el.classList.add(c)
    }
  }
  html && el.insertHtml(html)

  return el
}

function build(el) {}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen(el) {}
