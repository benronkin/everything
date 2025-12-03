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
  const obj = {
    year: 'na',
    month: 'na',
    day: 'na',
  }
  if (isoDateString) {
    const [datePart, _] = isoDateString.split('T')
    const [year, month, day] = datePart.split('-')
    obj.year = year
    obj.month = month
    obj.day = day
  }
  return obj
}

/**
 * Export an iso date/time to strings that
 * can be fed into input elements
 */
export function toLocalDateTimeStrings(iso) {
  const d = new Date(iso)
  const pad = (n) => n.toString().padStart(2, '0')

  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())

  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())

  return {
    date: `${year}-${month}-${day}`, // for <input type="date">
    time: `${hours}:${minutes}`, // for <input type="time">
  }
}
