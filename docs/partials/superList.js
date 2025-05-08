import { enableDragging, enableClicking } from '../js/drag.js'

// -------------------------------
// Globals
// -------------------------------

let cssInjected = false

const css = `
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
function injectStyle(css) {
  if (cssInjected || !css) return
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  cssInjected = true
}

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
  div.has = has.bind(div)
  div.listItems = listItems.bind(div)
  if (onChange) {
    div.onChange = onChange.bind(div)
  }
  div.reset = reset.bind(div)
  div.setSilent = setSilent.bind(div)

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
  // if (sortSwitch.classList.contains('on')) {
  //   makeElementDraggable(shoppingItem)
  //   enableDragging()
  // } else {
  //   makeElementClickable(shoppingItem)
  // }
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
  this.dispatchEvent(new CustomEvent('list-changed'))
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
}

/**
 *
 */
function setSilent(silent) {
  this._silent = silent
}
