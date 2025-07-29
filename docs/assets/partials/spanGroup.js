import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createSpan } from './span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.span-group {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
}  
.span-group i {
  cursor: default;
}
.span-group span {
  margin: 0;
}  
`

/**
 * Constructor for a custom horizontal form
 */
export function createSpanGroup({ id, classes, html, className = null }) {
  injectStyle(css)

  if (className || classes & (typeof classes !== 'object')) {
    throw new Error(
      `createInputGroup Oops: pass-in optional classes object: { group: '', span: '', icon: ''} `
    )
  }

  const el = createDiv()

  build({
    el,
    id,
    html,
    classes,
  })

  classes?.group && (el.className = classes.group)
  el.classList.add('span-group')

  if (classes?.span) {
    const arr = classes.span.split(' ')
    for (const c of arr) {
      el.querySelector('span').classList.add(c)
    }
  }

  if (classes?.icon) {
    const arr = classes.icon.split(' ')
    for (const c of arr) {
      el.querySelector('i').classList.add(c)
    }
  }

  return el
}

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build({ el, id, html }) {
  el.appendChild(createIcon())

  el.appendChild(
    createSpan({
      id,
      html,
    })
  )
}
