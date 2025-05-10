import { injectStyle } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.super-list-item {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 10px 14px;
  margin-bottom: 8px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background 0.2s ease, transform 0.1s ease;
}
.drag-container {
  margin-top: 1rem;
}
.draggable-target[data-state="drag"], 
.draggable-target[data-state="drag"] .fa-bars {
  cursor: move;
}
`

const html = `
  <span></span>
  <input type="text" class="hidden" />
  <div class="i-box">
    <i class="fa-solid fa-bars hidden"></i>
  </div>
`

// -------------------------------
// Exported functions
// -------------------------------

/**
 *
 */
export function createSuperListItem(config) {
  injectStyle(css)
  return createElement(config)
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 *
 */
function handleClick(e) {
  const div = e.target.closest('.super-list-item')
  if (!div) {
    console.log('handleClick: no div')
    return
  }

  if (div.dataset.state === 'drag') {
    return
  }

  if (div.dataset.selected !== 'true') {
    div.select()
  } else {
    div.unselect()
  }

  // notify superList of the click
  const event = new CustomEvent('super-list-item-clicked', {
    bubbles: true,
    detail: {
      id: div.id,
      checked: div.dataset.checked,
      el: div,
      value: div.innerText.trim(),
    },
  })

  div.dispatchEvent(event)

  if (div._onClick) {
    div._onClick()
  }
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function createElement({
  draggable: canDrag = true,
  text,
  selected,
  bgColor,
  textColor,
  onClick,
  children = [],
  id,
}) {
  const div = document.createElement('div')
  div.classList.add('super-list-item')
  if (canDrag) {
    div.classList.add('draggable-target')
  }
  div.setAttribute('id', id || generateUUID())
  div.innerHTML = html
  div._onClick = onClick

  div.querySelector('span').textContent = (text || '')
    .toString()
    .trim()
    .toLowerCase()

  for (const child of children) {
    div.querySelector('.i-box').appendChild(child)
  }

  if (bgColor) {
    div.dataset.bgColor = bgColor
    div.dataset.textColor = textColor
    div.addEventListener('mouseenter', () => {
      if (div.dataset.selected !== 'true' && div.dataset.state !== 'drag') {
        div.style.backgroundColor = bgColor
      }
    })
    div.addEventListener('mouseleave', () => {
      if (div.dataset.selected !== 'true' && div.dataset.state !== 'drag') {
        div.style.backgroundColor = ''
      }
    })
  }

  div.addEventListener('click', handleClick)

  div.enableClick = enableClick.bind(div)
  div.enableDrag = enableDrag.bind(div)
  div.select = select.bind(div)
  div.unselect = unselect.bind(div)

  if (selected) {
    div.select()
  }
  return div
}

/**
 *
 */
function enableClick() {
  this.dataset.state = 'click'
  this.setAttribute('draggable', 'false')
  this.querySelector('i.fa-bars').classList.add('hidden')
}

/**
 *
 */
function enableDrag() {
  this.dataset.state = 'drag'
  this.setAttribute('draggable', 'true')
  this.querySelector('i.fa-bars').classList.remove('hidden')
}

/**
 *
 */
function select() {
  this.dataset.selected = 'true'
  this.style.color = this.dataset.textColor
  this.style.backgroundColor = this.dataset.bgColor

  // don't show icons in drag mode
  if (this.dataset.mode === 'drag') {
    return
  }

  this.querySelectorAll('i:not(.fa-bars)').forEach((i) =>
    i.classList.remove('hidden')
  )
}

/**
 *
 */
function unselect() {
  this.dataset.selected = 'false'
  this.style.color = ''
  this.style.backgroundColor = ''

  this.querySelectorAll('i:not(.fa-bars)').forEach((i) =>
    i.classList.add('hidden')
  )
}

/**
 * Create a uuid
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
