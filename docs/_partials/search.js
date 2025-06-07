import { createFormHorizontal } from './formHorizontal.js'
import { injectStyle } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createSearch({ id, className, value } = {}) {
  injectStyle(css)

  const el = createFormHorizontal({
    inputType: 'search',
    inputName: 'search',
    placeholder,
    formIconClass: iconClass,
  })

  el.appendChild(searchForm)

  value && (el.value = value)
  id && (el.dataId = id)
  className && (el.classes = className)

  return el
}
