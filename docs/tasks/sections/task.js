import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { createStep } from './step.js'
import { createDueDate, toggleDueDateElements } from './dueDate.js'

const css = `
.td-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 20px;
  cursor: pointer;
  padding: 0;
  border: 1px solid var(--gray0);
  border-radius: var(--border-radius);
}
.td-item .title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.td-item .title-wrapper i,
.td-item .title-wrapper .due-label {
  margin-left: 10px;
}
.td-item textarea {
  padding: 10px 10px 0 10px;
  margin: 1px;
  flex-grow: 1;            /* 👈 The Magic: Tells it to take all available space */
  width: 0;                /* 👈 The Secret: Prevents the textarea from pushing the container wide */
}
.td-item .details-ta {
  width: 100%;
}

.td-item .icons {
  padding: 15px 10px;  
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: flex-end;
}
.add-step {
  width: 90%;
  border: none;
}
.add-step-wrapper {
  margin-left: 5px;
}
.add-step-wrapper .fa-plus {
  margin-left: 5px;
}
.fa-trash {
  margin: 10px;
}
.list-item:hover {
  color: inherit;
}
.due-date-badge {
  padding: 5px;
}
`

export function createTask({
  title,
  details,
  steps,
  startAt,
  id,
  dueInfo,
  className = '',
} = {}) {
  injectStyle(css)

  const el = createDiv({
    id,
    className: `td-item list-item ${className}`.trim(),
  })

  build(el, dueInfo)
  react(el)
  listen(el)

  let ta = el.querySelector('.title-ta')
  ta.value = (title || '').toString().trim()

  el.querySelector('.details-ta').value = (details || '').toString().trim()

  if (steps?.length) {
    for (const step of steps) {
      const stepDiv = createStep(step)
      el.querySelector('.steps-wrapper').appendChild(stepDiv)
    }
  }

  el.querySelector('.add-step').placeholder = steps?.length
    ? 'Next step'
    : 'Add step'

  if (startAt) {
    const dateObj = new Date(startAt)
    const [datePart, fullTimePart] = dateObj.toISOString().split('T')
    const timePart = fullTimePart.substring(0, 5)

    el.querySelector('.due-date').value = datePart
    el.querySelector('.due-time').value = timePart
    toggleDueDateElements(el)
  }

  el.classList.add('draggable-target')
  el.setDraggable = setDraggable.bind(el)

  return el
}

function build(el, dueInfo) {
  let titleWrapper = createDiv({ className: 'title-wrapper' })
  el.appendChild(titleWrapper)

  if (dueInfo) {
    titleWrapper.appendChild(createDiv({ html: dueInfo }))
  }

  const titleEl = createTextarea({
    className: 'title-ta',
    name: 'title',
    placeholder: 'Task...',
  })
  titleWrapper.appendChild(titleEl)

  let iconsEl = createDiv({ className: 'icons' })
  titleWrapper.appendChild(iconsEl)

  iconsEl.appendChild(
    createIcon({
      classes: {
        primary: 'fa-chevron-left',
        secondary: 'fa-chevron-down',
        other: ['expander'],
      },
    }),
  )
  iconsEl.appendChild(
    createIcon({
      classes: { primary: 'fa-sort', other: ['sorter', 'hidden'] },
    }),
  )

  const detailsWrapperEl = createDiv({ className: 'details-wrapper hidden' })
  el.appendChild(detailsWrapperEl)

  detailsWrapperEl.appendChild(createDiv({ className: 'steps-wrapper' }))

  detailsWrapperEl.appendChild(
    createInputGroup({
      classes: {
        group: 'add-step-wrapper',
        input: 'add-step',
        icon: 'fa-plus',
      },
    }),
  )

  detailsWrapperEl.appendChild(createDueDate())

  const detailsEl = createTextarea({
    name: 'details',
    className: 'details-ta',
    placeholder: 'Additional information...',
  })
  detailsWrapperEl.appendChild(detailsEl)

  const trashEl = createIcon({
    classes: {
      primary: 'fa-trash',
    },
  })
  detailsWrapperEl.appendChild(trashEl)

  trashEl.addEventListener('click', () => {
    state.set('task-deleted:tasks-list', { id: el.id })
  })
}

function react(el) {
  state.on('icon-click:sort-icon', 'titleDetailsItem', () => {
    const isSorting = document
      .getElementById('sort-icon')
      .classList.contains('primary')

    el.setDraggable(isSorting)
  })
}

function listen(el) {
  el.querySelector('.expander').addEventListener('click', (e) => {
    el.querySelector('.details-wrapper').classList.toggle(
      'hidden',
      e.target.classList.contains('fa-chevron-left'),
    )
    document.querySelector('[name="details"]').resize()
  })

  el.querySelector('.add-step').addEventListener('change', (e) => {
    e.preventDefault()
    const caption = e.target.value.trim()
    if (!caption.length) return

    const parent = e.target.closest('.td-item')

    state.set('step-added', { taskId: parent.id, caption })
  })
}

function setDraggable(isDraggable) {
  this.draggable = isDraggable

  if (isDraggable) {
    this.querySelector('textarea').style.cursor = 'not-allowed'
    this.querySelector('.sorter').style.cursor = 'move'
  }

  this.querySelector('.sorter').classList.toggle('hidden', !isDraggable)
  this.querySelector('.expander').classList.toggle('hidden', isDraggable)
}
