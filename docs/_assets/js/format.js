import { createSpan } from '../../_partials/span.js'
/**
 * Handle content that is string or html elements.
 * Bind this to a DOM element and use as an object method
 */
export function insertHtml(content) {
  this.innerHTML = ''

  if (!content) return

  if (typeof content === 'string') {
    this.innerHTML = content
    return
  }

  if (content.outerHTML) {
    this.appendChild(content)
    return
  }

  if (Array.isArray(content)) {
    content.forEach((c) => {
      if (typeof c === 'string') {
        const span = createSpan({ html: c })
        this.appendChild(span)
      } else if (c.outerHTML) {
        this.appendChild(c)
      }
    })
  }
}
