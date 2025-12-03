import { injectStyle } from '../js/ui.js'
import { createDiv } from '../partials/div.js'
import { createButton } from '../partials/button.js'

const css = `
.button-group {
  display: flex;
  flex: 0 0 auto;           /* don’t shrink */
  gap: 4px;
  align-items: center;
}
.button-group-button {
  background-color: transparent;
}
.button-group-button.active {
  background-color: var(--purple3);
}
`

export function createButtonGroup({ id, className, buttons } = {}) {
  injectStyle(css)

  className = `button-group ${className || ''}`.trim()
  const el = createDiv({ className, id })

  build({ el, buttons })
  listen(el)

  return el
}

function build({ el, buttons }) {
  for (const { id, html } of buttons) {
    el.appendChild(createButton({ className: 'button-group-button', id, html }))
  }
}

function listen(el) {
  el.querySelectorAll('.button-group-button').forEach((btn) =>
    btn.addEventListener('click', (e) => handleButtonClick(e, el))
  )
}

function handleButtonClick(e, el) {
  const target = e.target
  const activeButton = el.querySelector(`.button-group-button.active`)
  if (target === activeButton) return
  if (activeButton) activeButton.classList.remove('active')
  target.classList.add('active')
}
