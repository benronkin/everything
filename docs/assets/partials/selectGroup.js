import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
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

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for a custom horizontal form
 */
export function createSelectGroup({
  id,
  classes,
  name,
  value,
  options,
  className = null,
}) {
  injectStyle(css)

  if (className || classes & (typeof classes !== 'object')) {
    throw new Error(
      `createSelectGroup Oops: pass-in optional classes object: { group: '', select: '', icon: ''} `
    )
  }

  const el = createDiv()

  build({
    el,
    className: classes?.select,
    id,
    name,
    value,
    options,
  })

  classes?.group && (el.className = classes.group)
  el.classList.add('select-group')

  if (classes?.icon) {
    const arr = classes.icon.split(' ')
    for (const c of arr) {
      el.querySelector('i').classList.add(c)
    }
  }

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build({ el, id, className, name, value, options }) {
  el.appendChild(createIcon())

  el.appendChild(
    createSelect({
      id,
      className,
      name,
      value,
      options,
    })
  )
}
