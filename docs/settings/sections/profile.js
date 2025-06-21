import { injectStyle } from '../../assets/js/ui.js'
import { createHeader } from '../../assets/partials/header.js'
import { createDiv } from '../../assets/partials/div.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

const css = `
`

export function profile() {
  injectStyle(css)

  const el = createDiv()

  build(el)
  react(el)
  listen(el)

  return el
}

function build(el) {
  el.appendChild(
    createHeader({
      html: '<i class="fa-solid fa-circle-user"></i> Profile',
      type: 'h4',
    })
  )
}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen(el) {
  // el.addEventListener('click', () => {
  //   state.set('stateVar', 'value')
  // })
}
