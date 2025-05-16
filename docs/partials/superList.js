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
    targetId: child.getId(),
    title: child.querySelector('[name=title]').value,
    details: child.querySelector('[name=details]').value,
  })
}

/**
 * Children can be added post creation of superList
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
      value: this.getSelected()?.querySelector('span').textContent,
    })
  }

  this.dispatch('list-changed')
}

/**
 * remove the sueprListItem by its id
 */
function deleteChild(id) {
  const item = this.getItem(id)
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
  this.querySelectorAll('.super-list-item').forEach((i) => i.remove())

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
 * Get ids, texts, and selected status of all items
 */
function getData() {
  return [...this.querySelectorAll('.super-list-item')].map((el, i) => ({
    id: el.dataset.id,
    title: el.querySelector('[name="title"]').value.trim(),
    details: el.querySelector('[name="details"]').value.trim(),
    selected: el.dataset.selected === 'true',
    sortOrder: i,
  }))
}

/**
 * Get item by id
 */
function getItem(id) {
  return this.querySelector(`[data-id="${id}"]`)
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
  const titles = this.getTitles()
  return titles.includes(item)
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
 *
 */
function reset() {
  this.querySelectorAll('.super-list-item').forEach((child) => child.unselect())

  this.dispatch('selection-changed', {
    selected: !!this.getSelected(),
    title: this.getSelected()?.querySelector('[name="title"]').value,
    details: this.getSelected()?.querySelector('[name="details"]').value,
  })
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
  div.innerHTML = html

  div.enableDragging = () => enableDragging(div)
  div.enableClicking = () => enableClicking(div)

  if (emptyState) {
    div._emptyState = emptyState
    div.querySelector('.empty-state').innerHTML = emptyState
  }

  div.setAttribute('id', id)
  div.className = `super-list${className ? ' ' + className : ''}`

  div._onChange = onChange
  div.addChild = addChild.bind(div)
  div.addChildren = addChildren.bind(div)
  div.dispatch = dispatch.bind(div)
  div.getData = getData.bind(div)
  div.getItem = getItem.bind(div)
  div.getSelected = getSelected.bind(div)
  div.has = has.bind(div)
  div.getTitles = getTitles.bind(div)
  div.deleteChild = deleteChild.bind(div)
  div.deleteChildren = deleteChildren.bind(div)
  div.reset = reset.bind(div)
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

  // sets custom props
  Object.defineProperty(div, 'length', {
    get() {
      return this.getData().length
    },
  })
  Object.defineProperty(div, 'silent', {
    get() {
      return this._silent
    },
    set(isSilent) {
      log(`${this.id} is ${isSilent ? 'silent' : 'unsilent'}`)
      this._silent = isSilent
    },
  })

  if (children) {
    div.silent = true
    div.addChildren(children)
    div.silent = false
  } else {
    div.querySelector('.empty-state').classList.remove('hidden')
  }

  return div
}
