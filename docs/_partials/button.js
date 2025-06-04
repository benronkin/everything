import { injectStyle } from '../_assets/js/ui.js'
import { createIcon } from './icon.js'
import { newState } from '../_assets/js/newState.js'

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
  disabled = false,
  iconClass,
  value,
  type,
  classes = {
    active: 'u-active-primary',
    base: 'u-active-primary',
    disabled: 'u-disable',
    hover: 'u-hover-primary',
  },
  events = {},
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
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = id
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
  id && (el.dataId = id)
  disabled && (el.disabled = 'disabled')
  el.value = value
  type && (el.type = type)

  el.addEventListener('mouseenter', () => (el.hovered = true))
  el.addEventListener('mouseleave', () => (el.hovered = false))

  if (id) {
    const stateVar = `${id}-click`
    el.addEventListener('click', () => {
      console.log('stateVar', stateVar)
      newState.set(stateVar, { id })
    })
  }

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
