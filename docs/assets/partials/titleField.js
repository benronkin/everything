import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createInputGroup } from '../partials/inputGroup.js'
import { createTextareaGroup } from '../partials/textareaGroup.js'

const css = `
.title-field-wrapper .title-field,
.title-field-wrapper i {
  font-size: 1.8rem;
  line-height: 1.2;
  }
.title-field-wrapper .title-field {
  border-bottom: 1px solid var(--gray0);
  font-weight: 500;
}
`

/**
 *   Accepts: id, classes, name, placeholder, autocomplete
 *     value, fieldType, className = null
 */
export function createTitleField(options) {
  injectStyle(css)

  const { classes, className = null, fieldType = 'input' } = options

  if (className || classes & (typeof classes !== 'object')) {
    throw new Error(
      `createTitleField Oops: pass-in optional classes object: {group: '', field: '', icon: ''} `
    )
  }

  const el = createDiv({ className: 'title-field-wrapper' })
  const fieldWrapper =
    fieldType === 'input'
      ? createInputGroup(options)
      : createTextareaGroup(options)

  fieldWrapper.querySelector('input')?.classList.add('title-field')
  fieldWrapper.querySelector('textarea')?.classList.add('title-field')
  el.appendChild(fieldWrapper)
  return el
}
