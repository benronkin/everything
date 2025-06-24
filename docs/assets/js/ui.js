import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'
import { createToast, removeToasts } from '../../assets/partials/toast.js'
import { log } from './logger.js'

// ----------------------
// Globals
// ----------------------

let sharedStyleEl = null

// ------------------------
// Exports
// ------------------------

/**
 * Detect if mobile device
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Inject partials' css to the dom
 */
export function injectStyle(css) {
  if (!sharedStyleEl) {
    sharedStyleEl = document.createElement('style')
    sharedStyleEl.setAttribute('data-ui-style', 'true')
    document.head.appendChild(sharedStyleEl)
  }

  // Only append if it’s not already in the sheet
  if (!sharedStyleEl.textContent.includes(css.trim())) {
    sharedStyleEl.textContent += '\n' + css.trim()
  }
}

/**
 *
 */
export function isoToReadable(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const isThisYear = date.getFullYear() === now.getFullYear()

  const options = isThisYear
    ? { month: 'short', day: '2-digit' }
    : { month: 'long', day: '2-digit', year: 'numeric' }

  return date.toLocaleDateString('en-US', options)
}

/**
 * Resize the textarea
 */
export function resizeTextarea(textarea) {
  // allow page to lay out the elements
  requestAnimationFrame(() => {
    // First, set the textarea to the default height
    textarea.style.height = 'auto'
    textarea.style.height = '0'

    // Get the scroll height of the textarea content
    let minHeight = textarea.scrollHeight

    // If the scroll height is more than the default height, expand the textarea
    if (minHeight > textarea.clientHeight) {
      const height = parseFloat(minHeight) || 52
      textarea.style.height = height + 5 + 'px'
      // if (isMobile()) {
      //   textarea.style.height = height / 1.5 + 'px'
      // }
    }
  })
}

/**
 * Show message toast
 */
export function setMessage({
  message,
  className,
  type = 'message',
  showProgress = true,
  autoClose = 3000,
  position = 'BOTTOM_RIGHT',
} = {}) {
  if (!message) {
    // user wishes to clear all toasts
    removeToasts()
    return
  }

  function _createWarnMessage(message) {
    const iconEl = createIcon({ className: 'fa-circle-exclamation' })
    const el = createSpan()
    el.appendChild(iconEl)
    el.appendChild(document.createTextNode(message))
    return el
  }

  switch (type) {
    case 'danger':
      removeToasts()
      message = _createWarnMessage(message)
      className = 'danger'
      autoClose = null
      break
    case 'quiet':
      removeToasts()
      className = 'quiet'
      showProgress = false
      break
    case 'warn':
      message = _createWarnMessage(message)
      className = 'warn'
      break
  }

  const toast = createToast({
    message,
    className,
    autoClose,
    showProgress,
    position,
  })

  document.querySelector('body').appendChild(toast)
}

/**
 * Toggle the expander's button group
 */
export function toggleExpander(e) {
  // arrives from eventhandler or from a link click
  const el = e.target || e
  el.classList.toggle('fa-chevron-left')
  el.classList.toggle('fa-chevron-right')
  const group = el.closest('.group')
  group.classList.toggle('collapsed')

  group.querySelectorAll('i').forEach((i) => {
    if (i !== el) {
      i.classList.toggle('hidden')
    }
  })
}
