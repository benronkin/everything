import { injectStyle } from '../../assets/js/ui.js'
import { createListItem } from '../../assets/partials/listItem.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createSpan } from '../../assets/partials/span.js'
import { createDiv } from '../../assets/partials/div.js'
import { state } from '../../assets/js/state.js'

const css = `
`

export function mainDocumentItem(item) {
  injectStyle(css)

  const { id, noteWorthy, title } = item

  const el = createListItem({
    id,
    className: 'shopping-item flex w-100',
    html: [
      createSpan({ className: 'title', html: title.toLowerCase() }),
      createDiv({
        className: 'icons',
        html: [
          createIcon({
            classes: { primary: 'fa-sort', other: ['hidden'] }
          }),
          createIcon({
            classes: { primary: 'fa-trash', other: ['hidden'] }
          }),
          createIcon({
            classes: {
              primary: 'fa-circle-info',
              other: [!noteWorthy && 'hidden']
            }
          })
        ]
      })
    ]
  })
  el.dataset.noteworthy = noteWorthy || ''

  listen(el)

  el.classList.add('draggable-target')
  el.setDraggable = setDraggable.bind(el)

  return el
}

function listen(el) {
  el.addEventListener('click', () => handlemainDocumentItemClick(el))
  el.querySelector('.fa-trash').addEventListener('click', () =>
    handleTrashClick(el)
  )
  el.querySelector('.fa-circle-info').addEventListener('click', () =>
    handleViewClick(el)
  )
}

function handlemainDocumentItemClick(el) {
  if (!el.classList.contains('active')) return
}

function handleTrashClick(el) {
  state.set('icon-click:delete-item', {
    id: el.id,
    title: el.querySelector('span').textContent
  })
}

/**
 *
 */
function handleViewClick(el) {
  const url = `./item.html?id=${el.id}`
  window.location.href = url
}

function setDraggable(isDraggable) {
  this.draggable = isDraggable

  this.classList.remove('active')
  this.classList.toggle('draggable-target', isDraggable)
  this.querySelector('.fa-sort').classList.toggle('hidden', !isDraggable)
  this.querySelector('.fa-trash').classList.add('hidden')
  this.querySelector('.fa-circle-info').classList.add('hidden')
}
