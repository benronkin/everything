import { initDialog } from './modal.js'

// ----------------------
// Globals
// ----------------------

const messageEl = document.querySelector('#message')

// ------------------------
// Exported functions
// ------------------------

/**
 * Set event listeners for top-level UI
 */
export function initUi() {
  initDialog()

  setMessage('Loading...')
}

/**
 * Set message at top of page
 */
export function setMessage(value) {
  messageEl.innerHTML = value
  messageEl.classList.toggle('hidden', !value)
}

/**
 * Detect if mobile device
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
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
    textarea.style.height = minHeight + 'px'
  }
}
