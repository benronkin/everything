import { injectStyle } from '../../_assets/js/ui.js'
import { insertHtml } from '../../_assets/js/format.js'
import { createListItem } from '../../_partials/listItem.js'
import { createIcon } from '../../_partials/icon.js'
import { createSpan } from '../../_partials/span.js'
import { createDiv } from '../../_partials/div.js'
import { state } from '../../_assets/js/state.js'
import { log } from '../../_assets/js/logger.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
`

// -------------------------------
// Exports
// -------------------------------

/**
 * Constuctor of a custom element
 */
export function shoppingItem({ item }) {
  injectStyle(css)

  const el = createListItem({
    html: [
      createDiv({
        className: 'flex w-100',
        html: [
          createSpan({ html: item }),
          createDiv({
            className: 'icons',
            html: [
              createIcon({
                classes: { primary: 'fa-sort', other: ['hidden'] },
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

  el.setDraggable = setDraggable.bind(el)

  react(el)
  listen(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Subscribe to state.
 */
function react(el) {
  state.on('icon-click:sort-icon', 'shoppingItem', () => {
    const isSorting = document
      .getElementById('sort-icon')
      .classList.contains('primary')
    el.setDraggable(isSorting)
  })
}

/**
 * Set event handlers which can set state.
 */
function listen(el) {
  el.querySelector('.fa-trash').addEventListener('click', () =>
    state.set('item-click:delete-item', {
      id: el.id,
      item: el.querySelector('span').textContent,
    })
  )
}

// -------------------------------
// Object methods
// -------------------------------

/**
 *
 */
function setDraggable(isDraggable) {
  this.classList.remove('active')
  this.classList.toggle('draggable-target', isDraggable)
  this.querySelector('.fa-sort').classList.toggle('hidden', !isDraggable)
  this.querySelector('.fa-trash').classList.add('hidden')
}
