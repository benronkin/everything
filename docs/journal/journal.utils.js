import { formatDateParts } from '../js/format.js'

/**
 * Format an entry title
 */
export function createEntryTitle({ location, visit_date }) {
  const { month, day } = formatDateParts(visit_date)
  const formatted = `(${month}/${day})`

  const el = document.createElement('span')
  let textNode = document.createTextNode(`${location} `)
  el.appendChild(textNode)
  const innerSpan = document.createElement('span')
  innerSpan.className = 'smaller'
  innerSpan.style.fontWeight = '200'
  textNode = document.createTextNode(formatted)
  innerSpan.appendChild(textNode)
  el.appendChild(innerSpan)

  return el
}
