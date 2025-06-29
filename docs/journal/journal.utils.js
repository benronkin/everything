import { formatDateParts } from '../assets/js/format.js'
import { createDiv } from '../assets/partials/div.js'
import { createSpan } from '../assets/partials/span.js'

/**
 * Format an entry title
 */
export function createEntryTitle({ location, visit_date, rating }) {
  const { month, day } = formatDateParts(visit_date)
  const formatted = `(${month}/${day})`

  const ratings = [
    { value: '', label: '' },
    { value: 'great', label: '🔥' },
    { value: 'medium', label: '🆗' },
    { value: 'bad', label: '🤮' },
  ]
  if (!rating) rating = ''
  const ratingLabel = ratings.find((r) => r.value === rating).label

  const el = createDiv({
    className: 'flex align-center w-100',
    html: [
      createDiv({
        className: 'flex align-center',
        html: [
          createSpan({ html: `${location} ` }),
          createSpan({ html: formatted, className: 'smaller fw-200' }),
        ],
      }),
      createSpan({ html: ratingLabel }),
    ],
  })

  return el
}
