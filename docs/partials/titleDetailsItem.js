import { injectStyle, resizeTextarea } from '../js/ui.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.td-item {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 12px;
  padding: 5px 18px;
  cursor: pointer;
}
.td-item[data-draggable="true"] {
  cursor: move;
}
.td-item [data-target="expander"] {
  position: absolute;
  top: -27px;
  right: 0;
}
.td-item input {
  color: inherit;
  cursor: pointer;
  margin: 0;
  padding: 5px;
  width: 90%;
}
.td-item textarea {
  cursor: pointer;
  color: inherit;
  min-height: 35px;
  padding: 7px 3px;
  margin: 0;
}
.td-item .header {
color: inherit;
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
.td-item i[data-target] {
  color: var(--purple0)
}
.td-item[data-draggable="true"] i.fa-bars {
  display: inline-block !important;
}
.td-item[data-draggable="true"] i:not(.fa-bars) {
  display: none;
}
.td-item.u-active-primary {
  color: var(--purple3);
  border-color: var(--purple3);
}
`

const html = `
  <i class="fa-solid fa-chevron-left" data-target="expander"></i>
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
 * Constructor
 */
export function createTitleDetailsItem({
  draggable = false,
  selected = false,
  expanded = false,
  title,
  details,
  icons = [],
  classes = {
    base: 'u-td-base',
    active: 'u-td-active-primary-bordered',
    hover: 'u-td-hover-primary-bordered',
  },
  events = {},
  id,
} = {}) {
  injectStyle(css)

  const div = document.createElement('div')

  div.dataset.id = id || crypto.randomUUID()
  div.innerHTML = html
  div._classes = classes

  for (const iconConfig of icons) {
    const child = createIcon(iconConfig)

    div.querySelector('.icons').appendChild(child)
  }

  div.dispatch = dispatch.bind(div)
  div.getClass = getClass.bind(div)
  div.className = `td-item draggable-target ${div.getClass('base')}`

  const detailsTA = div.querySelector('[name="details"]')
  detailsTA.value = (details || '').toString().trim()
  resizeTextarea(detailsTA)
  detailsTA.addEventListener('change', handleDetailsInputChange)

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
    expanded: {
      get() {
        return div.dataset.expanded === 'true'
      },
      set(v) {
        if (div.draggable) {
          return
        }
        div.dataset.expanded = v
        // no DOM in vitest hence ?.
        div.querySelector('.details')?.classList.toggle('hidden', !v)
        div.querySelector('.fa-trash')?.classList.toggle('hidden', !v)
        div
          .querySelector('[data-target="expander"]')
          .classList.toggle('fa-chevron-down', v)
        div
          .querySelector('[data-target="expander"]')
          .classList.toggle('fa-chevron-left', !v)
      },
    },
    hovered: {
      set(v) {
        if (div.sdivected || div.draggable) {
          return
        }
        div.classList.toggle(div.getClass('hover'), v)
        div.classList.toggle(div.getClass('base'), !v)
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
          div.classList.add(div.getClass('active'))
        } else {
          div.classList.remove(div.getClass('active'))
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
  div.expanded = expanded
  div.selected = selected
  div.draggable = draggable
  div.title = (title || '').toString().trim()

  div.addEventListener('mouseenter', () => (div.hovered = true))
  div.addEventListener('mouseleave', () => (div.hovered = false))
  for (const [eventName, cb] of Object.entries(events)) {
    if (eventName === 'click') {
      div.addEventListener('click', (e) => handleClick(e, div, cb))
    } else {
      div.addEventListener(eventName, cb)
    }
  }
  div
    .querySelector('[name="title"]')
    .addEventListener('change', handleTitleInputChange)

  return div
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Handle click on the item
 */
function handleClick(e, div, cb) {
  if (div.draggable) {
    return
  }

  if (e.target.closest('input') || e.target.closest('textarea')) {
    div.selected = true
    div.expanded = true
  } else {
    div.selected = !div.selected
    div.expanded = !div.expanded
  }

  // notify list of the click
  div.dispatch('list-item-clicked', { selectedItem: div.closest('.td-item') })

  cb(div)
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
