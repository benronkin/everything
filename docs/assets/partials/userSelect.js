import { createSelect } from './select.js'
import { injectStyle } from '../js/ui.js'
import { state } from '../js/state.js'

const css = `
select {
  font-size: 1.5rem;
}
select option {
  font-size: 1.5rem;
}
.user-select {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: 140px !important;
}
.custom-select, 
.select-wrapper .fa-caret-down {
color: var(--gray0) !important;
}
`

export function createUserSelect(obj) {
  injectStyle(css)

  const { id, className, name, value, options } = obj

  const el = createSelect({
    id,
    className,
    name,
    value,
    options,
  })

  react(el, obj)
  listen(el)

  el.setUser = setUser.bind(el)

  return el
}

function react(el) {
  const users = state.get('users')
  if (users.length) {
    setBackgroundColor(el, users)
  } else {
    state.on('users', 'userSelect', (users) => {
      setBackgroundColor(el, users)
    })
  }
}

function listen(el) {
  el.addEventListener('change', () => {
    const users = state.get('users')
    setBackgroundColor(el, users)
  })
}

/**
 *
 */
function setUser(id) {
  this.selectByValue(id)
  const users = state.get('users')
  setBackgroundColor(this, users)
}

/**
 *
 */
function setBackgroundColor(el, users) {
  const selectedOption = el.getSelected()

  if (!selectedOption) {
    console.log('no selected option')
    return
  }

  const user = users.find((u) => u.id === selectedOption.value)
  el.style.backgroundColor = user.color
}
