import { state } from '../js/state.js'
import { handleTokenQueryParam, getWebApp, postWebApp } from '../js/io.js'
import { makeDragStyles, enableDragging, disableDragging } from '../js/drag.js'
import { createNav } from '../partials/nav.js'
import { createFooter } from '../partials/footer.js'
import { createRightDrawer } from '../partials/right-drawer.js'
import { createFormHorizontal } from '../partials/form-horizontal.js'
import { setMessage } from '../js/ui.js'

// ----------------------
// Globals
// ----------------------

const shoppingContainer = document.querySelector('#shopping-container')
const shoppingForm = document.querySelector('#shopping-form')
const shoppingDiv = document.querySelector('#shopping-div')
const suggestionsContainer = document.querySelector('#shopping-suggestions')
const suggestSwitch = document.querySelector('#suggest-switch')
const sortSwitch = document.querySelector('#sort-switch')

// set in handleDOMContentLoaded
let shoppingInput
let suggestAutoComplete

let retryTimeout = 10

// ----------------------
// Exported functions
// ----------------------

/**
 * Add an array of items to the shopping list
 */
export async function addItemsToShoppingList(newItems, suppressListChanged = false) {
  newItems = newItems.map((item) => item.trim()).filter((item) => item.toString().length > 0)

  if (window.location.pathname.includes('/shopping/')) {
    // avoid duplicating existing items in shopping list
    const items = await getShoppingListItems()
    newItems = newItems.filter((item) => !items.includes(item))
  }
  // append to list
  for (const item of newItems) {
    addShoppingItemToList(item)
  }
  if (!suppressListChanged) {
    // when init loads the list, it must not invoke list-changed
    document.dispatchEvent(new CustomEvent('list-changed'))
  }
}

// ---------------------------------------
// Event handlers for hard-coded elements
// ---------------------------------------

// since shopping is a module imported by recipes,
// set event handlers only when on shopping page
if (window.location.pathname.includes('/shopping/')) {
  /* When page is loaded */
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

  /* when sort switch is clicked */
  sortSwitch.addEventListener('click', handleSortSwitchClick)

  /* when suggest switch is clicked */
  suggestSwitch.addEventListener('click', handleSuggestSwitchClick)

  /* when shopping list changes */
  document.addEventListener('list-changed', handleShoppingListChange)

  /* when clearSelection is dispatched */
  document.addEventListener('clear-selection', clearSelection)
}

// ------------------------
// Event handler functions
// ------------------------

/**
 * Handle DOMContentLoaded
 */
async function handleDOMContentLoaded() {
  handleTokenQueryParam()

  const token = localStorage.getItem('authToken')
  if (!token) {
    window.location.href = '../index.html'
    return
  }

  setMessage('Loading...')

  const { shoppingList, shoppingSuggestions } = await getWebApp(`${state.getWebAppUrl()}/shopping/read`)

  setMessage('')

  initShopping(shoppingList, shoppingSuggestions)

  document.querySelector('#empty-state').classList.toggle('hidden', shoppingList.length > 0)

  addPageElements()
}

/**
 * Handle sort switch click
 */
function handleSortSwitchClick() {
  sortSwitch.classList.toggle('on')
  const shoppingItems = document.querySelectorAll('.shopping-item')

  if (sortSwitch.classList.contains('on')) {
    enableDragging()
    clearSelection()
    shoppingItems.forEach((el) => makeElementDraggable(el))
  } else {
    disableDragging()
    shoppingItems.forEach((el) => makeElementClickable(el))
  }
}

/**
 * handle suggest switch click
 */
function handleSuggestSwitchClick() {
  clearSelection()
  suggestSwitch.classList.toggle('on')
  suggestionsContainer.classList.toggle('hidden')
  displaySuggestions()
}

/**
 * Handle shopping form submit
 */
function handleShoppingFormSubmit(e, prepend) {
  e.preventDefault()
  setMessage('')

  const itemId = shoppingInput.dataset.index
  const value = shoppingInput.value
  const itemEl = document.getElementById(itemId)

  clearSelection()
  shoppingInput.focus()
  if (itemEl) {
    // existing item is edited
    itemEl.querySelector('span').innerText = value
    itemEl.querySelector('.fa-bars').classList.remove('hidden')
    itemEl.addEventListener('click', handleShoppingItemClick)
    itemEl.querySelector('.fa-trash').addEventListener('click', handleShoppingTrashClick)
  } else {
    // new item is added
    if (inShoppingList(value)) {
      setMessage('Already in list')
      return
    }

    addShoppingItemToList(value, prepend)
  }
  document.dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Handle key up event in shopping input
 */
function handleShopInputKeyUp() {
  suggestAutoComplete.innerHTML = ''
  if (shoppingInput.value.trim() === '') {
    shoppingInput.dataset.index = ''
    document.querySelectorAll('i.fa-trash').forEach((el) => el.classList.add('hidden'))
    return
  }
  populateShopAutoComplete()
}

/**
 * Handle shopping list change. handleShoppingTrashClick passes
 * detail with a callback and callback parameter should the
 * server update is successful
 */
async function handleShoppingListChange(e) {
  let values = getShoppingListItems()
  state.add('shopping-suggestions', values)

  document.querySelector('#empty-state').classList.toggle('hidden', values.length > 0)

  try {
    const { status, message } = await postWebApp(`${state.getWebAppUrl()}/shopping/update`, {
      value: values.join(','),
    })
    if (status !== 200) {
      setMessage(message)
      console.warn(message)
      if (retryTimeout >= 200) {
        retryTimeout = 10
        console.warn('handleShoppingListChange: server keeps failing. Aborting.')
        return
      }

      retryTimeout *= 2
      setTimeout(() => {
        handleShoppingListChange(e)
      }, retryTimeout)
    }
  } catch (error) {
    setMessage(error)
    console.warn(error)
  }
}

/**
 *
 */
function handleShoppingItemClick(e) {
  const parent = e.target.closest('.shopping-item')
  if (!parent) {
    return
  }
  document.querySelectorAll('i.fa-trash').forEach((el) => el.classList.add('hidden'))

  document.querySelectorAll('.shopping-item').forEach((el) => {
    if (el !== parent) {
      el.classList.remove('checked')
    }
  })

  parent.classList.toggle('checked')
  if (parent.classList.contains('checked')) {
    shoppingInput.value = parent.innerText
    shoppingInput.dataset.index = parent.id
    parent.querySelector('i.fa-trash').classList.remove('hidden')
  } else {
    clearSelection()
  }
  // shoppingInput.focus()
}

/**
 * Handle shopping item trash click
 */
function handleShoppingTrashClick(e) {
  e.stopPropagation()
  clearSelection()
  displaySuggestions()
  e.target.closest('.shopping-item').remove()
  document.dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Handle suggestion item click
 */
function handleSuggestionItemClick(e) {
  const div = e.target.closest('.shopping-suggestion')
  div.classList.toggle('checked')
  document.querySelectorAll('.shopping-suggestion').forEach((el) => {
    if (el !== div) {
      el.classList.remove('checked')
      el.querySelector('.fa-trash').classList.add('hidden')
    }
  })
  div.querySelector('.fa-trash').classList.toggle('hidden')
}

/**
 * Handle suggestion plus click
 */
function handleSuggestionPlusClick(e) {
  const div = e.target.closest('.shopping-suggestion')
  addShoppingItemToList(div.innerText, 'prepend')
  div.remove()
  // on mobile, the next fa-plus "inherits" a hover state
  // so remove it
  const els = document.querySelectorAll('.shopping-suggestion .fa-plus')
  els.forEach((el) => el.blur())
  clearSelection()
  document.dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Handle suggestion trash click
 */
function handleSuggestionTrashClick(e) {
  const div = e.target.closest('.shopping-suggestion')
  const value = div.textContent.trim()
  div.remove()
  const suggestions = state.delete('shopping-suggestions', value)
  // clearSelection()
  postWebApp(`${state.getWebAppUrl()}/shopping/suggestions/update`, {
    value: suggestions.join(','),
  })
}

// ------------------------
// Helpers
// ------------------------

/**
 * Set recipe event listeners
 */
async function initShopping(shoppingList, shoppingSuggestions) {
  makeDragStyles()
  displayShoppingList(shoppingList)
  state.set('shopping-items', shoppingList.split(','))
  state.set('shopping-suggestions', shoppingSuggestions.split(','))
}

/**
 * Set nav, footer and other page elements
 */
function addPageElements() {
  // create nav and footer
  const wrapperEl = document.querySelector('.wrapper')
  const navEl = createNav({ title: 'Shopping', active: 'shopping' })
  wrapperEl.prepend(navEl)
  const footerEl = createFooter()
  wrapperEl.appendChild(footerEl)

  const rightDrawerEl = createRightDrawer({ active: 'shopping' })
  document.querySelector('main').prepend(rightDrawerEl)

  // create shopping form
  const shoppingFormEl = createFormHorizontal({
    formId: 'shopping-form',
    inputType: 'text',
    inputName: 'add-item-input',
    inputPlaceholder: 'Add item',
    inputAutoComplete: 'off',
    iClass: 'bread-slice',
    submitText: 'Add',
  })
  shoppingContainer.prepend(shoppingFormEl)
  shoppingFormEl.innerHTML += '<div id="suggest-auto-complete"></div>'
  shoppingInput = shoppingFormEl.querySelector('input')
  shoppingInput.focus()

  suggestAutoComplete = document.querySelector('#suggest-auto-complete')

  /* when shopping input key is pressed */
  shoppingInput.addEventListener('keyup', handleShopInputKeyUp)

  /* when shopping form is submitted */
  shoppingFormEl.addEventListener('submit', (e) => handleShoppingFormSubmit(e, 'prepend'))
}

/**
 * Create a shopping item element
 */
function createShoppingItem(item) {
  const div = document.createElement('div')
  div.classList.add('shopping-item')
  div.id = generateUUID()
  div.innerHTML = `
    <div><i class="fa-solid fa-bars hidden"></i><span>${item.toString().trim().toLowerCase()}</span></div>
    <i class="fa fa-trash hidden"></i>`
  return div
}

/**
 * Create a shopping suggestion element
 */
function createShoppingSuggestion(item) {
  const div = document.createElement('DIV')
  div.classList.add('shopping-suggestion')
  div.innerHTML = `<div><i class="fa-solid fa-plus secondary"></i><span>${item}</span></div>
    <i class="fa fa-trash hidden"></i>`

  div.addEventListener('click', handleSuggestionItemClick)
  div.querySelector('.fa-plus').addEventListener('click', handleSuggestionPlusClick)
  div.querySelector('.fa-trash').addEventListener('click', handleSuggestionTrashClick)
  return div
}

/**
 * Add shopping item to list
 */
function addShoppingItemToList(value, prepend) {
  const shoppingItem = createShoppingItem(value)
  if (prepend) {
    shoppingDiv.insertBefore(shoppingItem, shoppingDiv.firstChild)
  } else {
    shoppingDiv.appendChild(shoppingItem)
  }
  if (sortSwitch.classList.contains('on')) {
    makeElementDraggable(shoppingItem)
    enableDragging()
  } else {
    makeElementClickable(shoppingItem)
  }
}

/**
 * Display shopping list
 */
function displayShoppingList(shoppingList) {
  if (shoppingList.length > 0) {
    const values = shoppingList.split(',')
    addItemsToShoppingList(values, true)
  }
}

/**
 * Display a list of suggestions
 */
function displaySuggestions() {
  let suggestions = state.get('shopping-suggestions')
  if (!suggestions) {
    suggestions = ['apples', 'carrots', 'berries']
  }
  suggestionsContainer.innerHTML = ''
  const shoppingItems = getShoppingListItems()

  suggestions = suggestions.filter((s) => !shoppingItems.includes(s))
  suggestions.sort()
  for (const s of suggestions) {
    const div = createShoppingSuggestion(s)
    suggestionsContainer.appendChild(div)
  }
}

/**
 * Make individual shopping item draggable
 */
function makeElementDraggable(element) {
  element.classList.remove('clickable')

  element.removeEventListener('click', handleShoppingItemClick)
  element.querySelector('i.fa-bars').classList.remove('hidden')
  element.querySelector('i.fa-trash').removeEventListener('click', handleShoppingTrashClick)
}

/**
 * Make individual shopping item clickable
 */
function makeElementClickable(element) {
  if (element.classList.contains('clickable')) {
    return
  }
  element.classList.add('clickable')

  element.addEventListener('click', handleShoppingItemClick)
  element.querySelector('i.fa-bars').classList.add('hidden')
  element.querySelector('i.fa-trash').addEventListener('click', handleShoppingTrashClick)
}

/**
 *
 */
function populateShopAutoComplete() {
  if (!shoppingInput.value) {
    return
  }
  const q = shoppingInput.value.toLowerCase().trim()
  const items = state.get('shopping-items')
  let suggests = state.get('shopping-suggestions')
  suggests = suggests.filter((s) => !items.includes(s))
  suggests = suggests.filter((s) => s.includes(q))

  // console.log('q', shoppingInput.value)
  // console.log('items', items)
  // console.log('suggests', suggests)

  if (suggests.length === 0) {
    return
  }
  for (const s of suggests) {
    const div = createShoppingSuggestion(s)
    suggestAutoComplete.appendChild(div)
  }
}

/**
 *
 */
function clearSelection() {
  shoppingInput.value = ''
  shoppingInput.dataset.index = ''
  document.querySelectorAll('i.fa-trash').forEach((el) => el.classList.add('hidden'))
  document.querySelectorAll('.shopping-item').forEach((el) => el.classList.remove('checked'))
  document.querySelectorAll('.shopping-suggestion').forEach((el) => el.classList.remove('checked'))
  // suggestionsContainer.innerHTML = ''
  suggestAutoComplete.innerHTML = ''
}

/**
 * Create a uuid
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Check if item is in list
 */
function inShoppingList(item) {
  const items = getShoppingListItems()
  return items.includes(item.toString().trim().toLowerCase())
}

/**
 * Get shopping list items
 */
function getShoppingListItems() {
  if (!window.location.pathname.includes('/shopping/')) {
    return []
  }
  const items = [...shoppingDiv.querySelectorAll('.shopping-item')].map((el) => el.textContent.trim().toLowerCase())
  return items
}
