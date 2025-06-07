import { injectStyle } from '../_assets/js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createInput } from './input.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.input-group {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
}  
.input-group i {
  padding-left: 0;  
  cursor: default;
}
.input-group input {
  margin: 0;
}
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor for a custom horizontal form
 */
export function createInputGroup({
  id,
  className,
  type = 'text',
  name,
  placeholder,
  autocomplete,
  iconClass,
  value,
}) {
  injectStyle(css)

  const el = createDiv()

  build({
    el,
    id,
    className,
    type,
    name,
    placeholder,
    autocomplete,
    iconClass,
    value,
  })

  el.className = 'input-group'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build({
  el,
  id,
  className,
  type,
  name,
  placeholder,
  autocomplete,
  iconClass,
  value,
}) {
  el.appendChild(createIcon({ classes: { primary: iconClass } }))

  el.appendChild(
    createInput({
      id,
      className,
      type,
      name,
      placeholder,
      autocomplete,
      value,
    })
  )
}
