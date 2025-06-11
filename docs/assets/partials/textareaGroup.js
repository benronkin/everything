import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createTextarea } from './textarea.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.ta-group {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: start;
  width: 100%;
}  
.ta-group i {
  cursor: default;
}
.ta-group textarea {
  margin: 0;
  width: 100%;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for a custom horizontal form
 */
export function createTextareaGroup({
  id,
  classes,
  name,
  placeholder,
  value,
  className = null,
}) {
  injectStyle(css)

  if (className || classes & (typeof classes !== 'object')) {
    throw new Error(
      `createTextareaGroup Oops: pass-in optional classes object: {group: '', textarea: '', icon: ''} `
    )
  }

  const el = createDiv()

  build({
    el,
    id,
    name,
    placeholder,
    value,
  })

  classes?.group && (el.className = classes.group)
  el.classList.add('ta-group')

  classes?.textarea &&
    (el.querySelector('textarea').className = classes.textarea)

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
function build({ el, id, name, placeholder, value }) {
  el.appendChild(createIcon())

  el.appendChild(
    createTextarea({
      id,
      name,
      placeholder,
      value,
    })
  )
}
