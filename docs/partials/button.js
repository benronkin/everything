import { injectStyle } from '../js/ui.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
button {
  cursor: pointer;
  padding: 10px;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createButton({
  id,
  disabled,
  iconClass,
  value,
  type,
  classes = {
    active: 'u-active-primary',
    base: 'u-active-primary',
    disabled: 'u-disable',
    hover: 'u-hover-primary',
  },
} = {}) {
  injectStyle(css)

  const el = document.createElement('button')
  el._classes = classes
  el.getClass = getClass.bind(el)
  el.className = el.getClass('base')

  if (iconClass) {
    const icon = createIcon({
      className: iconClass,
    })
    el._icon = icon
  }
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
        el.classList.toggle(el.getClass('base'), !v)
        el.classList.toggle(el.getClass('hover'), v)
      },
    },
    value: {
      get() {
        return el.textContent
      },
      set(newValue) {
        el.innerHTML = ''
        if (el._icon) {
          el.appendChild(el._icon)
        }
        el.appendChild(document.createTextNode(newValue))
      },
    },
  })
  el.value = value
  if (id) {
    el.btnId = id
    el.dataset.testId = `${id}-button`
  }
  if (type) {
    el.type = type
  }
  if (disabled) {
    el.disabled = true
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
