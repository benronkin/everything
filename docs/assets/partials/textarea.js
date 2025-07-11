import { injectStyle, isMobile } from '../js/ui.js'
import { log } from '../js/logger.js'

const css = `
textarea {
  border: none;
  text-decoration: none;
  border-radius: var(--border-radius);
  min-height: 1.2em;
  line-height: 1.2em;
  resize: none;
}
`

export function createTextarea({
  id,
  name,
  value,
  className,
  placeholder,
} = {}) {
  injectStyle(css)

  const el = document.createElement('textarea')

  el.setValue = setValue.bind(el)
  el.resize = resize.bind(el)

  listen(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }
  className && (el.className = className)
  value && (el.value = value)
  name && (el.name = name)
  placeholder && (el.placeholder = placeholder)

  return el
}

function listen(el) {
  el.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      el.resize()
    }
  })
  el.addEventListener('change', () => {
    console.log('i changed', el.id)
    el.resize()
  })
  el.addEventListener('paste', () => {
    el.resize()
  })
}

function resize() {
  const { scrollTop } = document.documentElement // or window.pageYOffset
  this.style.height = 'auto'
  this.style.height = 25 + this.scrollHeight + 'px'
  document.documentElement.scrollTop = scrollTop
  console.log('resized to', this.style.height)
}

function setValue(value = '') {
  this.value = value
  this.resize()
}
