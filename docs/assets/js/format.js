import { createSpan } from '../../assets/partials/span.js'
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

/**
 * Convert a UTC date in ISO format to date/time
 * parts in local time
 */
export function formatDateParts(isoDateString) {
  const dateObj = new Date(isoDateString)

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate(),
    hour: dateObj.getHours(),
    minute: dateObj.getMinutes(),
    second: dateObj.getSeconds(),
  }
}
