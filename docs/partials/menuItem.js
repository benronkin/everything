/* 
 This module creates a geneeric menu item that can include a span, 
 or as in rightDrawer an anchor. So you need to pass a type that 
 tells the item what sub-partial to insert.
 */

import { injectStyle } from '../js/ui.js'
import { createAnchor } from './anchor.js'
import { createSpan } from './span.js'
import { createInput } from './input.js'
import { createIcon } from './icon.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.menu-item {
  align-items: center;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  margin-bottom: 4px;
  padding: 4px 14px;
  transition: all 0.2s ease-in-out;
}
.menu-item .icons {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}
.menu-item i {
  color: inherit;
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for a custom menuItem element
 */
export function createMenuItem({
  selected = false,
  hidden = false,
  type = 'span',
  value = '',
  url = '',
  icons = [],
  classes = {
    active: 'u-menu-active-primary',
    base: 'u-menu-base',
    hover: 'u-menu-hover-primary',
  },
  events = {},
  id,
} = {}) {
  injectStyle(css)
  const el = document.createElement('div')
  const iconsEl = document.createElement('div')
  iconsEl.className = 'icons'
  el.appendChild(iconsEl)

  const subEl = getSubElement(type, value, url)
  subEl.dataset.sub = 'true'
  el.prepend(subEl)

  for (const iconConfig of icons) {
    const child = createIcon(iconConfig)
    el.querySelector('.icons').appendChild(child)
  }

  el.getClass = getClass.bind(el)

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
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = `${id}-span`
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
        el.classList.toggle(el.getClass('hover'), v)
        el.classList.toggle(el.getClass('base'), !v)
      },
    },
    selected: {
      get() {
        return el.dataset.selected === 'true'
      },
      set(v) {
        el.dataset.selected = v
        if (v) {
          el.classList.add(el.getClass('active'))
        } else {
          el.classList.remove(el.getClass('active'))
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
  el.dataId = id || crypto.randomUUID()
  el._classes = classes
  el.className = `menu-item ${el.getClass('base')}`
  el.hidden = hidden
  el.selected = selected

  el.addEventListener('mouseenter', () => (el.hovered = true))
  el.addEventListener('mouseleave', () => (el.hovered = false))
  for (const [eventName, cb] of Object.entries(events)) {
    el.addEventListener(eventName, (e) => cb(e))
  }

  return el
}

// -------------------------------
// Object methods
// -------------------------------

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
