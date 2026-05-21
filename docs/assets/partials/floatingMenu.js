import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createSpan } from './span.js'
import { state } from '../js/state.js'

const css = `
.floating-menu {
  position: absolute;
  z-index: 9999;
  margin: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--gray6);
  color: var(--gray0);
  border-radius: 3px;
}
.floating-menu span {
  padding: 7px;
  cursor: pointer;
  border-radius: 0;
}
.floating-menu span:hover {
  background-color: var(--gray5);
}
`
/**
 * Create a menu that is positioned next to its toggle element
 * Can be recreated upon click to many toggling elements
 * Controls its own show/hide
 * Sets a floating-menu-option-click state
 * @param {Object} obj
 * @param {string} obj.id - The id of the floating menu (optional)
 * @param {string} obj.classname - The classes for the floating menu
 * @param {number} obj.top - Vertical distance from the toggle
 * @param {number} obj.left - Horizontal distance from the toggle
 * @param {Object[]} obj.options - Array of ids and htmls
 * @param {string} obj.toggleId - The id of the external component that will toggle the component
 * USAGE:
  state.on('icon-click:add-task', 'project', () => {
    floatingMenu({
      id: 'add-task-floating-menu',
      options: [
        { id: 'abc123', html: 'Add new task' },
        { id: 'def456', html: 'Attach existing task' }
      ],
      toggleId: 'add-task'
    })
  })
 */
export function floatingMenu(obj) {
  const { className, id } = obj
  injectStyle(css)

  let el = document.getElementById(id)

  if (!el) {
    el = createDiv({ id, className })
    el.classList.add('floating-menu')
    document.querySelector('body').appendChild(el)
  }

  if (el.children.length) {
    el.innerHTML = ''
    return
  }

  build({ el, obj })
  listen({ el, obj })
}

/**
 *
 */
function build({ el, obj, top = 30, left = 30 }) {
  const { options, toggleId } = obj

  el.innerHTML = ''

  for (const { id, html } of options) {
    const optionEl = createSpan({ id, html })
    optionEl.addEventListener('click', () =>
      state.set('floating-menu-option-click', { id, html })
    )
    el.appendChild(optionEl)
  }

  const rect = document.getElementById(toggleId).getBoundingClientRect()

  if (top) el.style.top = `${rect.top + top + window.scrollY}px`
  if (left) el.style.left = `${rect.left - left + window.scrollX}px`
}

/**
 *
 */
function listen({ el, obj }) {
  window.addEventListener('click', (e) => {
    if (
      !e.target.closest('.floating-menu') &&
      !e.target.closest(`#${obj.toggleId}`)
    )
      el.innerHTML = ''
  })

  window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      el.innerHTML = ''
    }
  })
}
