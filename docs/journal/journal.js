import { newState } from '../_assets/js/newState.js'
import { nav } from './sections/nav.js'
import { toolbar } from './sections/toolbar.js'
import { rightDrawer } from './sections/rightDrawer.js'
import { leftPanel } from './sections/leftPanel.js'
import { mainPanel } from './sections/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_composites/footer.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { setMessage } from '../_assets/js/ui.js'
import { fetchRecentEntries, searchEntries } from './journal.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    handleTokenQueryParam()

    build()

    react()

    const { data } = await fetchRecentEntries()
    newState.set('main-documents', data)
  } catch (error) {
    console.trace(error)
    // window.location.href = `../index.html?error=${error.message}`
  }
})

// ------------------------
// Helper functions
// ------------------------

/**
 *
 */
async function build() {
  document.head.title = 'Journal | Ben'
  const body = document.body
  body.classList.add('dark-mode')

  const wrapperEl = createDiv({ className: 'wrapper' })

  const columnsWrapperEl = createDiv({
    className: 'columns-wrapper',
  })

  body.prepend(wrapperEl)

  wrapperEl.appendChild(nav())
  wrapperEl.appendChild(toolbar())
  wrapperEl.appendChild(columnsWrapperEl)
  wrapperEl.appendChild(createFooter())

  columnsWrapperEl.appendChild(leftPanel())
  columnsWrapperEl.appendChild(mainPanel())
  columnsWrapperEl.appendChild(rightDrawer())
}

/**
 *
 */
function react() {
  newState.on('form-submit:left-panel-search', 'journal', async (doc) => {
    let resp

    if (doc['search-entry'].trim().length) {
      resp = await searchEntries(doc['search-entry'])
    } else {
      // get most recent entries instead
      resp = await fetchRecentEntries()
    }

    const { data, message } = resp
    if (message) {
      console.error(`Journal server error: ${message}`)
      return
    }
    newState.set('main-documents', data)
  })
}
