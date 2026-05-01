import { injectStyle } from '../js/ui.js'
import { createForm } from './form.js'
import { createInputGroup } from './inputGroup.js'
import { createTextareaGroup } from './textareaGroup.js'
import { createSpan } from './span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.form-horizontal {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.form-horizontal button {
  margin-left: 20px;
}
.form-horizontal button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
.form-horizontal .form-message {
  color: var(--gray3);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
`

/**
 * Constructor for a custom horizontal form
 */
export function createFormHorizontal({
  inputOrTextarea = 'input',
  id,
  type = 'text',
  name,
  placeholder,
  autocomplete,
  buttonIconClass,
  classes,
  submitText,
  value,
  disabled = false,
}) {
  injectStyle(css)

  const el = createForm({
    id,
    classes,
    type,
    name,
    placeholder,
    autocomplete,
    value,
    submitText,
  })

  build({
    el,
    inputOrTextarea,
    classes,
    name,
    type,
    placeholder,
    autocomplete,
    buttonIconClass,
    submitText,
    disabled,
  })

  listen(el)

  el.className = 'form-horizontal'
  if (classes?.form) {
    for (const c of classes.form.split(' ')) {
      el.classList.add(c)
    }
  }

  return el
}

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build({
  el,
  inputOrTextarea,
  type,
  name,
  placeholder,
  autocomplete,
  classes,
  value,
}) {
  const obj = {
    classes: { icon: classes?.icon, group: classes?.group },
    placeholder,
    type,
    name,
    autocomplete,
    value,
  }

  if (inputOrTextarea === 'input') {
    el.appendChild(createInputGroup(obj))
  } else {
    el.appendChild(createTextareaGroup(obj))
  }

  el.appendChild(createSpan({ className: 'form-message' }))
}

/**
 * Set up event listeners
 */
function listen(el) {}
