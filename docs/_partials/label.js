import { injectStyle } from '../_assets/js/ui.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
label {
  border-radius: var(--border-radius);
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createLabel({
  iconClass,
  value,
  classes = {
    active: 'u-active-primary',
    base: 'u-base',
    hover: 'u-hover-primary',
  },
} = {}) {
  injectStyle(css)

  const el = document.createElement('label')
  el._classes = classes
  el.getClass = getClass.bind(el)
  el.className = el.getClass('base')

  if (iconClass) {
    const icon = createIcon({
      className: iconClass,
    })
    el.appendChild(icon)
  }
  Object.defineProperties(el, {
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
        if (!iconClass) {
          el.textContent = newValue
        } else {
          el.innerHTML += newValue
        }
      },
    },
  })
  el.value = value

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
