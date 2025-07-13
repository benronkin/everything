import { handleTokenQueryParam } from '../assets/js/io.js'
import { setMessage } from '../assets/js/ui.js'
import { state } from '../assets/js/state.js'
import { fetchTasks } from '../tasks/tasks.api.js'
import { createDiv } from '../assets/partials/div.js'
import { nav } from './sections/nav.js'
import { mainPanel } from './sections/mainPanel.js'
import { createFooter } from '../assets/composites/footer.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    build()

    const urlParams = new URLSearchParams(window.location.search)

    let message = ''

    if (urlParams.get('message')) {
      message = urlParams.get('message')
    } else if (urlParams.get('setup')) {
      message = 'Upgrading the app. We need your email again'
    }

    if (message) {
      setMessage({ message, type: 'danger' })
      return
    }

    handleTokenQueryParam()
  } catch (error) {
    console.trace(error)
  }
})

export function build() {
  document.head.title = 'Login | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({
    className: 'wrapper',
  })
  body.prepend(wrapperEl)

  wrapperEl.appendChild(nav())

  wrapperEl.appendChild(createDiv({ id: 'for-grid-dont-delete' }))

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)

  columnsWrapperEl.appendChild(mainPanel())

  wrapperEl.appendChild(createFooter())
}
