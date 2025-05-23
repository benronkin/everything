import { injectStyle } from '../js/ui.js'
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
export function createFileInput({
  id,
  iconClass,
  label,
  accept = '',
  classes = {},
}) {
  injectStyle(css)

  const el = document.createElement('div')
  el.className = 'file-upload'
  el._classes = classes

  const inputEl = createInput({
    classes,
    id,
    accept,
    type: 'file',
    name: 'file',
  })
  inputEl.classList.add('hidden-file-input')
  el.appendChild(inputEl)

  const labelEl = createLabel({
    iconClass,
    value: label,
    classes: {
      base: 'u-active-primary',
      hover: 'u-hover-primary',
    },
  })
  labelEl.setAttribute('for', id)
  el.appendChild(labelEl)

  const spanEl = createSpan({})
  spanEl.classList.add('file-name')
  el.appendChild(spanEl)

  el.clear = clear.bind(el)
  el.getClass = getClass.bind(el)
  el.className = `file-upload ${el.getClass('base')}`

  Object.defineProperties(el, {
    hovered: {
      set(v) {
        el.classList.toggle(el.getClass('base'), !v)
        el.classList.toggle(el.getClass('hover'), v)
        el.querySelector('label').classList.toggle(el.getClass('hover'), v)
        el.querySelector('input').classList.toggle(el.getClass('hover'), v)
      },
    },
  })

  el.addEventListener('mouseenter', () => (el.hovered = true))
  el.addEventListener('mouseleave', () => (el.hovered = false))

  el.addEventListener('change', (e) => {
    const span = e.target.closest('.file-upload').querySelector('.file-name')
    span.textContent = e.target.files[0]?.name || ''
  })

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

/**
 *
 */
function getClass(className) {
  return this._classes[className]
}
