import { enableDragging, enableClicking } from '../_assets/js/drag.js'
import { newState } from '../_assets/js/newState.js'
import { injectStyle, log } from '../_assets/js/ui.js'

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
  const div = document.createElement('div')
  div.innerHTML = html

  div.enableDragging = () => enableDragging(div)
  div.enableClicking = () => enableClicking(div)

  if (emptyState) {
    div._emptyState = emptyState
    div.querySelector('.empty-state').innerHTML = emptyState
  }

  div._onChange = onChange
  div.addChild = addChild.bind(div)
  div.addChildren = addChildren.bind(div)
  div.getChildren = getChildren.bind(div)
  div.getData = getData.bind(div)
  div.getChildById = getChildById.bind(div)
  div.getNthChild = getNthChild.bind(div)
  div.getSelected = getSelected.bind(div)
  div.has = has.bind(div)
  div.deleteChild = deleteChild.bind(div)
  div.deleteChildren = deleteChildren.bind(div)
  div.reset = reset.bind(div)
  div.updateChild = updateChild.bind(div)

  if (onChange) {
    div.onChange = onChange.bind(div)
  }

  // /* when list-item invokes a custom click event */
  // div.addEventListener('list-item-clicked', handleItemClick)
  // /* when list-item or list itself invokes list-changed event */
  // div.addEventListener('list-changed', handleListChanged)

  /** when the list receives a selection-changed */
  div.addEventListener('selection-changed', handleSelectionChanged)

  // sets custom props
  Object.defineProperties(div, {
    data: {
      get() {
        return this.getChildren().map((child) => child.data)
      },
    },
    dataId: {
      get() {
        return this.dataset.id
      },
      set(newValue = '') {
        this.id = newValue
        this.dataset.id = newValue
        this.dataset.testId = newValue
      },
    },
    length: {
      get() {
        return this.getData().length
      },
    },
    itemClass: {
      get() {
        return this.dataset.itemClass
      },
      set(itemClass) {
        this.dataset.itemClass = itemClass
      },
    },
    silent: {
      get() {
        return this._silent
      },
      set(isSilent) {
        log(`${this.id} is ${isSilent ? 'silent' : 'unsilent'}`)
        this._silent = isSilent
      },
    },
  })

  id && (div.dataId = id)
  div.className = `list ${className}`
  div.itemClass = itemClass

  if (children) {
    div.silent = true
    div.addChildren(children)
    div.silent = false
  }

  if (div.getChildren().length) {
    div.querySelector('.empty-state').classList.remove('hidden')
  }

  return div
}
