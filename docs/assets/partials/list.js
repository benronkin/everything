import { injectStyle } from '../js/ui.js'
import { state } from '../js/state.js'
import { enableDragging, enableClicking } from '../js/drag.js'
import { createDiv } from '../partials/div.js'
import { log } from '../js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.empty-state {
  font-style: italic;
  color: var(--gray3);
}
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

  react(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

function build({ el, emptyState, enableDrag } = {}) {
  if (enableDrag) {
    el.enableDragging = () => enableDragging(el)
    el.enableClicking = () => enableClicking(el)
  }

  if (emptyState) {
    const emptyStateDiv = createDiv({ className: 'empty-state' })
    el.appendChild(emptyStateDiv)
    emptyStateDiv.insertHtml(emptyState)
  }
}

function react(el) {
  state.on('list-changed', 'list', () => {
    el.querySelector('.empty-state')?.classList.toggle(
      'hidden',
      el.getChildren().length
    )
  })
}

function listen(el) {
  // select/unselect should be implemented inside the custom list
  // state.on('item-click', 'list', (id) => {
  //   el.getChildren().forEach((child) => {
  //     if (child.id === id) {
  //       child.classList.toggle('active')
  //     } else {
  //       child.classList.remove('active')
  //     }
  //   })
  // })
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
  state.set('list-changed', true)
}

/**
 * Children can be added post creation of list
 */
function addChildren(children = []) {
  if (children.length) {
    for (const child of children) {
      this.appendChild(child)
    }
  }
  state.set('list-changed', true)
}

/**
 * remove the sueprListItem by its id
 */
function deleteChild(id) {
  const item = this.getChildById(id)
  if (item) {
    item.remove()
  }
  state.set('list-changed', true)
}

/**
 * remove all sueprListItems
 */
function deleteChildren() {
  const emptyState = [...this.children].filter((c) =>
    c.classList.contains('empty-state')
  )

  this.innerHTML = ''
  this.insertHtml(emptyState)
  state.set('list-changed', true)
  return this // for chaining
}

/**
 * get all iistItems
 */
function getChildren() {
  const children = [...this.querySelectorAll('.list-item')]
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

  state.set('list-changed', true)

  return item
}
