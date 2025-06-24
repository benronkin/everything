import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createIcon } from '../partials/icon.js'
import { createPopup } from '../partials/popup.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

const css = `
.rich-text-editor .rte-toolbar {
  border: none;
  background-color: #050005;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  padding: 10px;
  display: flex;
  gap: 10px;
}
.rich-text-editor .rte-editor {
  background-color: var(--gray1);
  padding: 10px;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
.rich-text-editor .rte-editor:focus {
  outline: none;
}
.rich-text-editor .rte-editor div[data-indent], 
.rich-text-editor .rte-editor li[data-indent]{
  padding-left: calc(var(--indent, 0) * 2ch);
}
.rich-text-editor .rte-editor ol, 
.rich-text-editor .rte-editor ul {
  margin-left: 10px;
}
.rich-text-editor .rte-editor ul {
  list-style-type: disc;
}
.rich-text-editor .rte-editor li[data-indent] {
  list-style-position: outside;
  margin-left: calc(var(--indent, 0) * 2ch);
  padding-left: 0;
}
`

export function createRichTextEditor({
  className = '',
  html = '<div><br></div>',
}) {
  injectStyle(css)

  const el = createDiv({ className: 'rich-text-editor' })

  build(el)
  listen(el)

  for (const c of className.split(' ')) {
    el.classList.add(c)
  }

  const editorEl = el.querySelector('.rte-editor')
  editorEl.contentEditable = true
  editorEl.insertHtml(html)
  return el
}

function build(el) {
  const toolbarEl = createDiv({ className: 'rte-toolbar' })
  el.appendChild(toolbarEl)
  const icons = ['fa-list-ul', 'fa-list-ol', 'fa-heading']
  for (const icon of icons) {
    toolbarEl.appendChild(createIcon({ classes: { primary: icon } }))
  }

  el.appendChild(createDiv({ className: 'rte-editor' }))
  el.appendChild(createPopup())
}

function listen(el) {
  const editorEl = el.querySelector('.rte-editor')

  editorEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleEnter()
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      if (e.shiftKey) {
        handleShiftTab()
      } else {
        handleTab()
      }
      return
    }
  })

  editorEl.addEventListener('keyup', (e) => {
    if (e.key === 'Backspace') {
      handleBackspace(editorEl)
    }
  })

  const tb = el.querySelector('.rte-toolbar')
  tb.querySelector('.fa-list-ul').addEventListener('click', () =>
    handleList('UL')
  )

  tb.querySelector('.fa-list-ol').addEventListener('click', () =>
    handleList('OL')
  )

  tb.querySelector('.fa-heading').addEventListener('click', handleHeading)
}

function handleEnter() {
  const node = getCaretNode()
  if (!node) return

  const li = node.closest('li')
  if (li) return handleEnterInLi(li)

  const div = node.closest('div')
  if (div) return handleEnterInDiv(div)
}

function getCaretNode() {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return null

  const range = sel.getRangeAt(0)
  return range.startContainer.nodeType === Node.ELEMENT_NODE
    ? range.startContainer
    : range.startContainer.parentElement
}

function handleEnterInLi(li) {
  const isEmpty = li.innerHTML.trim() === '' || li.innerHTML === '<br>'
  const list = li.closest('ul, ol')
  if (!list) return

  if (isEmpty) {
    const newDiv = document.createElement('div')
    newDiv.appendChild(document.createElement('br'))

    li.remove()
    list.insertAdjacentElement('afterend', newDiv)
    placeCaretInside(newDiv)
    return
  }

  const newLi = document.createElement('li')
  newLi.appendChild(document.createElement('br'))
  li.insertAdjacentElement('afterend', newLi)
  placeCaretInside(newLi)
}

function handleEnterInDiv(div) {
  const newDiv = document.createElement('div')
  newDiv.appendChild(document.createElement('br'))
  div.insertAdjacentElement('afterend', newDiv)
  placeCaretInside(newDiv)
}

function handleTab() {
  const node = getCaretNode()
  if (!node) return

  const block = node.closest('div, li')
  if (!block) return

  const level = parseInt(block.dataset.indent || '0', 10)
  block.dataset.indent = level + 1
  block.style.setProperty('--indent', level + 1)
}

function handleShiftTab() {
  const node = getCaretNode()
  if (!node) return

  const block = node.closest('div, li')
  if (!block) return

  const level = parseInt(block.dataset.indent || '0', 10)
  const nextLevel = Math.max(0, level - 1)

  block.dataset.indent = nextLevel
  block.style.setProperty('--indent', nextLevel)
}

function handleBackspace(el) {
  if (
    el.childNodes.length === 0 ||
    el.innerHTML === '' ||
    el.innerHTML === '<br>' ||
    el.innerHTML === '<div><br></div>'
  ) {
    el.innerHTML = ''
    const newDiv = document.createElement('div')
    newDiv.appendChild(document.createElement('br'))
    el.appendChild(newDiv)
    placeCaretInside(newDiv)
  }
}

function placeCaretInside(node) {
  const range = document.createRange()
  range.setStart(node, 0)
  range.collapse(true)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

function getSurroundingElement(tagName = 'div') {
  const selection = window.getSelection()
  if (!selection || !selection.rangeCount) return

  const range = selection.getRangeAt(0)
  const node =
    range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer
      : range.startContainer.parentElement

  const currentBlock = node?.closest(tagName)
  if (!currentBlock) return

  return currentBlock
}

function handleList(tagName) {
  const div = getSurroundingElement('div')
  if (!div) return

  const parent = div.parentElement
  if (parent?.nodeName === tagName || div.nodeName === 'LI') return

  const content = div.innerHTML
  const li = document.createElement('li')
  li.innerHTML = content

  const prev = div.previousElementSibling
  const next = div.nextElementSibling

  if (prev?.nodeName === tagName) {
    prev.appendChild(li)
    div.remove()
  } else if (next?.nodeName === tagName) {
    next.insertBefore(li, next.firstChild)
    div.remove()
  } else {
    const ul = document.createElement(tagName)
    ul.appendChild(li)
    div.replaceWith(ul)
  }
  placeCaretInside(li)
}

function handleHeading(e) {
  const btn = e.target
  const rect = btn.getBoundingClientRect()

  const popup = document.querySelector('.rich-text-editor .popup')
  popup.insertHtml(
    `<ul>
      <li value="h3">H3</li>
      <li value="h4">H4</li>
      <li value="h5">H5</li>
      <li value="h6">H6</li>
      <li value="normal">Normal</li>
    </ul>`
  )

  popup.querySelectorAll('li').forEach((li) =>
    li.addEventListener('click', () => {
      const heading = li.getAttribute('value')
      const node = getCaretNode()
      if (!node) return

      const block = node.closest('div, h1, h2, h3, h4, h5, h6')
      if (!block) return

      const replacement =
        heading === 'normal'
          ? document.createElement('div')
          : document.createElement(heading)

      replacement.innerHTML = block.innerHTML
      block.replaceWith(replacement)
      placeCaretInside(replacement)

      popup.classList.add('hidden')
    })
  )

  popup.style.top = `${rect.bottom + 5 + window.scrollY}px`
  popup.style.left = `${rect.left + window.scrollX}px`
  popup.classList.toggle('hidden')
}
