import { state } from '../js/state.js'
import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createTextarea } from './textarea.js'

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
`

export function createTitleDetailsItem({
  title,
  details,
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
    className: 'field',
  })
  titleEl.dataset.target = 'title'
  gridEl.appendChild(titleEl)
  titleEl.resize()

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

  gridEl = createDiv({ className: 'grid details-wrapper hidden' })
  el.appendChild(gridEl)

  const detailsEl = createTextarea({
    name: 'details',
    className: 'field',
    placeholder: 'Add details...',
  })
  detailsEl.dataset.target = 'details'
  gridEl.appendChild(detailsEl)
  iconsEl = createDiv({ className: 'icons' })
  gridEl.appendChild(iconsEl)

  const trashEl = createIcon({
    classes: {
      primary: 'fa-trash',
    },
  })
  iconsEl.appendChild(trashEl)
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
