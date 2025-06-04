import { injectStyle, isMobile } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
textarea {
  border: none;
  cursor: pointer;
  text-decoration: none;
  padding: 7px 3px;
  min-height: 51px;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createTextarea({
  id = '',
  name = '',
  value = '',
  classes = {
    active: 'u-input-active-primary',
    base: 'u-input-base',
    hover: 'u-input-hover-primary',
  },
} = {}) {
  injectStyle(css)

  const el = document.createElement('textarea')
  el._classes = classes
  el.getClass = getClass.bind(el)
  el.className = el.getClass('base')
  el.resize = resize.bind(el)

  Object.defineProperties(el, {
    hovered: {
      set(v) {
        el.classList.toggle(el.getClass('hover'), v)
      },
    },
    value: {
      get() {
        return el.dataset.value
      },
      set(newValue) {
        el.dataset.value = newValue
        el.resize()
      },
    },
  })

  el.value = value
  el._classes = classes
  el.dataset.id = id
  el.id = id
  el.name = name
  el.dataset.testId = `${id}-textarea` // cypress
  el.addEventListener('mouseenter', () => (el.hovered = true))
  el.addEventListener('mouseleave', () => (el.hovered = false))

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

/**
 * Resize the textarea
 */
export function resize() {
  // First, set the textarea to the default height
  this.style.height = 'auto'
  this.style.height = '0'

  // Get the scroll height of the TA content
  let minHeight = this.scrollHeight

  // If the scroll height is more than the default height, expand TA
  if (minHeight > this.clientHeight) {
    this.style.height = Math.max(minHeight + 5, 51) + 'px'
  }

  if (isMobile()) {
    const height = parseFloat(this.style.height) || 0
    this.style.height = Math.max(height / 2.4, 51) + 'px'
  }
}
