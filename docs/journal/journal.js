import { newState } from '../_assets/js/newState.js'
import { nav } from './tiles/nav.js'
import { toolbar } from './tiles/toolbar.js'
import { rightDrawer } from './tiles/rightDrawer.js'
import { leftPanel } from './tiles/leftPanel.js'
import { mainPanel } from './tiles/mainPanel.js'
import { createDiv } from '../_partials/div.js'
import { createFooter } from '../_sections/footer.js'
import { handleTokenQueryParam } from '../_assets/js/io.js'
import { setMessage } from '../_assets/js/ui.js'
import { fetchMainDocuments } from './journal.api.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    setMessage({ message: 'Loading...' })

    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Token not found locally')
    }

    handleTokenQueryParam()

    build()
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

  newState.set('main-documents', await fetchMainDocuments())
}

/**
 * Get the searched journals
 */
async function searchJournal(q) {
  const data = await getWebApp(
    `${newState.getAppUrl()}/journal/search?q=${q.trim().toLowerCase()}`
  )

  const { journal, message } = data
  if (message) {
    console.log(`searchJournal error: ${message}`)
    return message
  }
  return journal
}

/**
 * Handle results coming from the search partial
 */
async function handleSearchResult(results) {
  newState.set('journa', results)
}
