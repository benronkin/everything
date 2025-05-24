import { injectStyle } from '../js/ui.js'

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
  accept = '',
  type = '',
  name = '',
  value = '',
  placeholder = '',
  autocomplete = true,
  classes = {
    active: 'u-input-active-primary',
    base: 'u-input-base',
    hover: 'u-input-hover-primary',
  },
} = {}) {
  injectStyle(css)

  const el = document.createElement('input')
  el._classes = classes
  el.getClass = getClass.bind(el)
  el.className = el.getClass('base')

  Object.defineProperties(el, {
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.dataset.id = newValue
      },
    },
    hovered: {
      set(v) {
        el.classList.toggle(el.getClass('hover'), v)
      },
    },
    value: {
      get() {
        return el.dataset.value
      },
      set(newValue) {
        el.dataset.value = newValue
        el.dataset.testId = `${id}-input`
      },
    },
  })

  el.value = value
  el._classes = classes
  el.dataset.id = id
  el.dataId = id
  el.accept = accept
  el.type = type
  el.name = name
  el.placeholder = placeholder
  el.dataset.testId = `${id}-input` // cypress
  if (autocomplete) {
    el.autocomplete = autocomplete
  }

  el.addEventListener('mouseenter', () => (el.hovered = true))
  el.addEventListener('mouseleave', () => (el.hovered = false))

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
