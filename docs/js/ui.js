// ----------------------
// Globals
// ----------------------

const messageEl = document.querySelector('#message')
let sharedStyleEl = null

// ------------------------
// Exported functions
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
 * Log in debug
 */
export function log(...args) {
  if (localStorage.getItem('debugMode') === 'true') {
    console.log(...args)
  }
}

/**
 * Resize the textarea
 */
export function resizeTextarea(textarea) {
  // First, set the textarea to the default height
  textarea.style.height = 'auto'
  textarea.style.height = '0'

  // Get the scroll height of the textarea content
  let minHeight = textarea.scrollHeight

  // If the scroll height is more than the default height, expand the textarea
  if (minHeight > textarea.clientHeight) {
    textarea.style.height = minHeight + 5 + 'px'
  }

  if (isMobile()) {
    const height = parseFloat(textarea.style.height) || 0
    textarea.style.height = height / 2.4 + 'px'
  }
}

/**
 * Set message at top of page
 */
export function setMessage(value, timeout) {
  messageEl.innerHTML = value
  messageEl.classList.toggle('hidden', !value)

  if (timeout) {
    setTimeout(() => {
      messageEl.style.animation = 'fadeOutSlideUp 300ms ease-out'
      setTimeout(() => {
        messageEl.innerHTML = ''
        messageEl.classList.add('hidden')
        messageEl.style.animation = '' // reset so future fadeInSlideDown can fire again
      }, 300)
    }, timeout)
  }
}

/**
 * Toggle the expander's button group
 */
export function toggleExpander(e) {
  // arrives from eventhandler or from a link click
  const el = e.target || e
  el.classList.toggle('fa-chevron-left')
  el.classList.toggle('fa-chevron-right')
  const group = el.closest('.i-group')
  group.classList.toggle('collapsed')

  group.querySelectorAll('i').forEach((i) => {
    if (i !== el) {
      i.classList.toggle('hidden')
    }
  })
}
