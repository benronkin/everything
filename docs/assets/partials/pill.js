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
  margin: 2px;
  font-size: 0.8rem;
  border-radius: 9999px;
  background: var(--gray2);
  color: var(--gray6);
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
  width: fit-content;
  padding: 2px 8px 2px 10px;
}
.pill span {
  margin: 0 20px 0 21px;
}
.pill.active {
  background: var(--pastel-green);
  color: var(--gray0);
}
.pill.active span {
  margin-left: 0px;
}
.pill:not(.active):hover {
  background: var(--gray3);
}    
`

export function createPill({
  id,
  classes,
  dataset = {},
  html,
  isSelected = false,
} = {}) {
  injectStyle(css)

  const el = createDiv({ id })

  build(el)
  react(el)
  listen(el)

  id && (el.id = id)
  el.className = `pill ${classes?.pill || ''}`.trim()
  classes?.span && el.querySelector('span').classList.add(classes.span)
  html && el.querySelector('span').insertHtml(html)

  const iEl = el.querySelector('i')
  iEl.classList.add('hidden')
  classes?.icon && iEl.classList.add(classes.icon)

  for (const [k, v] of Object.entries(dataset)) {
    el.dataset[k] = v
  }

  el.toggle = toggle.bind(el)

  if (isSelected) el.toggle()

  return el
}

function build(el) {
  el.appendChild(createIcon())
  el.appendChild(createSpan())
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
  const isSelected = this.toggleAttribute('data-selected')
  this.classList.toggle('active', isSelected)
  this.querySelector('i').classList.toggle('hidden', !isSelected)
}
