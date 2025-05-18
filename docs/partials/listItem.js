import { injectStyle } from '../js/ui.js'
import { createAnchor } from './anchor.js'
import { createSpan } from './span.js'
import { createInput } from './input.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const html = `
<div class="icons">
  <i class="fa-solid fa-bars hidden"></i>
</div>
`

const css = `
.list-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--card-bg-translucent);
  border: 1px solid var(--gray2);
  border-radius: var(--border-radius);
  padding: 8px 14px;
  margin-bottom: 10px;
  font-weight: 500;
  color: var(--text-default);
  transition: all 0.2s ease-in-out;
}

.list-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transform: translateY(-1px);
}
.list-item .icons {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}
.list-item i {
  color: inherit;
}
.list-item[data-draggable="true"] i.fa-bars {
  display: inline-block !important;
}
.list-item[data-draggable="true"] i:not(.fa-bars) {
  display: none;
}
.list-item[data-selected="true"] i:not(.fa-bars) {
  display: inline-block !important;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Create a custom listItem element
 * (Params for VS Code:)
 */
export function createListItem({
  draggable,
  selected,
  type,
  url,
  value,
  icons,
  classes,
  events,
  id,
} = {}) {
  injectStyle(css)
  return createElement({
    draggable,
    selected,
    type,
    url,
    value,
    icons,
    classes,
    events,
    id,
  })
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Handle click on the item
 */
function handleClick(e) {
  const div = e.target.closest('.list-item')

  if (div.draggable) {
    return
  }

  div.selected = !div.selected

  // notify list of the click
  this.dispatch('list-item-clicked', this.data)
}

/**
 *
 */
function handleMouseEnter(e) {
  const div = e.target.closest('.list-item')
  if (div.selected || div.draggable) {
    return
  }
  div.classList.add(div.getClass('hover'))
}

/**
 *
 */
function handleMouseLeave(e) {
  const div = e.target.closest('.list-item')
  if (div.selected || div.draggable) {
    return
  }
  div.classList.remove(div.getClass('hover'))
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

// -------------------------------
// Constructor
// -------------------------------

/**
 *
 */
function createElement({
  draggable = false,
  selected = false,
  type = 'span',
  value = '',
  url = '',
  icons = [],
  classes = { selected: 'u-selected-primary', hover: 'u-selected-primary' },
  events = {},
  id,
}) {
  const div = document.createElement('div')
  div.className = 'list-item draggable-target'
  div.innerHTML = html
  div._classes = classes

  div.dataset.id = id || crypto.randomUUID()

  const subEl = getSubElement(type, value, url)
  subEl.dataset.sub = 'true'
  div.prepend(subEl)

  for (const iconConfig of icons) {
    const child = createIcon(iconConfig)
    div.querySelector('.icons').appendChild(child)
  }

  div.dispatch = dispatch.bind(div)
  div.getClass = getClass.bind(div)

  Object.defineProperties(div, {
    data: {
      get() {
        return {
          id: div.dataset.id,
          text: div.value,
          selected: div.selected,
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
    value: {
      get() {
        return div.querySelector('[data-sub]').value
      },
      set(newValue) {
        div.querySelector('[data-sub]').value = newValue
      },
    },
    url: {
      get() {
        return div.querySelector('[data-sub]').url
      },
      set(newUrl) {
        div.querySelector('[data-sub]').url = newUrl
      },
    },
  })
  div.selected = selected
  div.draggable = draggable

  div.addEventListener('click', handleClick)
  div.addEventListener('mouseenter', handleMouseEnter)
  div.addEventListener('mouseleave', handleMouseLeave)
  for (const [eventName, cb] of Object.entries(events)) {
    div.addEventListener(eventName, cb)
  }

  return div
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function getSubElement(type, value, url) {
  switch (type) {
    case 'anchor':
      return createAnchor({ html: value, url })
    case 'span':
      return createSpan({ html: value })
    case 'input':
      return createInput({ value })
  }
}
