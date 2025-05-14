import { state } from '../js/state.js'
import { handleTokenQueryParam, getWebApp, postWebAppJson } from '../js/io.js'
import { createNav } from '../partials/nav.js'
import { createFooter } from '../partials/footer.js'
import { createRightDrawer } from '../partials/rightDrawer.js'
import { createFormHorizontal } from '../partials/formHorizontal.js'
import { createSuperList } from '../partials/superList.js'
import { createSuperListItem } from '../partials/superListItem.js'
import { createIcon } from '../partials/icon.js'
import { createField } from '../partials/formField.js'
import { createSwitch } from '../partials/switch.js'
import { setMessage } from '../js/ui.js'

// ----------------------
// Globals
// ----------------------

const formWrapper = document.querySelector('#form-wrapper')
const shoppingWrapper = document.querySelector('#shopping-wrapper')
const suggestionsWrapper = document.querySelector('#suggestions-wrapper')
let shoppingListEl
let suggestionsEl
let suggestSwitch
let sortSwitch
let shoppingInput
let suggestAutoComplete

let retryTimeout = 10

// ----------------------
// Exported functions
// ----------------------

/**
 * Add an array of items to the shopping list
 */
export async function addItemsToShoppingList(
  newItems,
  suppressListChanged = false
) {
  newItems = newItems
    .map((item) => item.trim())
    .filter((item) => item.toString().length > 0)

  if (window.location.pathname.includes('/shopping/')) {
    // avoid duplicating existing items in shopping list
    const titles = shoppingListEl.getTitles()
    newItems = newItems.filter((item) => !titles.includes(item))
  }
  // append to list
  for (const text of newItems) {
    addShoppingItemToList(text, 'bottom')
  }
  if (!suppressListChanged) {
    // when init loads the list, it must not invoke list-changed
    shoppingListEl.dispatchEvent(new CustomEvent('list-changed'))
  }
}

// ---------------------------------------
// Event listeners
// ---------------------------------------

// since shopping is a module imported by recipes,
// set event handlers only when on shopping page
if (window.location.pathname.includes('/shopping/')) {
  /* When page is loaded */
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

  /* when shopping list changes */
  document.addEventListener('list-changed', handleShoppingListChange)

  /* when clearSelection is dispatched */
  document.addEventListener('clear-selection', clearSelection)
}

// ------------------------
// Event handlers
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

  const { shoppingList, shoppingSuggestions } = await getWebApp(
    `${state.getWebAppUrl()}/shopping/read`
  )

  setMessage('')

  addPageElements()

  initShopping(shoppingList, shoppingSuggestions)

  state.setDefaultPage('shopping')
}

/**
 * Handle sort switch click
 */
function handleSortSwitchClick() {
  if (sortSwitch.isOn()) {
    shoppingListEl.enableDragging()
    clearSelection()
  } else {
    shoppingListEl.enableClicking()
  }
}

/**
 * handle suggest switch click
 */
function handleSuggestSwitchClick() {
  clearSelection()
  suggestionsWrapper.classList.toggle('hidden')
  displaySuggestions()
}

/**
 * Handle shopping form submit
 */
function handleShoppingFormSubmit(e) {
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
  } else {
    // new item is added
    if (shoppingListEl.has(value)) {
      setMessage('Already in list')
      return
    }

    addShoppingItemToList(value, 'top')
  }
  shoppingListEl.dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Handle key up event in shopping input
 */
function handleShopInputKeyUp() {
  suggestAutoComplete.innerHTML = ''
  if (shoppingInput.value.trim() === '') {
    shoppingInput.dataset.index = ''
    document
      .querySelectorAll('i.fa-trash')
      .forEach((el) => el.classList.add('hidden'))
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
  let values = shoppingListEl.getTitles()
  state.add('shopping-list', values)

  try {
    const { status, message } = await postWebAppJson(
      `${state.getWebAppUrl()}/shopping/update`,
      {
        value: values.join(','),
      }
    )
    if (status !== 200) {
      setMessage(message)
      console.warn(message)
      if (retryTimeout >= 200) {
        retryTimeout = 10
        console.warn(
          'handleShoppingListChange: server keeps failing. Aborting.'
        )
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
 * Handle shopping item trash click
 */
function handleShoppingTrashClick(e) {
  e.stopPropagation()
  clearSelection()
  displaySuggestions()
  e.target.closest('.super-list-item').remove()
  shoppingListEl.dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Handle suggestion plus click
 */
function handleSuggestionPlusClick(e) {
  const el = e.target.closest('.super-list-item')
  addShoppingItemToList(el.getTitle(), 'top')
  el.remove()
  document.querySelector('#suggest-auto-complete').classList.add('hidden')
  // on mobile, the next fa-plus "inherits" a hover state
  // so remove it
  const els = document.querySelectorAll('.super-list-item .fa-plus')
  els.forEach((el) => el.blur())
  clearSelection()
  document
    .querySelector('#shopping-list')
    .dispatchEvent(new CustomEvent('list-changed'))
}

/**
 * Handle suggestion trash click
 */
function handleSuggestionTrashClick(e) {
  const div = e.target.closest('.super-list-item')
  const value = div.textContent.trim()
  div.remove()
  const suggestions = state.delete('suggestions', value)
  // clearSelection()
  postWebAppJson(`${state.getWebAppUrl()}/shopping/suggestions/update`, {
    value: suggestions.join(','),
  })
}

// ------------------------
// Helpers
// ------------------------

/**
 * Set recipe event listeners
 */
async function initShopping(shoppingStr, suggestionsStr) {
  const shoppingArr = shoppingStr.split(',').filter((el) => el.length)
  const suggestionsArr = suggestionsStr.split(',').filter((el) => el.length)
  state.set('shopping-list', shoppingArr)
  state.set('suggestions', suggestionsArr)
  shoppingListEl.setSilent(true)
  for (const item of shoppingArr) {
    addShoppingItemToList(item)
  }
  shoppingListEl.setSilent(false)
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

  // switches
  const switchWrapper = document.querySelector('#top-switches-wrapper')
  sortSwitch = createSwitch({ id: 'sort-switch' })
  sortSwitch.addEventListener('click', handleSortSwitchClick)
  let field = createField({
    element: sortSwitch,
    label: 'Sort',
    labelPosition: 'left',
  })
  switchWrapper.appendChild(field)

  suggestSwitch = createSwitch({ id: 'suggest-switch' })
  suggestSwitch.addEventListener('click', handleSuggestSwitchClick)
  field = createField({
    element: suggestSwitch,
    label: 'Suggest',
    labelPosition: 'left',
  })
  switchWrapper.appendChild(field)

  // create shopping form
  const shoppingFormEl = createFormHorizontal({
    formId: 'shopping-form',
    inputType: 'text',
    inputName: 'add-item-input',
    inputPlaceholder: 'Add item',
    inputAutoComplete: 'off',
    iClass: 'fa-carrot',
    submitText: 'ADD',
  })
  formWrapper.prepend(shoppingFormEl)
  shoppingInput = shoppingFormEl.querySelector('input')
  shoppingInput.focus()

  suggestAutoComplete = document.querySelector('#suggest-auto-complete')

  /* when shopping input key is pressed */
  shoppingInput.addEventListener('keyup', handleShopInputKeyUp)

  /* when shopping form is submitted */
  shoppingFormEl.addEventListener('submit', (e) =>
    handleShoppingFormSubmit(e, 'prepend')
  )

  // shopping-list
  shoppingListEl = createSuperList({
    id: 'shopping-list',
    className: 'main-super-list-wrapper',
    draggable: true,
    emptyState: 'Nothing to buy, chef 👨‍🍳',
    onChange: handleShoppingListChange,
  })
  shoppingWrapper.appendChild(shoppingListEl)

  // suggestions
  suggestionsEl = createSuperList({
    id: 'suggestions-list',
    draggable: false,
  })
  suggestionsWrapper.appendChild(suggestionsEl)
}

/**
 * Create a shopping suggestion element
 */
function createShoppingSuggestion({
  title,
  selected = false,
  editable = true,
}) {
  const suggestion = createSuperListItem({
    title,
    editable,
    selected,
    textColor: 'var(--gray6)',
    bgColor: 'var(--teal2)',
    children: [
      createIcon({
        className: 'fa-plus hidden',
        onClick: handleSuggestionPlusClick,
      }),
      createIcon({
        className: 'fa-trash hidden',
        onClick: handleSuggestionTrashClick,
      }),
    ],
  })
  return suggestion
}

/**
 * Add shopping item to list
 */
function addShoppingItemToList(text, pos) {
  const shoppingItem = createSuperListItem({
    title: (text || '').trim().toLowerCase(),
    textColor: 'var(--purple3)',
    bgColor: 'var(--purple3)',
    children: [
      createIcon({
        className: 'fa-trash hidden',
        onClick: handleShoppingTrashClick,
      }),
    ],
  })
  shoppingListEl.addChild(shoppingItem, pos)
}

/**
 * Display a list of suggestions
 */
function displaySuggestions() {
  let suggestions = state.get('suggestions')
  if (!suggestions) {
    suggestions = ['apples', 'carrots', 'berries']
  }
  suggestionsEl.innerHTML = ''
  const shoppingItems = shoppingListEl.getTitles()

  suggestions = suggestions.filter((s) => !shoppingItems.includes(s))
  suggestions.sort()
  for (const title of suggestions) {
    const child = createShoppingSuggestion({ title, selected: false })
    suggestionsEl.appendChild(child)
  }
}

/**
 *
 */
function populateShopAutoComplete() {
  if (!shoppingInput.value) {
    return
  }
  const q = shoppingInput.value.toLowerCase().trim()
  const items = state.get('shopping-list')
  let suggests = state.get('suggestions')
  suggests = suggests.filter((s) => !items.includes(s))
  suggests = suggests.filter((s) => s.includes(q))

  const autoCompleteEl = document.querySelector('#suggest-auto-complete')

  if (suggests.length === 0) {
    autoCompleteEl.classList.add('hidden')
    return
  }
  autoCompleteEl.classList.remove('hidden')
  for (const title of suggests) {
    const div = createShoppingSuggestion({
      title,
      editable: false,
      selected: true,
    })
    suggestAutoComplete.appendChild(div)
  }
}

/**
 *
 */
function clearSelection() {
  shoppingInput.value = ''
  shoppingInput.dataset.index = ''
  suggestAutoComplete.innerHTML = ''
  shoppingListEl.reset()
}
