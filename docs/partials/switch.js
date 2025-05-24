import { injectStyle } from '../js/ui.js'

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

const html = `
<div class="thumb">
  <i class="fa-solid"></i>
</div>
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
  classList = [],
  events = {},
}) {
  injectStyle(css)

  const el = document.createElement('div')
  el.dataset.id = id

  for (const [eventName, cb] of Object.entries(events)) {
    if (eventName === 'click') {
      el.addEventListener('click', () => {
        handleClick(el, cb)
      })
    } else {
      el.addEventListener(eventName, cb)
    }
  }

  createElement({ el, iconOff, iconOn, classList })
  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Create the HTML element
 */
function createElement({ el, iconOff, iconOn, classList }) {
  el.innerHTML = html

  el.className = 'switch'
  if (classList.length) {
    el.classList.add(...classList)
  }
  if (iconOff && iconOn) {
    el.className = `switch iconed`
    el.querySelector('i').className = `fa-solid ${iconOff}`
    el._iconOff = iconOff
    el._iconOn = iconOn
  }
  // using bind to eliminate global el,
  // to support multiple switches on page
  el.isOn = isOn.bind(el)
  el.setOn = setOn.bind(el)
  el.setOff = setOff.bind(el)
  el.toggle = handleClick.bind(el)
  el.disable = disable.bind(el)
  el.enable = enable.bind(el)
  el.isDisabled = isDisabled.bind(el)
}

/**
 * Respond to switch clicks
 * @param {Function} cb - The consumer's callback to run
 */
function handleClick(el, cb) {
  el.classList.toggle('on')
  el.querySelector('i').classList.toggle(el._iconOff)
  el.querySelector('i').classList.toggle(el._iconOn)
  if (cb) {
    cb()
  }
}

/**
 *
 */
function isOn() {
  return this.classList.contains('on')
}

/**
 *
 */
function setOn() {
  if (this.isOn()) {
    return
  }
  this.dispatchEvent(new Event('click'))
}

/**
 *
 */
function setOff() {
  if (!this.isOn()) {
    return
  }
  this.dispatchEvent(new Event('click'))
}

/**
 *
 */
function disable() {
  this.classList.add('disabled')
}

/**
 *
 */
function enable() {
  this.classList.remove('disabled')
}

/**
 *
 * @returns
 */
function isDisabled() {
  return this.classList.contains('disabled')
}
