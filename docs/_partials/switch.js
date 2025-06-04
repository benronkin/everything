import { injectStyle } from '../_assets/js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'

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

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Constructor for the custom switch element
 */
export function createSwitch({
  id,
  iconOff,
  iconOn,
  events = { click: () => {} },
  className = '',
}) {
  injectStyle(css)

  const el = document.createElement('div')

  Object.defineProperties(el, {
    classes: {
      get() {
        return el.className
      },
      set(newValue = '') {
        el.className = `switch ${iconOff && 'iconed'} ${newValue}`.trim()
      },
    },
    dataId: {
      get() {
        return el.dataset.id
      },
      set(newValue = '') {
        el.id = newValue
        el.dataset.id = newValue
        el.dataset.testId = newValue
      },
    },
    disabled: {
      get() {
        return this.classList.includes('disabled')
      },
      set(v) {
        this.classList.toggle('disabled', v)
      },
    },
    value: {
      get() {
        return el.classList.contains('on')
      },
      set(newValue) {
        el.classList.toggle('on', newValue)
      },
    },
    toggle: {
      value: function () {
        el.classList.toggle('on', !el.value)
      },
    },
  })

  for (const [eventName, cb] of Object.entries(events)) {
    if (eventName === 'click') {
      el.addEventListener('click', () => {
        handleClick(el, cb)
      })
    } else {
      el.addEventListener(eventName, cb)
    }
  }

  addElementParts({ el, iconOff })

  el.dataId = id
  el.classes = className
  el._iconOff = iconOff
  el._iconOn = iconOn

  return el
}

// -------------------------------
// Event handlers
// -------------------------------

/**
 * Respond to switch clicks
 * @param {Function} cb - The consumer's callback to run
 */
function handleClick(el, cb) {
  el.toggle()

  if (el._iconOff) {
    el.querySelector('i').classList.toggle(el._iconOff)
    el.querySelector('i').classList.toggle(el._iconOn)
  }

  if (cb) {
    cb()
  }
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Create the HTML element
 */
function addElementParts({ el, iconOff }) {
  const divEl = createDiv({ className: 'thumb' })
  el.appendChild(divEl)

  const iconEl = createIcon()
  divEl.appendChild(iconEl)

  if (iconOff) {
    iconEl.className = iconOff
  }
}
