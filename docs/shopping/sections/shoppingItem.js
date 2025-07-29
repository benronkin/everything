import { injectStyle } from '../../assets/js/ui.js'
import { insertHtml } from '../../assets/js/format.js'
import { createListItem } from '../../assets/partials/listItem.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'
import { createDiv } from '../../assets/partials/div.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

export function shoppingItem({ item }) {
  injectStyle(css)

  if (!item) throw new Error('Oops, you did not pass item as an object prop')

  const el = createListItem({
    html: [
      createDiv({
        className: 'flex w-100',
        html: [
          createSpan({ className: 'title', html: item }),
          createDiv({
            className: 'icons',
            html: [
              createIcon({
                classes: { primary: 'fa-sort', other: ['hidden'] },
              }),
              createIcon({
                classes: { primary: 'fa-lightbulb', other: ['hidden'] },
              }),
              createIcon({
                classes: { primary: 'fa-trash', other: ['hidden'] },
              }),
            ],
          }),
        ],
      }),
    ],
  })

  react(el)
  listen(el)

  el.classList.add('draggable-target')
  el.setDraggable = setDraggable.bind(el)

  return el
}

function react(el) {
  state.on('icon-click:sort-icon', 'shoppingItem', () =>
    handleToolbarSortClick(el)
  )
}

function listen(el) {
  el.addEventListener('click', () => handleShoppingItemClick(el))
  el.querySelector('.fa-trash').addEventListener('click', () =>
    handleTrashClick(el)
  )
  el.querySelector('.fa-lightbulb').addEventListener('click', (e) => {
    e.stopPropagation()
    handleAddToSuggestionsClick(el)
  })
}

// -------------------------------
// Handlers
// -------------------------------

function handleToolbarSortClick(el) {
  const isSorting = document
    .getElementById('sort-icon')
    .classList.contains('primary')
  el.setDraggable(isSorting)
}

function handleShoppingItemClick(el) {
  if (!el.classList.contains('active')) return

  const item = el.querySelector('span').textContent
  const isIncluded = state.get('suggestions-list').includes(item)
  el.querySelector('.fa-lightbulb').classList.toggle('hidden', isIncluded)
}

function handleTrashClick(el) {
  state.set('item-click:delete-item', {
    id: el.id,
    item: el.querySelector('span').textContent,
  })
}

function handleAddToSuggestionsClick(el) {
  const item = el.querySelector('.title').innerHTML
  const suggestions = state.get('suggestions-list')
  if (suggestions.includes(item)) return
  suggestions.push(item)
  suggestions.sort()
  state.set('suggestions-list', [...suggestions])
  el.querySelector('.fa-lightbulb').classList.add('hidden')
}

function setDraggable(isDraggable) {
  this.draggable = isDraggable

  this.classList.remove('active')
  this.classList.toggle('draggable-target', isDraggable)
  this.querySelector('.fa-sort').classList.toggle('hidden', !isDraggable)
  this.querySelector('.fa-trash').classList.add('hidden')
  this.querySelector('.fa-lightbulb').classList.add('hidden')
}
