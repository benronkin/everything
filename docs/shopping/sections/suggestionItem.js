import { injectStyle } from '../../_assets/js/ui.js'
import { insertHtml } from '../../_assets/js/format.js'
import { createListItem } from '../../_partials/listItem.js'
import { createIcon } from '../../_partials/icon.js'
import { createSpan } from '../../_partials/span.js'
import { createDiv } from '../../_partials/div.js'
import { newState } from '../../_assets/js/newState.js'
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
export function suggestionItem({ item }) {
  injectStyle(css)

  const el = createListItem({
    className: 'suggestion-item',
    html: [
      createDiv({
        className: 'flex w-100',
        html: [
          createSpan({ html: item }),
          createDiv({
            className: 'icons',
            html: [
              createIcon({
                classes: { primary: 'fa-trash' },
              }),
            ],
          }),
        ],
      }),
    ],
  })

  el.setDraggable = setDraggable.bind(el)

  // react(el)
  listen(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Set event handlers which can set state.
 */
function listen(el) {
  el.addEventListener('click', (e) => {
    if (e.target.closest('i')) return // ignore event bubbling

    newState.set('item-click:shop-suggestion', {
      id: el.id,
      item: el.querySelector('span').textContent,
    })
  })

  el.querySelector('.fa-trash').addEventListener('click', () =>
    newState.set('item-click:delete-suggestion', {
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
