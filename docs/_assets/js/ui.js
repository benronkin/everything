import { createIcon } from '../../_partials/icon.js'
import { createSpan } from '../../_partials/span.js'
import { createToast, removeToasts } from '../../_partials/toast.js'

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
 * Log in debug
 */
export function log(...args) {
  if (localStorage.getItem('debug') !== 'true') return

  const typeColor = {
    string: '\x1b[95m', // bright magenta (pink)
    object: '\x1b[34m', // blue
    boolean: '\x1b[36m', // cyan
    number: '\x1b[96m', // bright cyan (light blue)
    function: '\x1b[31m', // red
    undefined: '\x1b[33m', // yellow
  }

  const reset = '\x1b[0m'

  const formatted = args
    .map((arg) => {
      const type = typeof arg
      const color = typeColor[type] || '\x1b[31m' // red for unknown
      let value
      if (type === 'object' && arg !== null) {
        try {
          value = JSON.stringify(arg)
        } catch {
          value = '[object]'
        }
      } else {
        value = String(arg)
      }
      return `${color}${value}${reset}`
    })
    .join(', ')

  console.log(`\x1b[35m* DEBUG:\x1b[0m ${formatted}`)
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
  type = 'message',
  autoClose = 3000,
  position = 'BOTTOM_RIGHT',
} = {}) {
  if (!message) {
    // user wishes to clear all toasts
    removeToasts()
    return
  }

  let value = message
  let className = null

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
      value = _createWarnMessage(message)
      className = 'u-danger'
      position = 'TOP_RIGHT'
      autoClose = null
      break
    case 'warn':
      value = _createWarnMessage(message)
      className = 'u-warn'
      position = 'TOP_RIGHT'
      break
  }

  const toast = createToast({
    value,
    className,
    autoClose,
    showProgress: true,
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
