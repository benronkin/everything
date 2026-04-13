import { createSelectGroup } from '../../assets/partials/selectGroup.js'
import { ratingOptions } from './ratingOptions.js'
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
    options: ratingOptions,
  })

  return el
}
