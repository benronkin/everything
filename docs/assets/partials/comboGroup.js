import { injectStyle } from '../js/ui.js'
import { createInputGroup } from './inputGroup.js'
import { createDiv } from './div.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.combo-group{
  position: relative;
}
.combo-group .combo-options {
  position: absolute;
  left: 35px;
  right: 0;
  background-color: var(--gray1);
  padding: 0;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.08);
}
.combo-group .combo-option {
cursor: pointer;
display: flex;
align-items: center;
justify-content: space-between;
padding: 10px;
transition: all 0.2s ease-in-out;
}
.combo-group .combo-options,
.combo-group .combo-option:last-child {
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
.combo-group .combo-option:hover{
  background-color: var(--gray2);
}
`

export function createComboGroup({
  id,
  classes,
  value,
  name,
  placeholder,
  type,
  className,
  options,
} = {}) {
  injectStyle(css)

  if (!classes?.icon) {
    throw new Error(
      `createComboGroup expects className for the div wrapper, and a classes object: {group: '', input: '', icon: ''} `
    )
  }
  if (!name) {
    throw new Error(
      `createComboGroup expects a name property for the dropdown option delete to work`
    )
  }

  const el = createDiv({
    id,
    className: `${className || ''} combo-group`.trim(),
  })

  build({
    el,
    classes,
    value,
    name,
    placeholder,
    type,
    autocomplete: 'off',
    options,
  })
  react(el)
  listen(el)

  return el
}

function build({ el, classes, value, name, placeholder, type, options }) {
  el.appendChild(
    createInputGroup({
      classes,
      value,
      name,
      placeholder,
      type,
      autocomplete: 'off',
    })
  )

  const dropdownEl = createDiv({ className: 'combo-options' })
  el.appendChild(dropdownEl)

  el.setOptions = setOptions.bind(el)
  if (options) {
    el.setOptions(options)
  }
}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen(el) {
  // el.addEventListener('click', () => {
  //   state.set('stateVar', 'value')
  // })
}

function setOptions(options) {
  const dropdownEl = this.querySelector('.combo-options')
  dropdownEl.innerHTML = ''
  options.forEach((html) => {
    const item = createDiv({
      className: 'combo-option',
      html,
    })
    dropdownEl.appendChild(item)
  })
}
