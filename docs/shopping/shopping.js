import { newState } from '../_assets/js/newState.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { nav } from './sections/nav.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_composites/footer.js'
import { setMessage } from '../_assets/js/ui.js'
import { fetchCartAndSuggestions } from './shopping.api.js'
import { log } from '../_assets/js/logger.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    handleTokenQueryParam()

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    build()

    react()

    const resp = await fetchCartAndSuggestions()
    const { list, suggestions } = resp
    newState.set('list', list)
    newState.set('suggestions', suggestions)
    newState.set('app-mode', 'main-panel')
    newState.set('default-page', 'shopping')
    window.newState = newState // avail to browser console
    setMessage({ message: '' })
  } catch (error) {
    console.trace(error)
    setMessage({ message: error.message, type: 'danger' })
  }
})

// ------------------------
// Helpers
// ------------------------

/**
 *
 */
function build() {
  document.head.title = 'Shopping | Everything App'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })
  body.prepend(wrapperEl)
  wrapperEl.appendChild(nav())

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })
  wrapperEl.appendChild(columnsWrapperEl)
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())

  wrapperEl.appendChild(createFooter())
}

/**
 * Subscribe to state.
 */
function react() {
  newState.on('form-submit:shopping-form', 'shopping', handleCartUpdate)
}

/**
 *
 */
function handleCartUpdate() {}
