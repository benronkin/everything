import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
i {
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

}
i.shake {
  animation: shake-it 300ms ease;
}
@keyframes shake-it {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
`

// -------------------------------
// Exports
// -------------------------------

export function createIcon({
  id = `i-${crypto.randomUUID()}`,
  classes,
  role,
} = {}) {
  injectStyle(css)

  const el = document.createElement('i')

  el.shake = shake.bind(el)

  el.id = id
  el.dataset.id = id
  role && (el.role = role)

  handleClasses({ el, classes })

  listen(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function listen(el) {
  el.addEventListener('click', () => {
    if (el._classes.secondary) {
      el._onPrimaryClass = !el._onPrimaryClass
      el.classList.toggle(el._classes.primary)
      el.classList.toggle(el._classes.secondary)
    }

    const stateKey = `icon-click:${el.id}`
    newState.set(stateKey, {
      id: el.id,
      className: el.classList.contains(el._classes.primary)
        ? el._classes.primary
        : el._classes.secondary,
    })
  })
}

/**
 * Covert the object of classes to a string
 * and set as className
 * @param {Object} classes - must include classes.primary, may inclde classes.secondary (string), and/o classes.other (array)
 */
function handleClasses({ el, classes }) {
  if (!classes) {
    el.className = 'fa-solid'
    return
  }

  if (!classes.primary) {
    throw new Error(
      `Oops, button accepts a "classes" object with "primary" (required), "secondary", and "other" attributes`
    )
  }

  if (!classes.other) {
    classes.other = []
  }
  if (typeof classes.other === 'string') {
    classes.other = classes.other.split(' ')
  }

  const arr = [
    ...new Set(['fa-solid', classes.primary, ...classes.other]),
  ].join(' ')

  el.className = arr
  el._classes = classes
}

// -------------------------------
// Object methods
// -------------------------------

/**
 * Shake it, baby
 */
function shake() {
  this.classList.add('shake')
  setTimeout(() => this.classList.remove('shake'), 300)
  return
}
