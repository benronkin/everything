import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createDateTime } from '../../assets/partials/dateTime.js'
import { createInput } from '../../assets/partials/input.js'
import { createSpan } from '../../assets/partials/span.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createIcon } from '../../assets/partials/icon.js'

const css = `
#due-date-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#add-due-date-wrapper {
  width: 100%;
}
#due-fields {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 6px 0;
}
`

export function createDueDate() {
  injectStyle(css)

  const el = createDiv({
    id: 'due-date-wrapper',
  })

  build(el)
  listen(el)

  return el
}

/**
 *
 */
export function toggleDueDateElements(el) {
  el.querySelector('#add-due-date-wrapper').classList.toggle('hidden')
  el.querySelector('#due-fields').classList.toggle('hidden')
}

/**
 *
 */
function build(el) {
  el.appendChild(
    createDiv({
      id: 'add-due-date-wrapper',
      html: createSpanGroup({
        classes: { icon: 'fa-calendar' },
        html: 'Add due date',
      }),
    }),
  )

  el.appendChild(
    createDiv({
      id: 'due-fields',
      className: 'hidden',
      html: [
        createSpan({ html: 'Due:' }),
        createDateTime({ name: 'starts_at' }),
        // createInput({
        //   id: 'due-date',
        //   name: 'due-date',
        //   type: 'date',
        // }),
        // createInput({
        //   id: 'due-time',
        //   name: 'due-time',
        //   type: 'time',
        // }),
        createIcon({
          id: 'cancel-due-date',
          classes: { primary: 'fa-close' },
        }),
      ],
    }),
  )
}

/**
 *
 */
function listen(el) {
  el.querySelector('#add-due-date-wrapper').addEventListener('click', () => {
    toggleDueDateElements(el)
  })

  el.querySelector('#cancel-due-date').addEventListener('click', () => {
    el.querySelector('.starts_at').value = ''
    toggleDueDateElements(el)
  })
}
