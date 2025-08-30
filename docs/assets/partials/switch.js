import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { state } from '../js/state.js'

// -------------------------------
// Globals
// -------------------------------

const css = `
.switch {
  position: relative;
  width: 40px;
  height: 25px;
  border: 1px solid var(--gray3);
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 300ms ease;
}
.switch.on {
  background-color: var(--purple2)
}
.switch.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.thumb {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background-color: var(--gray4);
  border-radius: 50%;
  position: absolute;
  left: -1px;
  transition: left 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.switch.iconed .thumb {
  background: transparent;
}
.switch.disabled .thumb {
  background-color: var(--gray3);
}
.switch.on .thumb {
  left: 40%;
}
.thumb i {
  font-size: 0.75rem;
}
`

export function createSwitch({ id, name, iconOff, iconOn, className }) {
  injectStyle(css)

  const el = document.createElement('div')

  id && (el.id = id)
  name && (el.name = name)
  el.className = 'switch'
  if (className) {
    className.split(' ').forEach((c) => el.classList.add(c))
  }

  iconOff && (el._iconOff = iconOff)
  iconOn && (el._iconOn = iconOn)

  build({ el, iconOff })
  listen(el)

  Object.defineProperties(el, {
    value: {
      get() {
        return el.classList.contains('on')
      },
      set(v) {
        el.classList.toggle('on', v)
      },
    },
  })

  return el
}

function build({ el, iconOff }) {
  const divEl = createDiv({ className: 'thumb' })
  el.appendChild(divEl)

  const iconEl = createIcon()
  divEl.appendChild(iconEl)

  if (iconOff) {
    iconEl.className = iconOff
  }
}

function listen(el) {
  el.addEventListener('click', () => {
    if (el._iconOff) {
      el.querySelector('i').classList.toggle(el._iconOff)
      el.querySelector('i').classList.toggle(el._iconOn)
    }
    el.classList.toggle('on')
    state.set('field-changed', el)
  })
}
