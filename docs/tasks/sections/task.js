import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createInput } from '../../assets/partials/input.js'
import { createSpan } from '../../assets/partials/span.js'
import { createTextarea } from '../../assets/partials/textarea.js'

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
.td-item .grid {
  display: grid;
  grid-template-columns: 1fr auto;
}
.td-item textarea {
  padding: 10px 10px 0 10px;
  margin: 1px;
}
.td-item [data-target="details"] {
  margin-top: 20px;
  width: 100%;
}
.td-item .icons {
  padding: 15px 10px;  
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: flex-end;
}
.date-time-wrapper {
  display: flex;
  align-items: center;
  margin: 0 10px;
}
.date-time-wrapper span {
  margin-right: auto;
}
.date-time-wrapper input:last-child {
  margin-left: 20px;
}
`

export function createTask({
  title,
  details,
  starts_at,
  ends_at,
  id,
  className = '',
} = {}) {
  injectStyle(css)

  const el = createDiv({
    id,
    className: `td-item list-item ${className}`.trim(),
  })

  build(el)
  react(el)
  listen(el)

  let ta = el.querySelector('[data-target="title"]')
  ta.value = (title || '').toString().trim()

  el.querySelector('[name="details"]').value = (details || '').toString().trim()

  el.classList.add('draggable-target')
  el.setDraggable = setDraggable.bind(el)

  return el
}

function build(el) {
  let gridEl = createDiv({ className: 'grid title-wrapper' })
  el.appendChild(gridEl)

  const titleEl = createTextarea({
    name: 'title',
    placeholder: 'Task...',
  })
  titleEl.dataset.target = 'title'
  gridEl.appendChild(titleEl)

  let iconsEl = createDiv({ className: 'icons' })
  gridEl.appendChild(iconsEl)

  iconsEl.appendChild(
    createIcon({
      classes: {
        primary: 'fa-chevron-left',
        secondary: 'fa-chevron-down',
        other: ['expander'],
      },
    })
  )
  iconsEl.appendChild(
    createIcon({ classes: { primary: 'fa-sort', other: ['sorter', 'hidden'] } })
  )

  const detailsWrapperEl = createDiv({ className: 'details-wrapper hidden' })
  el.appendChild(detailsWrapperEl)

  const detailsHeader = createDiv({ className: 'flex align-center' })
  detailsWrapperEl.appendChild(detailsHeader)

  const detailsEl = createTextarea({
    name: 'details',
    placeholder: 'Add details...',
  })
  detailsEl.dataset.target = 'details'
  detailsHeader.appendChild(detailsEl)
  iconsEl = createDiv({ className: 'icons' })
  detailsHeader.appendChild(iconsEl)

  const trashEl = createIcon({
    classes: {
      primary: 'fa-trash',
    },
  })
  iconsEl.appendChild(trashEl)

  detailsWrapperEl.appendChild(
    createDiv({
      className: 'date-time-wrapper',
      html: [
        createSpan({ html: 'Starts' }),
        createInput({
          name: 'start_date',
          type: 'date',
        }),
        createInput({
          name: 'start_time',
          type: 'time',
        }),
      ],
    })
  )

  detailsWrapperEl.appendChild(
    createDiv({
      className: 'date-time-wrapper',
      html: [
        createSpan({ html: 'Ends' }),
        createInput({
          name: 'end_date',
          type: 'date',
        }),
        createInput({
          name: 'end_time',
          type: 'time',
        }),
      ],
    })
  )

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
      e.target.classList.contains('fa-chevron-left')
    )
    document.querySelector('[name="details"]').resize()
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
