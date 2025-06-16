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
  left: 30px;
  right: 0;
  background-color: var(--gray1);
  padding: 0;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.08);
  z-index: 3;
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

  const dropdownEl = createDiv({ className: 'combo-options hidden' })
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
  el.querySelector('input').addEventListener('focusin', (e) => {
    console.log('here', el.innerHTML)
    if (el.querySelectorAll('.combo-option').length) {
      this.querySelector('.combo-options').classList.remove('hidden')
    }
  })
}

function setOptions(options) {
  const inputEl = this.querySelector('input')
  const dropdownEl = this.querySelector('.combo-options')
  dropdownEl.innerHTML = ''

  if (!options.length) return

  // checks
  for (const opt of options) {
    if (opt.tagName !== 'DIV' || !opt.querySelector('span')?.value) {
      throw new Error(
        'comboGroup error: options needs to be an array of DIVs, each DIV containing a span with a value prop for the input element'
      )
    }
  }

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      inputEl.value = opt.querySelector('span').textContent
      dropdownEl.classList.add('hidden')
    })
    dropdownEl.appendChild(opt)
  })
}
