import { enableDragging, enableClicking } from '../_assets/js/drag.js'
import { newState } from '../_assets/js/newState.js'
import { injectStyle } from '../_assets/js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

const html = `
  <span class="empty-state hidden"></span>
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createList({
  id,
  itemClass,
  className,
  children,
  emptyState,
  onChange,
}) {
  injectStyle(css)

  if (!itemClass) {
    throw new Error(
      `list partial with id ${id} was set without an itemClass parameter`
    )
  }

  const el = createElement({
    id,
    itemClass,
    className,
    children,
    emptyState,
    onChange,
  })

  newState.on('item-click', 'list.js', (id) => handleSelectionChanged(el, id))

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Respond to selection changed events that the list
 * generates on add events and others.
 */
function handleSelectionChanged(el, id) {
  el.getChildren().forEach((child) => {
    // select the clicked child
    // and unselect the rest
    child.selected = child.dataId == id
  })
}

// -------------------------------
// Object methods
// -------------------------------

/**
 * Add item to list
 */
function addChild(child, pos = 'top') {
  if (!child.className.includes(this.itemClass)) {
    throw new Error(
      `Oops, list "#${this.dataset.id}" is set with itemClass "${this.itemClass}" but you loaded it with a "${child.className}" item`
    )
  }
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
  this.querySelector('.empty-state').classList.toggle(
    'hidden',
    !!children.length
  )

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
  const itemClass = `.${this.itemClass}`
  const children = [...this.querySelectorAll(itemClass)]
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
  return [...this.querySelectorAll(`.${this.itemClass}`)].map((el, i) => ({
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
  this.querySelectorAll(`.${this.itemClass}`).forEach(
    (child) => (child.selected = false)
  )

  this.dispatch('selection-changed')
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

  this.dispatch('list-changed')

  return item
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({
  id,
  itemClass,
  className = '',
  children,
  emptyState,
  onChange,
} = {}) {
  const el = document.createElement('div')
  el.innerHTML = html

  el.enableDragging = () => enableDragging(el)
  el.enableClicking = () => enableClicking(el)

  if (emptyState) {
    el._emptyState = emptyState
    el.querySelector('.empty-state').innerHTML = emptyState
  }

  el._onChange = onChange
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

  if (onChange) {
    el.onChange = onChange.bind(el)
  }

  /** when the list receives a selection-changed */
  el.addEventListener('selection-changed', handleSelectionChanged)

  el.id = id
  el.dataset.id = id
  el.className = `list ${className}`
  el.itemClass = itemClass

  if (children) {
    el.silent = true
    el.addChildren(children)
    el.silent = false
  }

  if (el.getChildren().length) {
    el.querySelector('.empty-state').classList.remove('hidden')
  }

  return el
}
