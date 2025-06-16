import { injectStyle } from '../js/ui.js'
import { createInputGroup } from './inputGroup.js'
import { createDiv } from './div.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
`

export function createComboGroup({
  id,
  classes,
  value,
  name,
  placeholder,
  type,
  className = null,
} = {}) {
  injectStyle(css)

  if (className || classes & (typeof classes !== 'object') || !classes?.icon) {
    throw new Error(
      `createComboGroup expects a classes object: {group: '', input: '', icon: ''} `
    )
  }

  classes.group = `${classes.group} combo-group`.trim()
  const el = createInputGroup({
    id,
    classes,
    value,
    name,
    placeholder,
    type,
    autocomplete: 'off',
  })

  build(el)
  react(el)
  listen(el)

  return el
}

function build(el) {
  el.appendChild(createDiv({ className: 'combo-options' }))
}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen(el) {
  // el.addEventListener('click', () => {
  //   state.set('stateVar', 'value')
  // })
}
