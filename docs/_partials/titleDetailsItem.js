import { newState } from '../_assets/js/newState.js'
import { injectStyle } from '../_assets/js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createTextarea } from './textarea.js'
import { log } from '../_assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

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
.td-item.draggable-target {
  cursor: move;
}
.td-item .grid {
  display: grid;
  grid-template-columns: 1fr auto;
}
.td-item textarea {
  min-height: 1.2em;
  line-height: 1.2em;
  overflow-y: hidden; /* prevent scrollbars */
  resize: none;
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

// -------------------------------
// Exports
// -------------------------------

/**
 * Constructor
 */
export function createTitleDetailsItem({
  draggable = false,
  title,
  details,
  id,
  className = '',
} = {}) {
  injectStyle(css)

  const el = createDiv({ id, className: `td-item ${className}`.trim() })

  build(el)
  react(el)
  listen(el)

  el.setDraggable = setDraggable.bind(el)

  let ta = el.querySelector('[data-target="title"]')
  ta.value = (title || '').toString().trim()

  el.querySelector('[name="details"]').value = (details || '').toString().trim()

  el.setDraggable(draggable)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function build(el) {
  let gridEl = createDiv({ className: 'grid' })
  el.appendChild(gridEl)

  const titleEl = createTextarea({
    name: 'title',
    placeholder: 'Task...',
    className: 'field',
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

  gridEl = createDiv({ className: 'grid' })
  el.appendChild(gridEl)

  const taEl = createTextarea({
    name: 'details',
    className: 'hidden field',
    placeholder: 'Add details...',
  })
  taEl.dataset.target = 'details'
  gridEl.appendChild(taEl)
  iconsEl = createDiv({ className: 'icons' })
  gridEl.appendChild(iconsEl)

  const trashEl = createIcon({
    classes: {
      primary: 'fa-trash',
      other: ['hidden'],
    },
  })
  iconsEl.appendChild(trashEl)
  trashEl.addEventListener('click', () => {
    newState.set('task-deleted:tasks-list', { id: el.id })
  })
}

/**
 *
 */
function react(el) {
  newState.on('icon-click:sort-icon', 'titleDetailsItem', () => {
    const isSorting = document
      .getElementById('sort-icon')
      .classList.contains('primary')
    el.setDraggable(isSorting)
  })
}

/**
 *
 */
function listen(el) {
  el.querySelector('.expander').addEventListener('click', (e) => {
    el.querySelector('[data-target="details"]').classList.toggle(
      'hidden',
      e.target.classList.contains('fa-chevron-left')
    )
    el.querySelector('.fa-trash').classList.toggle(
      'hidden',
      e.target.classList.contains('fa-chevron-left')
    )
  })
}

// -------------------------------
// Object methods
// -------------------------------

/**
 *
 */
function setDraggable(isDraggable) {
  this.classList.toggle('draggable-target', isDraggable)
  this.querySelector('.sorter').classList.toggle('hidden', !isDraggable)
  this.querySelector('.expander').classList.toggle('hidden', isDraggable)
}
