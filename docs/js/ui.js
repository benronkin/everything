// ----------------------
// Globals
// ----------------------

const messageEl = getEl('message')
let sharedStyleEl = null

// ------------------------
// Exported functions
// ------------------------

/**
 * Get an element using its data-id attribute
 */
export function getEl(id) {
  const el = document.querySelector(`[data-id="${id}"]`)
  if (!el) {
    console.warn(`Unable to locate element with data-id="${id}"`)
    return null
  }

  if (!el._enhanced) {
    el.toggleClass = function (className) {
      el.classList.toggle(className)
      return el // for chainng
    }

    Object.defineProperties(el, {
      hidden: {
        get() {
          return el.classList.contains('hidden')
        },
        set(v) {
          el.classList.toggle('hidden', v)
        },
      },
    })
    el._enhanced = true // prevent redefining every time
  }

  if (!('value' in el)) {
    // Fallback for dealing with elements that
    // lack native or my custom value method
    Object.defineProperty(el, 'value', {
      get() {
        return el.innerHTML
      },
      set(newValue) {
        el.innerHTML = newValue
      },
    })
  }

  return el
}

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
    const height = parseFloat(minHeight) || 52
    textarea.style.height = height + 5 + 'px'
    if (isMobile()) {
      textarea.style.height = height / 1.5 + 'px'
    }
  }
}

/**
 * Set message at top of page
 */
export function setMessage(value, timeout) {
  messageEl.innerHTML = value
  messageEl.classList.toggle('hidden', !value)

  messageEl.style.animation = 'fadeInSlideDown 300ms ease-out'

  if (timeout) {
    setTimeout(() => {
      messageEl.style.animation = 'fadeOutSlideUp 300ms ease-in'
      setTimeout(() => {
        messageEl.classList.add('hidden')
        messageEl.innerHTML = ''
        messageEl.style.animation = ''
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
