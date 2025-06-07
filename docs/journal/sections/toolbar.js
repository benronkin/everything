import { newState } from '../../_assets/js/newState.js'
import { createToolbar } from '../../_composites/toolbar.js'
import { createIcon } from '../../_partials/icon.js'
import { log } from '../../_assets/js/ui.js'
import { getWebApp } from '../../_assets/js/io.js'

// -------------------------------
// Exports
// -------------------------------

/**
 *
 */
export function toolbar() {
  const el = createToolbar({
    children: [
      createIcon({
        id: 'back',
        classes: { primary: 'fa-chevron-left', other: ['primary', 'hidden'] },
      }),
      createIcon({
        id: 'add-entry',
        classes: { primary: 'fa-plus', other: ['primary'] },
      }),
    ],
  })

  react(el)
  listen(el)

  return el
}

// -------------------------------
// Helpers
// -------------------------------

/**
 * Subscribe to state.
 */
function react(el) {
  newState.on('active-doc', 'Journal toolbar', (doc) => {
    const backEl = el.querySelector('#back')
    if (doc) {
      backEl.classList.remove('hidden')
      log('Journal toolbar is showing #back button on active-doc')
    } else {
      backEl.classList.add('hidden')
      log('Journal toolbar is hiding #back button on a null active-doc')
    }
  })
}

/**
 * Set event handlers which can set state.
 */
function listen(el) {
  el.addEventListener('click', () => {
    newState.set('active-doc', null)
  })

  el.querySelector('#add-entry').addEventListener('click', addEntry)
}

/**
 * Add a journal entry
 */
async function addEntry(e) {
  e.target.disabled = true

  const url = newState.const('APP_URL')

  const { id } = await getWebApp(`${url}/journal/create`)
  const { defaults } = await getWebApp(`${url}/journal/defaults/read`)

  const dateString = new Date().toISOString()

  const doc = {
    id,
    location: 'New entry',
    created_at: dateString,
    visit_date: dateString,
    city: defaults.city,
    state: defaults.state,
    country: defaults.country,
    notes: '',
  }

  newState.set('main-documents', [doc, ...newState.get('main-documents')])
  newState.set('active-doc', doc)

  delete e.target.disabled
}
