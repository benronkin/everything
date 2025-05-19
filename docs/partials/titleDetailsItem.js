import { injectStyle, resizeTextarea } from '../js/ui.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.td-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #1e1e1e;
  border-radius: var(--border-radius);
  border: 1px solid var(--gray2);
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  padding: 14px 18px;
  color: var(--gray6);
  font-weight: 600;
  cursor: pointer;
}
.td-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.td-item[data-draggable="true"] {
  cursor: move;
}
.td-item input {
  color: inherit;
  cursor: pointer;
  margin: 0;
  width: 90%;
}
.td-item textarea {
  cursor: pointer;
  color: inherit;
  min-height: 25px;
  padding: 7px 3px;
  margin: 0;
}
.td-item .header {
  display: flex;
}
.td-item .details {
  height: fit-content;
  margin-top: 50px;
}
.td-item .icons {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}
.td-item i {
  color: inherit;
}
.td-item[data-draggable="true"] i.fa-bars {
  display: inline-block !important;
}
.td-item[data-draggable="true"] i:not(.fa-bars) {
  display: none;
}
.td-item[data-selected="true"] i:not(.fa-bars) {
  display: inline-block !important;
}
`

const html = `
  <div class="header">
    <input type="text" name="title" />
    <div class="icons">
      <i class="fa-solid fa-bars hidden"></i>
    </div>
  </div>
  <div class="details hidden">
    <textarea name="details"></textarea>
  </div>
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createTitleDetailsItem(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Handle click on the item
 */
function handleClick(div, cb) {
  if (div.draggable) {
    return
  }

  div.selected = !div.selected

  div.querySelector('.details').classList.toggle('hidden', !div.selected)

  // notify list of the click
  div.dispatch('list-item-clicked', div.data)

  cb(div)
}

/**
 *
 */
function handleMouseEnter(e) {
  const div = e.target.closest('.td-item')
  if (div.selected || div.draggable) {
    return
  }
  div.classList.add(div.getClass('hover'))
}

/**
 *
 */
function handleMouseLeave(e) {
  const div = e.target.closest('.td-item')
  if (div.selected || div.draggable) {
    return
  }
  div.classList.remove(div.getClass('hover'))
}

/**
 * When user edits the title
 */
function handleTitleInputChange(e) {
  const div = e.target.closest('.td-item')
  div.dispatch('list-changed', {
    action: 'update-task',
    targetId: div.data.id,
    title: div.data.value,
  })
}

/**
 *
 */
function handleDetailsInputChange(e) {
  const div = e.target.closest('.td-item')
  div.dispatch('list-changed', {
    action: 'update-task',
    targetId: div.data.id,
    details: div.data.value,
  })
}

// -------------------------------
// Object methods
// -------------------------------

/**
 * Dispatch a custom event
 */
function dispatch(eventName, detail = {}) {
  detail.target = this
  detail.dispatcherId = this.dataset.id
  const event = new CustomEvent(eventName, {
    bubbles: true,
    detail,
  })

  this.dispatchEvent(event)
}

/**
 *
 */
function getClass(className) {
  return this._classes[className]
}

/**
 *
 */
function isSelected() {
  return this.dataset.selected === 'true'
}

// -------------------------------
// Constructor
// -------------------------------

/**
 *
 */
function createElement({
  draggable = false,
  selected = false,
  title,
  details,
  icons = [],
  classes = { selected: 'u-selected-primary', hover: 'u-selected-primary' },
  events = {},
  id,
} = {}) {
  const div = document.createElement('div')
  div.className = 'td-item draggable-target'

  div.dataset.id = id || crypto.randomUUID()
  div.innerHTML = html
  div._classes = classes

  for (const iconConfig of icons) {
    const child = createIcon(iconConfig)

    div.querySelector('.icons').appendChild(child)
  }

  div.dispatch = dispatch.bind(div)
  div.getClass = getClass.bind(div)
  div.isSelected = isSelected.bind(div)

  const detailsTA = div.querySelector('[name="details"]')
  detailsTA.value = (details || '').toString().trim()
  resizeTextarea(detailsTA)
  detailsTA.addEventListener('change', handleDetailsInputChange)
  detailsTA.addEventListener('click', (e) => e.stopPropagation())

  Object.defineProperties(div, {
    data: {
      get() {
        return {
          targetId: div.dataset.id,
          selected: div.selected,
          title: div.querySelector('[name="title"]').value.trim(),
          details: div.querySelector('[name="details"]').value.trim(),
        }
      },
    },
    draggable: {
      get() {
        return div.dataset.draggable === 'true'
      },
      set(v) {
        div.dataset.draggable = v
        if (v) {
          div.selected = false
          div.setAttribute('draggable', 'true')
        } else {
          div.setAttribute('draggable', 'false')
        }
      },
    },
    selected: {
      get() {
        return div.dataset.selected === 'true'
      },
      set(v) {
        if (div.draggable) {
          return
        }
        div.dataset.selected = v
        if (v) {
          div.classList.add(div.getClass('selected'))
        } else {
          div.classList.remove(div.getClass('selected'))
        }
      },
    },
    title: {
      get() {
        return div.querySelector('[name="title"]').value
      },
      set(v) {
        div.querySelector('[name="title"]').value = v
      },
    },
  })
  div.selected = selected
  div.draggable = draggable
  div.title = (title || '').toString().trim()

  div.addEventListener('mouseenter', handleMouseEnter)
  div.addEventListener('mouseleave', handleMouseLeave)
  for (const [eventName, cb] of Object.entries(events)) {
    if (eventName === 'click') {
      div.addEventListener('click', () => handleClick(div, cb))
    } else {
      div.addEventListener(eventName, cb)
    }
  }
  const titleInput = div.querySelector('[name="title"]')
  titleInput.addEventListener('change', handleTitleInputChange)

  return div
}
