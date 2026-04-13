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
      handleChange(e.target)
    }
  })

  el.addEventListener('keyup', (e) => {
    e.preventDefault()

    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key))
      return

    if (e.key === 'Enter') {
      handleChange(e.target)
    } else {
      debouncedUpdate(e.target)
    }
  })

  el.addEventListener('change', (e) => {
    handleChange(e.target)
  })

  el.addEventListener('paste', (e) => {
    handleChange(e.target)
  })
}

const debouncedUpdate = debounce((el) => {
  handleChange(el)
}, 1500)

function handleChange(el) {
  if (el.dataset.oldValue === el.value.trim()) return

  el.dataset.oldValue = el.value.trim()
  state.set('field-changed', el)
}
