import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createSpan } from './span.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

const css = `
.pill {
  display: inline-flex;
  align-items: center;
  gap: 4px; 
  padding: 2px 10px;
  margin: 2px;
  font-size: 0.8rem;
  border-radius: 9999px;
  background: var(--gray3);
  color: var(--white);
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
}
.pill.active {
  background: var(--pastel-green);
  color: var(--gray0);
}
.pill:not(.active):hover {
  background: var(--gray4);
}    
`

export function createPill({ id, classes, html, isSelected = false } = {}) {
  injectStyle(css)

  const el = createDiv({ id })

  build(el)
  react(el)
  listen(el)

  id && (el.id = id)
  classes?.pill && (el.className = `pill ${classes.pill}`.trim())
  classes?.span && el.querySelector('span').classList.add(classes.span)
  html && el.querySelector('span').insertHtml(html)

  el.toggle = toggle.bind(el)

  const iEl = el.querySelector('i')
  iEl.classList.add('hidden')
  classes?.icon && iEl.classList.add(classes.icon)
  el.dataset.selected = isSelected

  if (isSelected) el.toggle()

  return el
}

function build(el) {
  el.appendChild(createSpan())
  el.appendChild(createIcon())
}

function react(el) {
  // state.on('stateVar', 'subscriberName', (stateValue) => {})
}

function listen(el) {
  el.addEventListener('click', () => {
    el.toggle()
  })
}

function toggle() {
  this.toggleAttribute('data-selected')
  this.classList.toggle('active', this.dataset.selected)
  this.querySelector('i').classList.toggle('hidden', !this.dataset.selected)
}
