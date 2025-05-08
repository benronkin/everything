// -------------------------------
// Globals
// -------------------------------

let cssInjected = false

const css = `
.select-wrapper {
  display: inline-block;
  position: relative;
}

.select-container {
  display: flex;
  align-items: center;
  background-color: var(--purple2); 
  box-shadow: var(--shadow-small);
  border-radius: 12px;
  padding: 5px 10px;
}

.custom-select {
  appearance: none;
  background-color: transparent;
  color: var(--gray1);
  border: none;
  font-size: 0.9rem; 
  padding: 0 1.5rem 0 0.8rem;
  z-index: 2;
}

.custom-select:focus {
  outline: none;
}

.caret-wrapper {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 1;
}

.caret-wrapper i {
  color: var(--gray1);
  font-size: 0.8rem;
}
`

const html = `
<div class="select-wrapper">
  <div class="select-container">
    <select class="custom-select"></select>
    <div class="caret-wrapper">
      <i class="fa-solid fa-caret-down"></i>
    </div>
  </div>
</div>
`

// -------------------------------
// Exported
// -------------------------------

export function createSelect({ id, options = [] }) {
  injectStyle(css)
  return createElement({ id, options })
}

// -------------------------------
// Helpers
// -------------------------------

function injectStyle(css) {
  if (cssInjected) return
  cssInjected = true
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

function createElement({ id, options }) {
  const el = document.createElement('div')
  el.innerHTML = html
  const wrapper = el.firstElementChild
  const selectEl = wrapper.querySelector('select')
  selectEl.setAttribute('id', id)

  options.forEach((opt) => {
    const optEl = document.createElement('option')
    optEl.value = opt.value
    optEl.textContent = opt.label
    if (opt.selected) optEl.selected = true
    selectEl.appendChild(optEl)
  })

  return wrapper
}
