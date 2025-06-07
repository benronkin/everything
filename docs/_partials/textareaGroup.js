import { injectStyle } from '../_assets/js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createTextarea } from './textarea.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.ta-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;
}
.ta-group {
  width: 100%;
  display: flex;
  align-items: center;
}  
.ta-group i {
  padding-left: 0;  
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
  className,
  name,
  placeholder,
  iconClass,
  value,
}) {
  injectStyle(css)

  const el = createDiv()

  build({
    el,
    id,
    className,
    name,
    placeholder,
    iconClass,
    value,
  })

  el.className = 'ta-group'

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build({ el, id, className, name, placeholder, iconClass, value }) {
  el.appendChild(createIcon({ classes: { primary: iconClass } }))

  el.appendChild(
    createTextarea({
      id,
      className,
      name,
      placeholder,
      value,
    })
  )
}
