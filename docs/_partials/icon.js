import { injectStyle } from '../_assets/js/ui.js'
import { newState } from '../_assets/js/newState.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
i {
  border-radius: var(--border-radius);
  cursor: pointer;
}
i:hover {
  color: var(--purple2);
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
  id = `i=${crypto.randomUUID()}`,
  classes = {},
} = {}) {
  injectStyle(css)

  const el = document.createElement('i')

  listen({ el, id, classes })

  el.shake = shake.bind(el)

  classes.other || (classes.other = ['fa-solid'])
  for (const c of classes.other) {
    el.classList.add(c)
  }
  el.classList.add(classes.primary)
  el._classes = classes
  el.role = 'button'
  el.tabIndex = 0

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function listen({ el, id, classes }) {
  el.addEventListener('click', () => {
    if (classes.secondary) {
      el._onPrimaryClass = !el._onPrimaryClass
      el.classList.toggle(el._classes.primary)
      el.classList.toggle(el._classes.secondary)
    }

    const stateKey = `icon-click:${id}`
    newState.set(stateKey, {
      id,
      className: el.classList.contains(el._classes.primary)
        ? el._classes.primary
        : el._classes.secondary,
    })
  })
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
