import { injectStyle } from '../js/ui.js'

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

export function createIcon({ id = '', className = '', events = {} } = {}) {
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

  for (const [eventName, cb] of Object.entries(events)) {
    el.addEventListener(eventName, cb)
  }

  el.shake = shake.bind(el)

  el.dataId = id
  el.classes = className
  el.role = 'button'
  el.tabIndex = 0

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
