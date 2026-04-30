import { createSelect } from './select.js'
import { createSelectGroup } from './selectGroup.js'
import { createDiv } from './div.js'
import { createSpan } from './span.js'
import { injectStyle } from '../js/ui.js'

const css = `
select {
  font-size: 1.5rem;
}
select option {
  font-size: 1.5rem;
}
.users-select {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
}
`

export function createUserSelect({ id, name, caption, value, options } = {}) {
  injectStyle(css)

  let el

  if (caption) {
    el = createDiv({
      className: 'users-select',
      html: [
        createSpan({ html: caption }),
        createSelect({ id, name, value, options }),
      ],
    })
  } else {
    el = createSelectGroup({
      name,
      id,
      classes: {
        group: 'mb-40 w-fc p-5-0',
        select: 'field',
        icon: 'fa-person',
      },
      options,
    })
  }

  return el
}
