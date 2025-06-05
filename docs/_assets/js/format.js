/**
 * Handle content that is string or html elements
 */
export function insertHtml(el, content) {
  el.innerHTML = ''
  if (!content) {
    return
  }
  if (typeof content === 'string') {
    el.innerHTML = content
  } else if (content.outerHTML) {
    el.appendChild(content.cloneNode(true))
  } else if (Array.isArray(content)) {
    content.forEach((c) => {
      if (c.outerHTML) {
        el.appendChild(c.cloneNode(true))
      }
    })
  }
  return
}
