import { injectStyle } from '../js/ui.js'

const css = `
`

/**
 *
 */
export function createVideo({ id, className, src } = {}) {
  injectStyle(css)

  const el = document.createElement('video')

  el.controls = true
  el.playsInline = true
  el.preload = 'auto'

  id && (el.id = id)
  className && (el.className = className)
  src && (el.src = src)

  return el
}
