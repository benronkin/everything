// -------------------------------
// Globals
// -------------------------------

let cssInjected = false
let switchEl

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
.thumb {
  color: var(----gray3);
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background-color: var(--purple2);
  border-radius: 50%;
  position: absolute;
  left: -1px;
  transition: left 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb.iconed {
  background: transparent;
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

export function createSwitch({ id, iconOff = false, iconOn, isOn } = {}) {
  injectStyle(css)
  const el = createElement({ id, html, iconOff, iconOn, isOn })
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
function createElement({ id, html, iconOff, iconOn, isOn }) {
  switchEl = document.createElement('div')
  switchEl.innerHTML = html
  switchEl.className = 'switch'
  switchEl.addEventListener('click', () => handleSwitchElClick(iconOff, iconOn))
  if (iconOff && iconOn) {
    switchEl.querySelector('i').className = `iconed fa-solid ${iconOff}`
  }
  if (isOn) {
    handleSwitchElClick(iconOn, iconOff)
  }
  return switchEl
}

/**
 *
 */
function handleSwitchElClick(iconOn, iconOff) {
  switchEl.classList.toggle('on')
  switchEl.querySelector('i').classList.toggle(iconOn)
  switchEl.querySelector('i').classList.toggle(iconOff)
}
