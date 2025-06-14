import { state } from './state.js'

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function enableDragging(containerEl) {
  // clear prior event handlers
  enableClicking(containerEl)
  containerEl.classList.add('dragging-container')
  containerEl
    .querySelectorAll('.draggable-target')
    .forEach((elem) => makeElementDraggable(elem))

  containerEl.addEventListener('dragover', enableDragContainer)
  containerEl.addEventListener('touchmove', enableDragContainer)
}

/**
 *
 */
export function enableClicking(containerEl) {
  containerEl.classList.remove('dragging-container')
  containerEl
    .querySelectorAll('.draggable-target')
    .forEach((elem) => breakElementDraggable(elem))
  containerEl.removeEventListener('dragover', enableDragContainer)
  containerEl.removeEventListener('touchmove', enableDragContainer)
}

// -------------------------------
// Event handler functions
// -------------------------------

/**
 *
 */
function handleDragStart(e) {
  e.target.closest('.draggable-target').classList.add('dragging')
}

/**
 *
 */
function handleDragEnd(e) {
  const el = e.target.closest('.draggable-target')
  el.classList.remove('dragging')
  state.set('drag-end', { id: el.id })
}

// -------------------------------
// Helper functions
// -------------------------------

/**
 * Enable drag containers
 */
function enableDragContainer(e) {
  e.preventDefault()
  const draggedElem = document.querySelector('.dragging')
  const dragContainer = draggedElem.closest('.dragging-container')
  const afterElement = getAfterElement(
    dragContainer,
    e.clientY || e.touches[0].clientY
  )
  if (afterElement === null) {
    dragContainer.appendChild(draggedElem)
  } else {
    dragContainer.insertBefore(draggedElem, afterElement)
  }
}

/**
 * Make an existing DOM element draggable
 */
function makeElementDraggable(elem) {
  elem.addEventListener('dragstart', handleDragStart)
  elem.addEventListener('touchstart', handleDragStart)
  elem.addEventListener('dragend', handleDragEnd)
  elem.addEventListener('touchend', handleDragEnd)
}

/**
 * Break an existing DOM element draggable
 */
function breakElementDraggable(elem) {
  elem.removeEventListener('dragstart', handleDragStart)
  elem.removeEventListener('touchstart', handleDragStart)
  elem.removeEventListener('dragend', handleDragEnd)
  elem.removeEventListener('touchend', handleDragEnd)
}

/**
 *
 */
function getAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll('.draggable-target:not(.dragging)'),
  ]
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}
