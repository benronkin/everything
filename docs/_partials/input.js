import { injectStyle } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
input {
  cursor: pointer;
  text-decoration: none;
  padding: 7px 3px;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for a custom input element
 */
export function createInput({
  id = '',
  className = '',
  accept = '',
  type = '',
  name = '',
  value = '',
  maxLength,
  placeholder = '',
  autocomplete = true,
  classes = {
    active: 'u-input-active-primary',
    base: 'u-input-base',
    hover: 'u-input-hover-primary',
  },
  events = {},
} = {}) {
  injectStyle(css)

  const el = document.createElement('input')
  el._classes = classes
  el.getClass = getClass.bind(el)
  el.className = `${className} ${el.getClass('base')}`
  if (maxLength) {
    el.maxlength = maxLength
  }

  Object.defineProperties(el, {
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = newValue
      },
    },
    hovered: {
      set(v) {
        el.classList.toggle(el.getClass('hover'), v)
      },
    },
    // don't override input.value: it just creates stack overflow
  })

  el._classes = classes
  el.dataset.id = id
  el.dataId = id
  el.accept = accept
  el.type = type
  el.name = name
  el.value = value
  el.placeholder = placeholder
  el.dataset.testId = `${id}-input` // cypress
  if (autocomplete) {
    el.autocomplete = autocomplete
  }

  el.addEventListener('mouseenter', () => (el.hovered = true))
  el.addEventListener('mouseleave', () => (el.hovered = false))

  for (const [k, v] of Object.entries(events)) {
    el.addEventListener(k, v)
  }

  return el
}

// -------------------------------
// Object methods
// -------------------------------

/**
 *
 */
function getClass(className) {
  return this._classes[className]
}
