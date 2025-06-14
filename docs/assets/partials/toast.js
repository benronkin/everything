import { createIcon } from './icon.js'
import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.toast {
  cursor: pointer;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  z-index: 9999;
  transform: translateY(-1rem);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.toast[data-position="top-left"] { 
  top: 0.6rem; 
  left: 1rem; 
  bottom: auto; 
  right: auto; 
}
.toast[data-position="top-right"] { 
  top: 100px; 
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
.toast.quiet {
  background: transparent;
}
.toast.quiet .progress-bar,
.toast.quiet .fa-close {
  display: none;
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
  top: 2px;
  right: 2px;
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

export function createToast({
  id = '',
  className,
  autoClose = 1500,
  showProgress = true,
  position = 'TOP_RIGHT',
  message = '',
} = {}) {
  injectStyle(css)

  const el = createDiv({
    id,
    className: `toast ${className}.trim()`,
    html: message,
  })

  build(el, autoClose)

  el.removeToast = removeToast.bind(el)
  el.updateProgress = updateProgress.bind(el)
  el._showProgress = showProgress
  el.autoClose = autoClose

  position && (el.dataset.position = positionMap[position])
  el.style.animation = `${
    el.dataset.position.includes('left') ? 'slideInLeft' : 'slideInRight'
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
// Helpers
// -------------------------------

/**
 * Add sub elements to the element. No need
 * to return the element.
 */
function build(el, autoClose) {
  const messageDiv = document.createElement('div')
  messageDiv.dataset.id = 'toast-message'
  el.appendChild(messageDiv)

  if (autoClose) {
    const iconEl = createIcon({ classes: { primary: 'fa-close' } })
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
    this.dataset.position.includes('left') ? 'slideOutLeft' : 'slideOutRight'
  } 300ms ease forwards`

  this.addEventListener('animationend', function handler() {
    this.removeEventListener('animationend', handler)
    this.remove()
  })
}

/**
 *
 */
function updateProgress(value) {
  this.classList.toggle('progress', value)
}
