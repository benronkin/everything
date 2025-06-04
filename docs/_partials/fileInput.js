import { injectStyle } from '../_assets/js/ui.js'
import { createInput } from './input.js'
import { createLabel } from './label.js'
import { createSpan } from './span.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.file-upload {
  position: relative;
  display: inline-block;
}
.file-upload input.hidden-file-input {
  display: none;
}
.file-upload label {
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.file-upload .file-name {
  margin-left: 1rem;
  font-size: 0.85rem;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 * Constructor for custom file input element
 */
export function createFileInput({ iconClass, label, accept = '' }) {
  injectStyle(css)

  const el = document.createElement('div')
  el.className = `file-upload`

  el.clear = clear.bind(el)

  addElementParts({ el, iconClass, label, accept })
  addEventHandlers(el)

  return el
}

// -------------------------------
// Object methods
// -------------------------------

/**
 *
 */
function clear() {
  this.querySelector('input').value = ''
  this.querySelector('.file-name').value = ''
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function addElementParts({ el, iconClass, label, accept }) {
  const inputEl = createInput({
    id: 'hidden-file-input',
    accept,
    type: 'file',
    name: 'file',
  })
  inputEl.classList.add('hidden-file-input')
  el.appendChild(inputEl)

  const labelEl = createLabel({
    id: 'file-name',
    iconClass,
    value: label,
    classes: {
      base: 'u-active-primary',
      hover: 'u-hover-primary',
    },
  })
  labelEl.setAttribute('for', 'hidden-file-input')
  el.appendChild(labelEl)

  const spanEl = createSpan({})
  spanEl.classList.add('file-name')
  el.appendChild(spanEl)
}

/**
 *
 */
function addEventHandlers(el) {
  el.addEventListener('mouseenter', () => (el.hovered = true))
  el.addEventListener('mouseleave', () => (el.hovered = false))
}
