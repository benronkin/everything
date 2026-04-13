import { createSelectGroup } from '../../assets/partials/selectGroup.js'
import { injectStyle } from '../js/ui.js'

const css = `
.rating {
  font-size: 1.5rem;
}
.rating option {
  font-size: 1.5rem;
}
`

export function createRating({ id } = {}) {
  injectStyle(css)

  const el = createSelectGroup({
    name: 'rating',
    id,
    classes: {
      group: 'rating mb-40 w-fc p-5-0',
      select: 'field',
      icon: 'fa-face-smile',
    },
    options: [
      { value: '', label: '' },
      { value: 'great', label: '😍' },
      { value: 'good', label: '😀' },
      { value: 'medium', label: '😐' },
      { value: 'bad', label: '🤮' },
    ],
  })

  return el
}
