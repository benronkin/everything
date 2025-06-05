import { injectStyle } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
input {
  cursor: pointer;
  text-decoration: none;
  padding: 7px 3px;
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
  autocomplete && (el.autocomplete = autocomplete)

  return el
}
