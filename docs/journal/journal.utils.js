import { formatDateParts } from '../assets/js/format.js'
import { createDiv } from '../assets/partials/div.js'
import { createSpan } from '../assets/partials/span.js'
import { ratingOptions } from '../assets/partials/ratingOptions.js'

/**
 * Format an entry title
 */
export function createEntryTitle({ location, visit_date, rating }) {
  const { month, day } = formatDateParts(visit_date)
  const formatted = `(${month}/${day})`

  if (!rating) rating = ''
  const ratingLabel = ratingOptions.find((r) => r.value === rating).label

  const el = createDiv({
    className: 'flex align-center w-100',
    html: [
      createDiv({
        html: `${location} <span class="smaller fw-200 p-0">${formatted}</span>`,
      }),
      createSpan({ html: ratingLabel }),
    ],
  })

  return el
}
