import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createSpan } from './span.js'
import { createSelect } from './select.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.select-group {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
  width: 100%;
}  
.select-group i {
  cursor: default;
}
.select-group select {
  margin: 0;
}
`

/**
 * Constructor for a custom horizontal form
 */
export function createSelectGroup({
  id,
  classes,
  name,
  value,
  options,
  label,
}) {
  injectStyle(css)

  if (classes & (typeof classes !== 'object')) {
    throw new Error(
      `createSelectGroup Oops: pass-in optional classes object: { group: '', select: '', icon: ''} `,
    )
  }

  const el = createDiv({ className: 'select-group' })

  build({
    el,
    id,
    name,
    value,
    options,
    label,
  })

  if (classes?.group) {
    const arr = classes.group.split(' ')
    for (const c of arr) {
      el.classList.add(c)
    }
  }

  if (classes?.icon) {
    const arr = classes.icon.split(' ')
    for (const c of arr) {
      el.querySelector('i').classList.add(c)
    }
  }

  if (classes?.wrapper) {
    classes.wrapper
      .split(' ')
      .forEach((c) => el.querySelector('.select-wrapper').classList.add(c))
  }

  if (classes?.select) {
    el.querySelector('.custom-select').classList.add(classes.select)
  }

  return el
}

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build({ el, id, name, value, options, label }) {
  if (label) {
    el.appendChild(createSpan({ html: label }))
  } else {
    el.appendChild(createIcon())
  }

  el.appendChild(
    createSelect({
      id,
      name,
      value,
      options,
    }),
  )
}
