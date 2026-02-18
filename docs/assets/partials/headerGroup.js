import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createHeader } from './header.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.header-group {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
}  
.header-group i {
  cursor: default;
}
.span-group h1,
.span-group h2,
.span-group h3,
.span-group h4,
.span-group h5,
.span-group h6 {
  margin: 0;
}  
`

/**
 * Constructor for a custom horizontal form
 */
export function createHeaderGroup({
  id,
  type,
  classes,
  html,
  className = null,
}) {
  injectStyle(css)

  if (className || classes & (typeof classes !== 'object')) {
    throw new Error(
      `createHeaderGroup Oops: pass-in optional classes object: { group: '', type: '', icon: ''} `,
    )
  }

  const el = createDiv()

  build({
    el,
    id,
    type,
    html,
    classes,
  })

  classes?.group && (el.className = classes.group)
  el.classList.add('header-group')

  if (classes?.span) {
    const arr = classes.span.split(' ')
    for (const c of arr) {
      el.querySelector('header').classList.add(c)
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
function build({ el, type, id, html }) {
  el.appendChild(createIcon())

  el.appendChild(
    createHeader({
      id,
      type,
      html,
    }),
  )
}
