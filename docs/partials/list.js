import { enableDragging, enableClicking } from '../js/drag.js'
import { injectStyle, log } from '../js/ui.js'

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
export function createList(config) {
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
function handleItemClick(e, listEl) {
  const { target, selected } = e.detail

  listEl.querySelectorAll(`.${listEl.itemClass}`).forEach((item) => {
    if (item !== target) {
      item.selected = false
    }
  })

  listEl.dispatch('selection-changed', {
    detail: { selected },
  })
}

/**
 *
 */
function handleListChanged(e) {
  this.querySelector('.empty-state').classList.toggle('hidden', !!this.length)

  if (!this.silent && this._onChange) {
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

  this.dispatch('selection-changed', {
    selected: !!this.getSelected(),
    value: this.getSelected()?.querySelector('span').textContent,
  })

  this.dispatch('list-changed', {
    action: 'create',
    ...child.data,
  })
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

    this.dispatch('selection-changed', {
      selected: !!this.getSelected(),
      value: this.getSelected()?.value,
    })
  }

  this.dispatch('list-changed')
}

/**
 * remove the sueprListItem by its id
 */
function deleteChild(id) {
  const item = this.getChildById(id)
  if (item) {
    item.remove()
  }

  this.dispatch('list-changed', {
    action: 'delete',
    targetId: id,
  })
  return item
}

/**
 * remove all sueprListItems
 */
function deleteChildren() {
  this.getChildren().forEach((i) => i.remove())

  this.dispatch('list-changed', {
    action: 'delete',
  })
}

/**
 * Dispatch a custom event
 */
function dispatch(eventName, detail = {}) {
  if (this.silent) {
    log(`${this.id} is silent, canceling dispatch`)
    return
  }
  detail.target = this
  detail.dispatcherId = this.getAttribute('id')
  const event = new CustomEvent(eventName, {
    bubbles: true,
    detail,
  })

  this.dispatchEvent(event)
}

/**
 * get all iistItems
 */
function getChildren() {
  return [...this.querySelectorAll(`.${this.itemClass}`)]
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
  return this.querySelector('.list-item[data-selected="true"]')
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
  itemClass = 'list-item',
  className,
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

  if (id) {
    // div.setAttribute('id', id) canceling that. Change code that uses it
    div.dataset.id = id
  }
  div.dataset.testId = id || 'list'
  div.className = `list${className ? ' ' + className : ''}`

  div._onChange = onChange
  div.addChild = addChild.bind(div)
  div.addChildren = addChildren.bind(div)
  div.dispatch = dispatch.bind(div)
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

  /* when list-item invokes a custom click event */
  div.addEventListener('list-item-clicked', (e) => handleItemClick(e, div))

  /* when list-item or list itself invokes list-changed event */
  div.addEventListener('list-changed', handleListChanged)

  // sets custom props
  Object.defineProperties(div, {
    data: {
      get() {
        return this.getChildren().map((child) => child.data)
      },
    },
    length: {
      get() {
        return this.getData().length
      },
    },
    itemClass: {
      get() {
        return this._itemClass
      },
      set(itemClass) {
        this._itemClass = itemClass
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
  div.itemClass = itemClass

  if (children) {
    div.silent = true
    div.addChildren(children)
    div.silent = false
  } else {
    div.querySelector('.empty-state').classList.remove('hidden')
  }

  return div
}
