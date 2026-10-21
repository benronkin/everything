import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createSpan } from './span.js'
import { createSwitch } from './switch.js'

const css = `
.switch-group {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
}  
.switch-group span {
  margin: 0;
}
`

/**
 * Constructor for a custom horizontal form
 */
export function createSwitchGroup({ id, name, classes, label }) {
  injectStyle(css)

  const el = createDiv()

  build({
    el,
    id,
    name,
    label
  })

  classes?.group && (el.className = classes.group)
  el.classList.add('switch-group')

  if (classes?.switch) {
    const arr = classes.span.split(' ')
    for (const c of arr) {
      el.querySelector('.switch').classList.add(c)
    }
  }

  return el
}

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build({ el, id, name, label }) {
  el.appendChild(
    createSpan({
      html: label
    })
  )

  el.appendChild(createSwitch({ id, name }))
}
