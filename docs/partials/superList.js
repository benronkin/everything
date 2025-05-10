import { enableDragging, enableClicking } from '../js/drag.js'
import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.main-super-list-wrapper {
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 10px 0;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.08);
}
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createSuperList(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Event handler functions
// -------------------------------

/**
 *
 */
function handleItemClick(e, superListEl) {
  const { id, el } = e.detail

  superListEl.querySelectorAll('.super-list-item').forEach((item) => {
    if (item !== el) {
      item.unselect()
    }
  })

  superListEl.dispatchEvent(
    new CustomEvent('selection-changed', {
      detail: {
        selected: !!superListEl.getSelected(),
        value: superListEl.getSelected()?.querySelector('span').textContent,
      },
    })
  )
}

/**
 *
 */
function handleListChanged() {
  if (!this._silent && this._onChange) {
    this._onChange()
  }
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({ id, className, children, emptyState, onChange } = {}) {
  const div = document.createElement('div')
  // div.className = `super-list`
  div.className = `super-list${className ? ' ' + className : ''}`
  div.id = id
  div._emptyState = emptyState
  div._onChange = onChange

  div.addChild = addChild.bind(div)
  div.addChildren = addChildren.bind(div)
  div.addChildren(children)
  div.enableDragging = () => enableDragging(div)
  div.enableClicking = () => enableClicking(div)
  div.getData = getData.bind(div)
  div.getSelected = getSelected.bind(div)
  div.has = has.bind(div)
  div.listItems = listItems.bind(div)
  if (onChange) {
    div.onChange = onChange.bind(div)
  }
  div.reset = reset.bind(div)
  div.setSilent = setSilent.bind(div)
  div.updateItem = updateItem.bind(div)

  /* when super-list-item invokes a custom click event */
  div.addEventListener('super-list-item-clicked', (e) =>
    handleItemClick(e, div)
  )

  /* when super-list-item or super-list itself invokes list-changed event */
  div.addEventListener('list-changed', handleListChanged)

  return div
}

/**
 * Add shopping item to list
 */
function addChild(child, pos = 'top') {
  if (!this.querySelectorAll('.super-list-item').length) {
    // remove empty state
    this.innerHTML = ''
  }

  if (pos === 'top') {
    this.insertBefore(child, this.firstChild)
  } else {
    this.appendChild(child)
  }

  this.dispatchEvent(
    new CustomEvent('selection-changed', {
      detail: {
        selected: !!this.getSelected(),
        value: this.getSelected()?.querySelector('span').textContent,
      },
    })
  )
  this.dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Children can be added post creation of superList
 */
function addChildren(children) {
  // children may be undefined and not iterable
  // hence the check
  if (!children) {
    return
  }

  if (!this.querySelectorAll('.super-list-item').length) {
    // remove empty state
    this.innerHTML = ''
  }

  for (const child of children) {
    this.appendChild(child)
  }

  this.dispatchEvent(
    new CustomEvent('selection-changed', {
      detail: {
        selected: !!this.getSelected(),
        value: this.getSelected()?.querySelector('span').textContent,
      },
    })
  )
  this.dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Get ids, texts, and selected status of all items
 */
function getData() {
  return [...this.querySelectorAll('.super-list-item')].map((el) => ({
    id: el.id,
    text: el.querySelector('span')?.textContent.trim(),
    selected: el.dataset.selected === 'true',
  }))
}

/**
 * Get the selected superListItem
 */
function getSelected() {
  return this.querySelector('.super-list-item[data-selected="true"]')
}

/**
 * Check if item is in list
 */
function has(item) {
  const items = this.listItems()
  return items.includes(item.toString().trim().toLowerCase())
}

/**
 * Get shopping list items
 */
function listItems() {
  if (!window.location.pathname.includes('/shopping/')) {
    return []
  }
  const items = [...this.querySelectorAll('.super-list-item')].map((el) =>
    el.textContent.trim().toLowerCase()
  )
  return items
}

/**
 *
 */
function reset() {
  this.querySelectorAll('.super-list-item').forEach((child) => child.unselect())

  this.dispatchEvent(
    new CustomEvent('selection-changed', {
      detail: {
        selected: !!this.getSelected(),
        value: this.getSelected()?.querySelector('span').textContent,
      },
    })
  )
}

/**
 *
 */
function setSilent(silent) {
  this._silent = silent
}

/**
 * update the sueprListItem by its id
 */
function updateItem(id, text) {
  const item = this.querySelector(`#${id}`)
  if (item) {
    item.querySelector('span').textContent = text
  }

  this.dispatchEvent(new CustomEvent('list-changed'))

  return item
}
