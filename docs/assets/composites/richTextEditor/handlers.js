import { state } from '../../js/state.js'
import { getCaretNode, placeCaretInside, saveSelectedRange } from './helpers.js'

export function listen(el) {
  document.addEventListener('selectionchange', saveSelectedRange)

  const editorEl = el.querySelector('.rte-editor')

  editorEl.addEventListener('keydown', (e) => {
    console.log('e.key', e.key)
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

  tb.querySelectorAll('.fa-solid').forEach((el) =>
    el.addEventListener('mousedown', saveSelectedRange)
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

function handleEnterInCode() {
  const range = state.get('rte-saved-range')
  if (!range) return

  const br = document.createElement('br')
  const spacer = document.createTextNode('\u200B') // zero-width space to ensure height

  range.deleteContents()
  range.insertNode(br)
  br.parentNode.insertBefore(spacer, br.nextSibling)

  const sel = window.getSelection()
  sel.removeAllRanges()

  const newRange = document.createRange()
  newRange.setStart(spacer, 1)
  newRange.collapse(true)

  sel.addRange(newRange)
  saveSelectedRange()
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
  const range = state.get('rte-saved-range')

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

      const sel = state.get('rte-saved-range')
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

      const node = getCaretNode()

      // update language of existing code element
      if (node.tagName === 'CODE') {
        node.classList.forEach((cls) => {
          if (cls.startsWith('language-')) {
            node.classList.remove(cls)
          }
        })
        node.classList.add(`language-${language}`)
        popup.classList.add('hidden')
        return
      }

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
