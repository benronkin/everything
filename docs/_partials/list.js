import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'
import { enableDragging, enableClicking } from '../_assets/js/drag.js'
import { createDiv } from '../_partials/div.js'
import { log } from '../_assets/js/logger.js'

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
export function createList({ id, emptyState, className, enableDrag = false }) {
  injectStyle(css)

  const el = createDiv()

  build({ el, emptyState, enableDrag })
  listen(el)

  el.addChild = addChild.bind(el)
  el.addChildren = addChildren.bind(el)
  el.getChildren = getChildren.bind(el)
  el.getData = getData.bind(el)
  el.getChildById = getChildById.bind(el)
  el.getNthChild = getNthChild.bind(el)
  el.getSelected = getSelected.bind(el)
  el.has = has.bind(el)
  el.deleteChild = deleteChild.bind(el)
  el.deleteChildren = deleteChildren.bind(el)
  el.reset = reset.bind(el)
  el.updateChild = updateChild.bind(el)

  if (id) {
    el.id = id
    el.dataset.id = id
  }
  className && (el.className = className)
  el.classList.add('list')

  if (el.getChildren().length) {
    el.querySelector('.empty-state').classList.remove('hidden')
  }

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function build({ el, emptyState, enableDrag } = {}) {
  if (enableDrag) {
    el.enableDragging = () => enableDragging(el)
    el.enableClicking = () => enableClicking(el)
  }

  if (emptyState) {
    el._emptyState = emptyState
    const emptyStateDiv = createDiv({ className: 'empty-state hidden' })
    el.appendChild(emptyStateDiv)
    emptyStateDiv.setHtml(emptyState)
  }
}

/**
 * Respond to selection changed events that the list
 * generates on add events and others.
 */
function listen(el) {
  newState.on('item-click', 'list', (id) => {
    el.getChildren().forEach((child) => {
      // select the clicked child
      // and unselect the rest
      child.classList.toggle('active', child.dataset.id == id)
    })
  })
}

// -------------------------------
// Object methods
// -------------------------------

/**
 * Add item to list
 */
function addChild(child, pos = 'top') {
  if (pos === 'top') {
    this.insertBefore(child, this.firstChild)
  } else {
    this.appendChild(child)
  }
}

/**
 * Children can be added post creation of list
 */
function addChildren(children = []) {
  if (this._emptyState) {
    this.querySelector('.empty-state').classList.toggle(
      'hidden',
      !!children.length
    )
  }

  if (children.length) {
    for (const child of children) {
      this.appendChild(child)
    }
  }
}

/**
 * remove the sueprListItem by its id
 */
function deleteChild(id) {
  const item = this.getChildById(id)
  if (item) {
    item.remove()
  }
}

/**
 * remove all sueprListItems
 */
function deleteChildren() {
  this.getChildren().forEach((i) => i.remove())
  return this // for chaining
}

/**
 * get all iistItems
 */
function getChildren() {
  const children = [...this.querySelectorAll('[data-list-item]')]
  return children
}

/**
 * Get item by id
 */
function getChildById(id) {
  return this.querySelector(`[data-id="${id}"]`)
}

/**
 * Get ids, texts, and selected status of all items
 */
function getData() {
  return [...this.querySelectorAll('[data-list-item]')].map((el, i) => ({
    ...el.data,
    sortOrder: i,
  }))
}

/**
 * Get item by position
 */
function getNthChild(n) {
  return this.getChildren()[n]
}

/**
 * Get the selected listItem
 */
function getSelected() {
  return this.querySelector('[data-selected="true"]')
}

/**
 * Check if item is in list
 */
function has(text) {
  const texts = this.data.map((obj) => obj.text)
  return texts.includes(text)
}

/**
 *
 */
function reset() {
  this.querySelectorAll('[data-list-item]').forEach((child) =>
    child.classList.remove('active')
  )
}

/**
 * update the sueprListItem by its id
 */
function updateChild({ id, title, details }) {
  const item = this.getChildById(id)
  if (item) {
    item.querySelector('[name="title"]').value = title
    item.querySelector('[name="details"]').value = details
  }

  return item
}
