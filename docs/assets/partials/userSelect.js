import { createSelect } from './select.js'
import { injectStyle } from '../js/ui.js'

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
.custom-select:disabled, 
.select-wrapper.disabled .fa-caret-down {
color: var(--gray2) !important;
}

`

export function createUserSelect(obj) {
  injectStyle(css)

  const { id, className, name, value, users, setUpdateState } = obj

  const options = users.map((user) => ({
    label: user.first_name,
    value: user.id
  }))

  const el = createSelect({
    id,
    className,
    name,
    value,
    options,
    setUpdateState
  })

  listen(el)

  el._users = users
  el.setUser = setUser.bind(el)

  if (value) {
    el.setUser(value)
  }

  return el
}

function listen(el) {
  el.addEventListener('change', () => {
    setBackgroundColor(el)
  })
}

/**
 *
 */
function setUser(id) {
  this.selectByValue(id)
  setBackgroundColor(this)
}

/**
 *
 */
function setBackgroundColor(el) {
  if (el.classList.contains('disabled')) {
    return
  }

  const selectedOption = el.getSelected()

  if (!selectedOption) {
    console.log('no selected option')
    return
  }

  const id = selectedOption.value
  const user = el._users.find((u) => u.id === id)
  const color = user.color

  el.style.backgroundColor = color
}
