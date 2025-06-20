import { injectStyle } from '../js/ui.js'
import { state } from '../js/state.js'
import { log } from '../js/logger.js'

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

export function createIcon({
  id = `i-${crypto.randomUUID()}`,
  classes,
  dataset = {},
  role,
} = {}) {
  injectStyle(css)

  const el = document.createElement('i')

  el.shake = shake.bind(el)

  el.id = id
  role && (el.role = role)
  for (const [k, v] of Object.entries(dataset)) {
    el.dataset[k] = v
  }

  handleClasses({ el, classes })

  listen(el)

  return el
}

function listen(el) {
  el.addEventListener('click', (e) => {
    // prevent icon parents from responding to these events
    // while listening for their own clicks
    e.stopPropagation()
    if (!el._classes) return
    if (el._classes.secondary) {
      el._onPrimaryClass = !el._onPrimaryClass
      el.classList.toggle(el._classes.primary)
      el.classList.toggle(el._classes.secondary)
    }

    const stateKey = `icon-click:${el.id}`
    state.set(stateKey, {
      id: el.id,
      className: el.classList.contains(el._classes.primary)
        ? el._classes.primary
        : el._classes.secondary,
    })

    if (el.dataset?.role) {
      state.set(`${el.dataset.role}-click`, {
        id: el.id,
        className: el.className,
      })
    }
  })
}

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

function shake() {
  this.classList.add('shake')
  setTimeout(() => this.classList.remove('shake'), 300)
  return
}
