import { state } from '../../js/state.js'

export function getCaretNode() {
  const savedRange = state.get('rte-saved-range')
  if (!savedRange) {
    return null
  }

  let node = savedRange.endContainer
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement
  }

  return node
}

export function placeCaretInside(node) {
  // create a new Range object, which represents a fragment of the document
  const range = document.createRange()
  // set the range start at the beginning of the node (offset 0)
  range.setStart(node, 0)
  // collapse the range to a single point (insertion point), removing any selection
  range.collapse(true)

  // get the current selection (the user's text selection or caret)
  const sel = window.getSelection()
  // clear any existing selection or caret from the document
  sel.removeAllRanges()
  // apply the newly created range — this places the caret inside the node
  sel.addRange(range)
  saveSelectedRange()
}

export function saveSelectedRange() {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return

  const range = sel.getRangeAt(0)
  const editor = document.querySelector('.rte-editor')

  if (editor.contains(range.commonAncestorContainer)) {
    state.set('rte-saved-range', range.cloneRange())
  }
}

export function getLastEditorElement() {
  const editor = document.querySelector('.rte-editor')
  return editor.lastElementChild
}

export function getTopBlock(node) {
  const editor = document.querySelector('.rte-editor')
  while (node && node.parentElement !== editor) {
    node = node.parentElement
  }
  return node
}
