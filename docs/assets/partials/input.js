import { injectStyle } from '../js/ui.js'
import { debounce } from '../js/utils.js'
import { state } from '../js/state.js'

const css = `
input {
  cursor: pointer;
  text-decoration: none;
}
`

export function createInput({
  id,
  className,
  accept,
  type = 'text',
  name,
  value,
  maxLength,
  placeholder = '',
  autocomplete = true,
} = {}) {
  injectStyle(css)

  const el = document.createElement('input')

  if (id) {
    el.id = id
    el.dataset.id = id
  }

  el.type = type
  className && (el.className = className)
  value && (el.value = value)
  maxLength && (el.maxlength = maxLength)
  accept && (el.accept = accept)
  name && (el.name = name)
  placeholder && (el.placeholder = placeholder)
  if (!autocomplete) {
    autocomplete = 'off'
  }

  el.autocomplete = autocomplete

  listen(el)

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

    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key))
      return

    if (e.key === 'Enter') {
      state.set('field-changed', e.target)
    } else {
      debouncedUpdate(e.target)
    }
  })

  el.addEventListener('change', (e) => {
    state.set('field-changed', e.target)
  })

  el.addEventListener('paste', (e) => {
    state.set('field-changed', e.target)
  })
}

const debouncedUpdate = debounce((el) => {
  state.set('field-changed', el)
}, 1500)
