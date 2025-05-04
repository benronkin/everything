// -------------------------------
// Globals
// -------------------------------

let cssInjected = false

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
  background-color: var(--primary-accent)
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

export function createSwitch({ id, iconOff = false, iconOn, classList = [] } = {}) {
  injectStyle(css)
  const el = createElement({ id, html, iconOff, iconOn, classList })
  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Inject style sheet once
 */
function injectStyle(css) {
  if (cssInjected) {
    return
  }
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  cssInjected = true
}

/**
 * Create the HTML element
 */
function createElement({ id, html, iconOff, iconOn, classList }) {
  const switchEl = document.createElement('div')
  switchEl.innerHTML = html
  switchEl.setAttribute('id', id)
  switchEl.addEventListener('click', handleSwitchElClick)

  switchEl.className = 'switch'
  if (classList.length) {
    switchEl.classList.add(...classList)
  }
  if (iconOff && iconOn) {
    switchEl.className = `switch iconed`
    switchEl.querySelector('i').className = `fa-solid ${iconOff}`
    switchEl._iconOff = iconOff
    switchEl._iconOn = iconOn
  }
  // using bind to eliminate global switchEl,
  // to support multiple switches on page
  switchEl.isOn = isOn.bind(switchEl)
  switchEl.setOn = setOn.bind(switchEl)
  switchEl.setOff = setOff.bind(switchEl)
  switchEl.toggle = handleSwitchElClick.bind(switchEl)
  switchEl.disable = disable.bind(switchEl)
  switchEl.enable = enable.bind(switchEl)
  switchEl.isDisabled = isDisabled.bind(switchEl)

  return switchEl
}

/**
 *
 */
function handleSwitchElClick() {
  this.classList.toggle('on')
  this.querySelector('i').classList.toggle(this._iconOff)
  this.querySelector('i').classList.toggle(this._iconOn)
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
