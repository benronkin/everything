import { injectStyle, setMessage } from '../../assets/js/ui.js'
import { createHeader } from '../../assets/partials/header.js'
import { createDiv } from '../../assets/partials/div.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { state } from '../../assets/js/state.js'

const css = `
`

export function shop() {
  injectStyle(css)

  const el = createDiv({ id: 'profile-wrapper' })

  build(el)

  const recurring = state.get('recurring')
  if (recurring) {
    const value = recurring
      .split(',')
      .map((i) => i.trim())
      .join('\n')
    const recurringEl = el.querySelector('#recurring')
    recurringEl.setValue(value)
  } else {
    setMessage('settings.js did not set recurring', { type: 'warn' })
  }

  return el
}

function build(el) {
  el.appendChild(
    createHeader({
      className: 'mb-30',
      html: 'Shopping',
      type: 'h4',
    }),
  )

  el.appendChild(
    createHeader({ html: 'Recurring items:', type: 'h5', className: 'mb-10' }),
  )

  el.appendChild(
    createTextarea({
      name: 'recurring',
      id: 'recurring',
      className: 'w-100',
      placeholder: 'Add recurring items...',
    }),
  )
}
