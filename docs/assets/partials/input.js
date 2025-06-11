import { injectStyle } from '../js/ui.js'
// import { log } from '../js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
input {
  cursor: pointer;
  text-decoration: none;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for a custom input element
 */
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

  return el
}
