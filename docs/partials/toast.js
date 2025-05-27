import { createIcon } from './icon.js'
import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.toast {
  cursor: pointer;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: var(--gray3);
  color: var(--gray6);
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  z-index: 9999;
  transition: opacity 0.3s ease;
}
.toast[data-position="top-left"] { 
  top: 0.6rem; 
  left: 1rem; 
  bottom: auto; 
  right: auto; 
}
.toast[data-position="top-right"] { 
  top: 0.6rem; 
  right: 1rem; 
  bottom: auto; 
  left: auto; 
}
.toast[data-position="bottom-right"] { 
  bottom: 5rem; 
  right: 1rem; 
  top: auto; 
  left: auto; 
}
.toast[data-position="bottom-left"] { 
  bottom: 5rem; 
  right: auto; 
  top: auto; 
  left: 1rem; 
}
.toast .progress-bar {
  height: 4px;
  background: var(--gray6);
  width: 100%;
  transform-origin: left;
  transform: scaleX(var(--progress, 1));
  transition: transform 0.1s linear;
}
.toast .fa-close {
  position: fixed;
  top: -5px;
  right: 0;
  bottom: auto;
  left: auto;
}
`

const positionMap = {
  TOP_RIGHT: 'top-right',
  TOP_CENTER: 'top-center',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_LEFT: 'bottom-left',
}

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constuctor of a custom toast element
 */
export function createToast({
  id = '',
  className = '',
  autoClose = 1500,
  events = { click: null },
  showProgress = true,
  position = 'TOP_RIGHT',
  value = '',
} = {}) {
  injectStyle(css)

  const el = document.createElement('div')

  el.removeToast = removeToast.bind(el)
  el.updateProgress = updateProgress.bind(el)

  for (const [k, v] of Object.entries(events)) {
    if (k === 'click' && autoClose) {
      el.addEventListener('click', () => {
        v && v()
        el.removeToast()
      })
    } else {
      el.addEventListener(k, v)
    }
  }

  Object.defineProperties(el, {
    autoClose: {
      get() {
        return el.dataset.autoClose
      },
      set(newValue = '') {
        const parsed = parseInt(newValue, 10)
        if (!parsed || isNaN(parsed)) {
          // can pass null to keep toast open
          return
        }

        el.dataset.autoClose = parsed
        el._timeRemaining = parsed

        clearTimeout(el._closeTimeout)
        el._closeTimeout = setTimeout(() => el.removeToast(), parsed)

        clearInterval(el._progressInterval)
        if (el._showProgress) {
          el._progressInterval = setInterval(() => {
            el._timeRemaining -= 12
            el.style.setProperty('--progress', el._timeRemaining / parsed)
          }, 10)
        }
      },
    },
    classes: {
      get() {
        return el.className
      },
      set(newValue = '') {
        el.className = newValue
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
    position: {
      get() {
        return el.dataset.position
      },
      set(newValue = 'TOP_RIGHT') {
        el.dataset.position = positionMap[newValue]
      },
    },
    value: {
      get() {
        return el.querySelector('[data-id="toast-message"]')?.innerHTML ?? ''
      },
      set(newValue) {
        const messageDiv = el.querySelector('[data-id="toast-message"]')
        if (!messageDiv) return
        if (typeof newValue === 'string') {
          newValue = document.createTextNode(newValue)
        }
        messageDiv.innerHTML = ''
        messageDiv.appendChild(newValue)
      },
    },
  })

  addElementParts(el, autoClose)

  el.value = value
  id && (el.dataId = id)
  el.classes = `toast ${className}`
  el._showProgress = showProgress
  el.autoClose = autoClose

  position && (el.position = position)
  el.style.animation = `${
    el.position.includes('left') ? 'slideInLeft' : 'slideInRight'
  } 300ms ease forwards`

  return el
}

/**
 * Remove all toasts
 */
export function removeToasts() {
  document.querySelectorAll('.toast').forEach((el) => el.removeToast())
}

// -------------------------------
// Event handlers
// -------------------------------

// -------------------------------
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function addElementParts(el, autoClose) {
  const messageDiv = document.createElement('div')
  messageDiv.dataset.id = 'toast-message'
  el.appendChild(messageDiv)

  if (autoClose) {
    const iconEl = createIcon({ className: 'fa-close' })
    el.prepend(iconEl)

    const progressDiv = document.createElement('div')
    progressDiv.className = 'progress-bar'
    el.appendChild(progressDiv)
  }
}

/**
 *
 */
function removeToast() {
  clearTimeout(this._closeTimeout)
  clearInterval(this._progressInterval)
  this.style.animation = `${
    this.position.includes('left') ? 'slideOutLeft' : 'slideOutRight'
  } 300ms ease forwards`
  this.remove()
}

/**
 *
 */
function updateProgress(value) {
  this.classList.toggle('progress', value)
}
