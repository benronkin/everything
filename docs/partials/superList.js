import { enableDragging, enableClicking } from '../js/drag.js'
import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

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
// Event handlers
// -------------------------------

/**
 * We preface selection-changed with standard work to
 * unselect all other items
 */
function handleItemClick(e, superListEl) {
  const { target, selected } = e.detail

  superListEl.querySelectorAll('.super-list-item').forEach((item) => {
    if (item !== target) {
      item.unselect()
    }
  })

  superListEl.dispatch('selection-changed', {
    detail: { selected },
  })

  // superListEl.dispatchEvent(
  //   new CustomEvent('selection-changed', {
  //     detail: { selected },
  //   })
  // )
}

/**
 *
 */
function handleListChanged(e) {
  if (!this._silent && this._onChange) {
    this._onChange(e)
  }
}

// -------------------------------
// Object methods
// -------------------------------

/**
 * Add item to list
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

  this.dispatch('selection-changed', {
    detail: {
      selected: !!this.getSelected(),
      value: this.getSelected()?.querySelector('span').textContent,
    },
  })
  this.dispatch('list-changed')

  // this.dispatchEvent(
  //   new CustomEvent('selection-changed', {
  //     detail: {
  //       selected: !!this.getSelected(),
  //       value: this.getSelected()?.querySelector('span').textContent,
  //     },
  //   })
  // )
  // this.dispatchEvent(new CustomEvent('list-changed'))
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

  this.dispatch('selection-changed', {
    selected: !!this.getSelected(),
    value: this.getSelected()?.querySelector('span').textContent,
  })
  this.dispatch('list-changed')

  // this.dispatchEvent(
  //   new CustomEvent('selection-changed', {
  //     detail: {
  //       selected: !!this.getSelected(),
  //       value: this.getSelected()?.querySelector('span').textContent,
  //     },
  //   })
  // )
  // this.dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Dispatch a custom event
 */
function dispatch(eventName, detail = {}) {
  detail.target = this
  detail.id = this.getAttribute('id')
  const event = new CustomEvent(eventName, {
    bubbles: true,
    detail,
  })

  this.dispatchEvent(event)
}

/**
 * Get ids, texts, and selected status of all items
 */
function getData() {
  return [...this.querySelectorAll('.super-list-item')].map((el) => ({
    id: el.id,
    title: el.querySelector('[name="title"]').value.trim(),
    details: el.querySelector('[name="details"]').value.trim(),
    selected: el.dataset.selected === 'true',
  }))
}

/**
 * Get item by id
 */
function getItem(id) {
  return this.querySelector(`#${id}`)
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
  const items = this.getTitles().map((item) =>
    item.querySelector('[name="title"]').toString().trim().toLowerCase()
  )
  return items.includes(item)
}

/**
 * Get list items
 */
function getTitles() {
  const items = [...this.querySelectorAll('.super-list-item')].map((item) =>
    item.getTitle()
  )
  return items
}

/**
 * remove the sueprListItem by its id
 */
function removeChild(id) {
  const item = this.getItem(id)
  if (item) {
    item.remove()
  }

  this.dispatch('list-changed')
  return item
}

/**
 *
 */
function reset() {
  this.querySelectorAll('.super-list-item').forEach((child) => child.unselect())

  this.dispatch('selection-changed', {
    selected: !!this.getSelected(),
    title: this.getSelected()?.querySelector('[name="title"]').value,
    details: this.getSelected()?.querySelector('[name="details"]').value,
  })
  // this.dispatchEvent(
  //   new CustomEvent('selection-changed', {
  //     detail: {
  //       selected: !!this.getSelected(),
  //       value: this.getSelected()?.querySelector('span').textContent,
  //     },
  //   })
  // )
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
function updateChild({ id, title, details }) {
  const item = this.getItem(id)
  if (item) {
    item.querySelector('[name="title"]').value = title
    item.querySelector('[name="details"]').value = details
  }

  this.dispatch('list-changed')

  return item
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

  div._emptyState = emptyState
  div._onChange = onChange
  div.id = id
  div.addChild = addChild.bind(div)
  div.addChildren = addChildren.bind(div)
  div.addChildren(children)
  div.dispatch = dispatch.bind(div)
  div.enableDragging = () => enableDragging(div)
  div.enableClicking = () => enableClicking(div)
  div.getData = getData.bind(div)
  div.getItem = getItem.bind(div)
  div.getSelected = getSelected.bind(div)
  div.has = has.bind(div)
  div.getTitles = getTitles.bind(div)
  div.removeChild = removeChild.bind(div)
  div.reset = reset.bind(div)
  div.setSilent = setSilent.bind(div)
  div.updateChild = updateChild.bind(div)
  if (onChange) {
    div.onChange = onChange.bind(div)
  }

  /* when super-list-item invokes a custom click event */
  div.addEventListener('super-list-item-clicked', (e) =>
    handleItemClick(e, div)
  )

  /* when super-list-item or super-list itself invokes list-changed event */
  div.addEventListener('list-changed', handleListChanged)

  return div
}
