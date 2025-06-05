/**
 * Handle content that is string or html elements.
 * Bind this to a DOM element and use as an object method
 */
export function insertHtml(content) {
  this.innerHTML = ''
  if (!content) {
    return
  }
  if (typeof content === 'string') {
    this.innerHTML = content
  } else if (content.outerHTML) {
    this.appendChild(content.cloneNode(true))
  } else if (Array.isArray(content)) {
    content.forEach((c) => {
      if (c.outerHTML) {
        this.appendChild(c.cloneNode(true))
      }
    })
  }
  return
}
