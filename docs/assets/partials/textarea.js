import { injectStyle } from '../js/ui.js'
import { state } from '../js/state.js'
import { debounce } from '../js/utils.js'

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

export function createTextarea({ id, name, value, className, placeholder }) {
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
  value && el.setValue(value)
  name && (el.name = name)
  placeholder && (el.placeholder = placeholder)

  return el
}

function listen(el) {
  el.addEventListener('keydown', (e) => {
    if (e.metaKey && e.key === 's') {
      e.preventDefault()
      state.set('field-changed', e.target)
    }
  })

  el.addEventListener('keyup', (e) => {
    e.preventDefault()
    if (e.key === 'Enter') {
      el.resize()
      state.set('field-changed', e.target)
    } else {
      debouncedUpdate(e.target)
    }
  })

  el.addEventListener('change', (e) => {
    requestAnimationFrame(() => {
      // let value be set, then:
      el.resize()
      state.set('field-changed', e.target)
    })
  })

  el.addEventListener('paste', (e) => {
    requestAnimationFrame(() => {
      // let value be set, then:
      el.resize()
      state.set('field-changed', e.target)
    })
  })
}

function resize() {
  const { scrollTop } = document.documentElement // or window.pageYOffset

  this.style.height = 'auto'
  this.style.height = 25 + this.scrollHeight + 'px'
  document.documentElement.scrollTop = scrollTop
  // console.log('resized to', this.style.height)
}

function setValue(value = '') {
  this.value = value
  requestAnimationFrame(() => {
    // let value be set, then:
    this.resize()
  })
}

const debouncedUpdate = debounce((el) => {
  state.set('field-changed', el)
}, 1500)
