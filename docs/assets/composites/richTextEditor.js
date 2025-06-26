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
.rich-text-editor pre {
  background: #121212;
  color: #f8f8f2;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  font-family: Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 10px 0;
}
.rich-text-editor code {
  display: block;
  white-space: pre;
  min-height: 22.4px;
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
  const icons = ['fa-list-ul', 'fa-list-ol', 'fa-heading', 'fa-code']
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
  const editor = el.querySelector('.rte-editor')

  tb.querySelectorAll('.fa-solid').forEach((el) =>
    el.addEventListener('mousedown', () => {
      const sel = window.getSelection()

      if (!sel || !sel.rangeCount) {
        const node = editor.firstElementChild
        placeCaretInside(node)
      }
      el._selectedRange = sel.getRangeAt(0).cloneRange()
    })
  )

  tb.querySelector('.fa-list-ul').addEventListener('click', () =>
    handleList('UL')
  )

  tb.querySelector('.fa-list-ol').addEventListener('click', () =>
    handleList('OL')
  )

  tb.querySelector('.fa-heading').addEventListener('click', handleHeading)

  tb.querySelector('.fa-code').addEventListener('click', handleCode)
}

function handleEnter() {
  const node = getCaretNode()
  if (!node) return

  if (node.closest('code')) return handleEnterInCode()

  const li = node.closest('li')
  if (li) return handleEnterInLi(li)

  const div = node.closest('div')
  if (div) return handleEnterInDiv(div)
}

function getCaretNode() {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) {
    return getLastEditorElement()
  }

  let node = sel.focusNode
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement
  }

  const editor = document.querySelector('.rte-editor')
  if (!editor.contains(node)) {
    return getLastEditorElement()
  }

  return node
}

function getLastEditorElement() {
  const editor = document.querySelector('.rte-editor')
  return editor.lastElementChild
}

function handleEnterInCode() {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return

  const range = sel.getRangeAt(0)
  range.deleteContents()

  const br = document.createTextNode('\n')
  range.insertNode(br)

  // move caret after the \n
  range.setStartAfter(br)
  range.collapse(true)

  sel.removeAllRanges()
  sel.addRange(range)
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
  const sel = window.getSelection()
  const range = sel.getRangeAt(0)

  const atStart =
    range.startOffset === 0 && range.startContainer === div.firstChild

  const newDiv = document.createElement('div')
  newDiv.appendChild(document.createElement('br'))

  if (atStart) {
    div.insertAdjacentElement('beforebegin', newDiv)
    placeCaretInside(div)
  } else {
    div.insertAdjacentElement('afterend', newDiv)
    placeCaretInside(newDiv)
  }
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
}

function handleList(tagName) {
  const node = getCaretNode()
  if (!node) return

  const div = node.closest('div')
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

      const sel = window.getSelection()
      const toolbarBtn = document.querySelector('.fa-heading')
      const savedRange = toolbarBtn._selectedRange

      sel.removeAllRanges()
      sel.addRange(savedRange)

      const node =
        savedRange.startContainer.nodeType === Node.ELEMENT_NODE
          ? savedRange.startContainer
          : savedRange.startContainer.parentElement

      const block = node.closest('div, h1, h2, h3, h4, h5, h6')
      if (!block) return

      const replacement =
        heading === 'normal'
          ? document.createElement('div')
          : document.createElement(heading)

      while (block.firstChild) {
        replacement.appendChild(block.firstChild)
      }

      block.replaceWith(replacement)
      placeCaretInside(replacement)

      popup.classList.add('hidden')
    })
  )

  popup.style.top = `${rect.bottom + 5 + window.scrollY}px`
  popup.style.left = `${rect.left + window.scrollX}px`
  popup.classList.toggle('hidden')
}

function handleCode(e) {
  const btn = e.target
  const rect = btn.getBoundingClientRect()

  const popup = document.querySelector('.rich-text-editor .popup')
  popup.insertHtml(
    `<ul>
      <li value="javascript">Javascript</li>
      <li value="html">HTML</li>
      <li value="css">CSS</li>
      <li value="json">JSON</li>
      <li value="bash">Bash</li>
    </ul>`
  )

  popup.querySelectorAll('li').forEach((li) =>
    li.addEventListener('click', () => {
      const language = li.getAttribute('value')

      const sel = window.getSelection()
      const toolbarBtn = document.querySelector('.fa-code')
      const savedRange = toolbarBtn._selectedRange

      sel.removeAllRanges()
      sel.addRange(savedRange)

      const node = getCaretNode()
      console.log('node', node)
      const replacement = node.closest('.rte-editor > *')

      const preEl = document.createElement('pre')
      const codeEl = document.createElement('code')
      codeEl.className = `language-${language}`
      preEl.appendChild(codeEl)

      replacement.replaceWith(preEl)

      placeCaretInside(codeEl)

      popup.classList.add('hidden')
    })
  )

  popup.style.top = `${rect.bottom + 5 + window.scrollY}px`
  popup.style.left = `${rect.left + window.scrollX}px`
  popup.classList.toggle('hidden')
}

function getTopBlock(node) {
  const editor = document.querySelector('.rte-editor')
  while (node && node.parentElement !== editor) {
    node = node.parentElement
  }
  return node
}
