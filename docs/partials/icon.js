import { injectStyle } from '../js/ui.js'
import { newState } from '../js/newState.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
i {
  border-radius: var(--border-radius);
  cursor: pointer;
}
i.shake {
  animation: shake-it 300ms ease;
}
@keyframes shake-it {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
`

// -------------------------------
// Exported functions
// -------------------------------

export function createIcon({ id = '', className = '' } = {}) {
  injectStyle(css)
  const el = document.createElement('i')

  Object.defineProperties(el, {
    classes: {
      get() {
        return el.className
      },
      set(newValue = '') {
        el.className = `fa-solid ${newValue}`
      },
    },
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = `id-span`
      },
    },
    value: {
      get() {
        return el.innerHTML
      },
      set(newValue) {
        if (typeof newValue === 'string') {
          newValue = document.createTextNode(newValue)
        }
        el.innerHTML = ''
        el.appendChild(newValue)
      },
    },
  })

  el.shake = shake.bind(el)

  id && (el.dataId = id)
  el.classes = className
  el.role = 'button'
  el.tabIndex = 0

  if (id) {
    const stateVar = `${id}-click`
    el.addEventListener('click', () => {
      newState.set(stateVar, { id })
    })
  }

  return el
}

// -------------------------------
// Object methods
// -------------------------------

/**
 * Shake it, baby
 */
function shake() {
  this.classList.add('shake')
  setTimeout(() => this.classList.remove('shake'), 300)
  return
}
