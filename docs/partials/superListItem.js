import { injectStyle, resizeTextarea } from '../js/ui.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.super-list-item[data-state="drag"] {
  cursor: move;
}
.super-list-item input,
.super-list-item textarea {
  cursor: pointer;
  color: inherit;
}
.super-list-item textarea {
  min-height: 25px;
  padding: 4px;
  margin: 0;
}
.super-list-item .details {
  height: fit-content;
  margin-top: 15px;
}
.super-list-item .icons {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}
.super-list-item[data-state="drag"] input[name="title"],
.super-list-item.not-editable input[name="title"] {
  pointer-events: none;
  border: none;
  background: transparent;
  color: inherit;
  cursor: default;
  text-decoration: none;
}
`

const html = `
  <div class="header">
    <input type="text" name="title" />
    <input type="text" class="hidden" />
    <div class="icons">
      <i class="fa-solid fa-bars hidden"></i>
    </div>
  </div>
  <div class="details hidden">
    <textarea name="details"></textarea>
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
 * Handle click on the item
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
  this.dispatch('super-list-item-clicked', {
    selected: div.dataset.selected,
    title: div.querySelector('[name="title"]').value.trim(),
    details: div.querySelector('[name="details"]').value.trim(),
  })

  // div.dispatchEvent(event)

  if (div._onClick) {
    div._onClick()
  }
}

/**
 * When user edits the title
 */
function handleTitleInputChange(e) {
  const div = e.target.closest('.super-list-item')
  div.dispatch('list-changed', {
    action: 'update-task',
    targetId: div.dataset.id,
    title: e.target.value,
  })
}

/**
 *
 */
function handleDetailsInputChange(e) {
  const div = e.target.closest('.super-list-item')
  div.dispatch('list-changed', {
    action: 'update-task',
    targetId: div.dataset.id,
    details: e.target.value,
  })
}

// -------------------------------
// Object methods
// -------------------------------

/**
 * Dispatch a custom event
 */
function dispatch(eventName, detail = {}) {
  detail.target = this
  detail.dispatcherId = this.dataset.id
  const event = new CustomEvent(eventName, {
    bubbles: true,
    detail,
  })

  this.dispatchEvent(event)
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
  this.unselect()
  this.dataset.state = 'drag'
  this.setAttribute('draggable', 'true')
  this.querySelectorAll('i').forEach((i) => i.classList.add('hidden'))
  this.querySelector('i.fa-bars').classList.remove('hidden')
}

/**
 *
 */
function getData() {
  const obj = {
    id: this.dataset.id,
    title: this.querySelector('[name="title"]').value.trim(),
    details: this.querySelector('[name="details"]').value.trim(),
  }
  return obj
}

/**
 *
 */
function getDetails() {
  const obj = this.getData()
  return obj.details
}

/**
 *
 */
function getId() {
  const obj = this.getData()
  return obj.id
}

/**
 *
 */
function getTitle() {
  const obj = this.getData()
  return obj.title
}

/**
 *
 */
function isSelected() {
  return this.dataset.selected === 'true'
}

/**
 *
 */
function select() {
  this.dataset.selected = 'true'
  this.style.color = this.dataset.bgColor
  this.style.borderColor = this.dataset.bgColor
  this.querySelectorAll('i').forEach(
    (i) => (i.style.color = this.dataset.bgColor)
  )

  // don't show icons in drag mode
  if (this.dataset.mode === 'drag') {
    return
  }

  this.querySelectorAll('i:not(.fa-bars)').forEach((i) =>
    i.classList.remove('hidden')
  )

  if (this._showDetails) {
    this.querySelector('.details').classList.remove('hidden')

    const detailsTA = this.querySelector('[name="details"]')
    detailsTA.classList.remove('hidden')
    resizeTextarea(detailsTA)
  }
  this.querySelector('[name="title"]').focus()
}

/**
 *
 */
function unselect() {
  this.dataset.selected = 'false'
  this.style.color = ''
  this.style.backgroundColor = ''
  this.style.borderColor = ''

  this.querySelectorAll('i').forEach((i) => {
    i.style.color = ''
  })

  this.querySelectorAll('i:not(.fa-bars)').forEach((i) => {
    i.classList.add('hidden')
  })

  if (this._showDetails) {
    this.querySelector('.details').classList.add('hidden')
    this.querySelector('[name="details"]').classList.add('hidden')
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
  title,
  details,
  editable = true,
  selected,
  bgColor,
  textColor,
  onClick,
  children = [],
  showDetails = false,
  id,
}) {
  const div = document.createElement('div')
  div.classList.add('super-list-item')
  if (canDrag) {
    div.classList.add('draggable-target')
  }
  if (!editable) {
    div.classList.add('not-editable')
  }
  div.dataset.id = id || generateUUID()
  div.innerHTML = html
  div._onClick = onClick

  let titleInput = div.querySelector('[name="title"]')
  titleInput.value = (title || '').toString().trim()
  titleInput.addEventListener('change', handleTitleInputChange)

  for (const child of children) {
    div.querySelector('.icons').appendChild(child)
  }

  if (bgColor) {
    div.dataset.bgColor = bgColor
    div.dataset.textColor = textColor
    div.addEventListener('mouseenter', () => {
      if (div.dataset.selected !== 'true' && div.dataset.state !== 'drag') {
        div.style.borderColor = bgColor
        div.style.color = bgColor
        div.querySelectorAll('i').forEach((i) => (i.style.color = bgColor))
      }
    })
    div.addEventListener('mouseleave', () => {
      if (div.dataset.selected !== 'true' && div.dataset.state !== 'drag') {
        div.style.borderColor = ''
        div.style.color = ''
        div.querySelectorAll('i').forEach((i) => (i.style.color = ''))
      }
    })
  }

  div.addEventListener('click', handleClick)

  if (showDetails) {
    const detailsTA = div.querySelector('[name="details"]')
    detailsTA.value = (details || '').toString().trim()

    detailsTA.addEventListener('change', handleDetailsInputChange)

    div._showDetails = showDetails
    div
      .querySelector('.details')
      .addEventListener('click', (e) => e.stopPropagation())
  }

  div.dispatch = dispatch.bind(div)
  div.enableClick = enableClick.bind(div)
  div.enableDrag = enableDrag.bind(div)
  div.getData = getData.bind(div)
  div.getId = getId.bind(div)
  div.getDetails = getDetails.bind(div)
  div.getTitle = getTitle.bind(div)
  div.isSelected = isSelected.bind(div)
  div.select = select.bind(div)
  div.unselect = unselect.bind(div)

  if (selected) {
    div.select()
  }
  return div
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
