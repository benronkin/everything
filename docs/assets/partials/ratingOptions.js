import { createSpan } from './span.js'

const ratingOptions = [
  { value: '', label: '🫥' },
  { value: 'great', label: '😍' },
  { value: 'good', label: '😀' },
  { value: 'medium', label: '😐' },
  { value: 'bad', label: '🤮' }
]

function getRatingIcon(value) {
  let title
  const option = ratingOptions.find((o) => o.value === value)
  if (value) {
    title = value
  } else {
    title = 'rating missing'
  }
  return createSpan({ html: option.label, title })
}

export { getRatingIcon, ratingOptions }
