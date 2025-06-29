import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createEntryGroup } from './entry.group.js'
import { createPhotoForm } from './photo.form.js'
import { createSpan } from '../../assets/partials/span.js'
import { dangerZone } from './dangerZone.js'
import { photoList } from './photoList.js'
import { log } from '../../assets/js/logger.js'

const css = `
#main-panel {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
#main-panel.hidden {
  display: none;
}
#main-panel input.field,
#main-panel textarea.field {
  padding: 0;
  margin: 0;
  border-bottom: 1px dotted var(--gray1);
}
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ className: 'mt-20 hidden' })

  build(el)
  react(el)

  el.id = 'main-panel'
  el.dataset.id = 'main-panel'

  return el
}

function build(el) {
  el.appendChild(createEntryGroup())

  const phw = createDiv({
    id: 'photos-header-wrapper',
    className: 'flex mt-20 align-center',
  })

  el.appendChild(phw)

  phw.appendChild(createHeader({ type: 'h4', html: 'Photos' }))

  phw.appendChild(
    createIcon({
      id: 'add-photo-toggle',
      classes: { primary: 'fa-camera', other: 'primary btn' },
    })
  )

  const upw = createDiv({
    id: 'upload-photo-wrapper',
  })

  el.appendChild(upw)
  upw.appendChild(createPhotoForm())

  el.appendChild(photoList())

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-20' }))

  el.appendChild(createSpan({ id: 'journal-id' }))
}

function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    if (appMode !== 'main-panel') {
      el.classList.add('hidden')
      // log(`mainPanel is hiding itself on app-mode: ${appMode}`)
      return
    }

    const id = state.get('active-doc')
    const doc = { ...state.get('main-documents').find((d) => d.id === id) }
    el.classList.remove('hidden')
    // log('mainPanel is showing itself on active-doc')

    document.querySelector('#photo-list').showPhotos()

    el.querySelector('[data-id="journal-location"]').value = doc.location
    el.querySelector('[data-id="journal-visit-date"]').value =
      doc.visit_date.split('T')[0]
    el.querySelector('[data-id="journal-notes"]').value = doc.notes
    el.querySelector('[data-id="journal-street"]').value = doc.street
    el.querySelector('[data-id="journal-city"]').value = doc.city
    el.querySelector('[data-id="journal-state"]').value = doc.state
    el.querySelector('[data-id="journal-country"]').value = doc.country
    el.querySelector('[data-id="journal-phone"]').value = doc.phone
    el.querySelector('[data-id="journal-id"]').insertHtml(doc.id)
  })
}
