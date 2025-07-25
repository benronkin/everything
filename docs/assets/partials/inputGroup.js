import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createInput } from './input.js'

const css = `
.input-group {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
  width: 100%;
}  
.input-group i {
  cursor: default;
}
.input-group input {
  margin: 0;
}
`

export function createInputGroup({
  id,
  classes,
  type = 'text',
  name,
  placeholder,
  autocomplete,
  value,
  className = null,
}) {
  injectStyle(css)

  if (className || classes & (typeof classes !== 'object')) {
    throw new Error(
      `createInputGroup expects a classes object: {group: '', input: '', icon: ''} `
    )
  }

  const el = createDiv()

  build({
    el,
    id,
    type,
    name,
    placeholder,
    autocomplete,
    value,
  })

  classes?.group && (el.className = classes.group)
  el.classList.add('input-group')

  classes?.input && (el.querySelector('input').className = classes.input)

  if (classes?.icon) {
    const arr = classes.icon.split(' ')
    for (const c of arr) {
      el.querySelector('i').classList.add(c)
    }
  }

  return el
}

function build({ el, id, type, name, placeholder, autocomplete, value }) {
  el.appendChild(createIcon())

  el.appendChild(
    createInput({
      id,
      type,
      name,
      placeholder,
      autocomplete,
      value,
    })
  )
}
