import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { state } from '../../assets/js/state.js'

const css = `
`

export function create({ id, className = '', html } = {}) {
  injectStyle(css)

  const el = createDiv({ className, id })

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

function listen(el) {
  // el.addEventListener('click', () => {
  //   state.set('stateVar', 'value')
  // })
}
