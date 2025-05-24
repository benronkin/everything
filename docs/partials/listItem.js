import { injectStyle } from '../js/ui.js'
import { createAnchor } from './anchor.js'
import { createSpan } from './span.js'
import { createInput } from './input.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.list-item {
  align-items: center;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 14px;
  transition: all 0.2s ease-in-out;
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
 * Constructor for a custom listItem element
 */
export function createListItem({
  draggable = false,
  selected = false,
  hidden = false,
  type = 'span',
  value = '',
  url = '',
  icons = [],
  classes = {
    base: 'u-list-base',
    selected: 'u-list-active-primary-bordered',
    hover: 'u-list-hover-primary-bordered',
  },
  events = {},
  id,
} = {}) {
  injectStyle(css)
  const el = document.createElement('div')
  const iconsEl = document.createElement('div')
  iconsEl.className = 'icons'
  el.appendChild(iconsEl)
  const barsEl = createIcon({ className: 'fa-bars hidden' })
  iconsEl.appendChild(barsEl)

  el._classes = classes
  el.dataset.id = id || crypto.randomUUID()

  const subEl = getSubElement(type, value, url)
  subEl.dataset.sub = 'true'
  el.prepend(subEl)

  for (const iconConfig of icons) {
    const child = createIcon(iconConfig)
    el.querySelector('.icons').appendChild(child)
  }

  el.dispatch = dispatch.bind(el)
  el.getClass = getClass.bind(el)
  el.className = `list-item draggable-target ${el.getClass('base')}`

  Object.defineProperties(el, {
    data: {
      get() {
        return {
          id: el.dataset.id,
          text: el.value,
          selected: el.selected,
        }
      },
    },
    draggable: {
      get() {
        return el.dataset.draggable === 'true'
      },
      set(v) {
        el.dataset.draggable = v
        if (v) {
          el.selected = false
          el.setAttribute('draggable', 'true')
        } else {
          el.setAttribute('draggable', 'false')
        }
      },
    },
    hidden: {
      get() {
        return el.dataset.hidden === 'true'
      },
      set(v) {
        el.dataset.hidden = v
        el.classList.toggle('hidden', v)
      },
    },
    hovered: {
      set(v) {
        if (el.selected || el.draggable) {
          return
        }
        el.classList.toggle(el.getClass('hover'), v)
        el.classList.toggle(el.getClass('base'), !v)
      },
    },
    selected: {
      get() {
        return el.dataset.selected === 'true'
      },
      set(v) {
        if (el.draggable) {
          return
        }
        el.dataset.selected = v
        if (v) {
          el.classList.add(el.getClass('selected'))
        } else {
          el.classList.remove(el.getClass('selected'))
        }
      },
    },
    value: {
      get() {
        return el.querySelector('[data-sub]').value
      },
      set(newValue) {
        el.querySelector('[data-sub]').value = newValue
      },
    },
    url: {
      get() {
        return el.querySelector('[data-sub]').url
      },
      set(newUrl) {
        el.querySelector('[data-sub]').url = newUrl
      },
    },
  })
  el.selected = selected
  el.draggable = draggable

  el.addEventListener('click', handleClick)
  el.addEventListener('mouseenter', () => (el.hovered = true))
  el.addEventListener('mouseleave', () => (el.hovered = false))
  for (const [eventName, cb] of Object.entries(events)) {
    el.addEventListener(eventName, cb)
  }

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Handle click on the item
 */
function handleClick(e) {
  const el = e.target.closest('.list-item')

  if (el.draggable) {
    return
  }

  el.selected = !el.selected

  // notify list of the click
  this.dispatch('list-item-clicked', {
    selectedItem: this.closest('.list-item'),
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
