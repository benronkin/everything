import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createDateTime } from './dateTime.js'

const css = `
`

export function createDateTimeGroup({ id, classes, name, value }) {
  injectStyle(css)

  const el = createDiv({ id })

  build({
    el,
    name,
    value,
  })

  classes?.group && (el.className = classes.group)
  el.classList.add('input-group')

  if (classes?.icon) {
    const arr = classes.icon.split(' ')
    for (const c of arr) {
      el.querySelector('i').classList.add(c)
    }
  }

  return el
}

function build({ el, name, value }) {
  el.appendChild(createIcon())

  const dateTimeEl = createDateTime({
    name,
  })
  if (value) dateTimeEl.setDateTime(value)

  el.appendChild(dateTimeEl)
}
