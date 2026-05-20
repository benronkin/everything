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
 * USAGE: 
      const obj = formatDateParts(starts_at)
      const startDate = `${obj.month}/${obj.day}/${obj.shortYear}`

      const html = [
        createSpan({ html: title }),
        createSpan({ html: `(${startDate})` }),
      ]
 */
export function formatDateParts(isoDateString) {
  const obj = {
    year: 'na',
    month: 'na',
    day: 'na',
  }
  if (isoDateString) {
    const [datePart, _] = isoDateString.split('T')
    const [year, month, day] = datePart.split('-')
    obj.year = year
    obj.shortYear = year.slice(2, 5)
    obj.month = month
    obj.day = day
  }
  return obj
}

/**
 * Create a date string that follows the ISO format
 * but uses the local time instead of server time
 */
export function getLocalDate(date) {
  date = date || new Date()
  const offset = date.getTimezoneOffset() * 60000
  const dateString = new Date(date - offset).toISOString()
  return dateString
}
