import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { createInput } from '../../assets/partials/input.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createHeader } from '../../assets/partials/header.js'

const css = `
#due-date-wrapper {
  margin: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.due-fields {
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

export function toggleDueDateElements(el) {
  const classes = [
    'add-due-date',
    'due-header',
    'due-date',
    'due-time',
    'cancel-due-date',
  ]

  classes.forEach((c) => el.querySelector(`.${c}`).classList.toggle('hidden'))
}

function build(el) {
  const dueDateSpan = createSpanGroup({
    classes: { group: 'add-due-date', icon: 'fa-calendar' },
    html: 'Add due date',
  })
  el.appendChild(dueDateSpan)

  const dueFields = createDiv({ className: 'due-fields' })
  el.appendChild(dueFields)

  dueFields.appendChild(
    createHeader({
      type: 'h5',
      html: 'Due:',
      className: 'due-header hidden',
    }),
  )
  dueFields.appendChild(
    createInput({
      name: 'due-date',
      type: 'date',
      className: 'due-date hidden',
    }),
  )
  dueFields.appendChild(
    createInput({
      name: 'due-time',
      type: 'time',
      className: 'due-time hidden',
    }),
  )

  el.appendChild(
    createIcon({
      classes: { primary: 'fa-close', other: ['cancel-due-date', 'hidden'] },
    }),
  )
}

function listen(el) {
  el.querySelector('.add-due-date').addEventListener('click', () =>
    toggleDueDateElements(el),
  )

  el.querySelector('.cancel-due-date').addEventListener('click', () => {
    el.querySelector('.due-date').value = ''
    el.querySelector('.due-time').value = ''
    toggleDueDateElements(el)
  })
}
