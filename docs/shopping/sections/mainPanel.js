import { state } from '../../assets/js/state.js'
import { injectStyle, setMessage } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createItemGroup } from './item.group.js'
import { createSpan } from '../../assets/partials/span.js'
import { dangerZone } from './dangerZone.js'
import { createMediaForm } from '../../assets/composites/media.form.js'
import { mediaList } from '../../assets/composites/mediaList.js'

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

  const el = createDiv({ className: 'mt-20' })

  build(el)
  react(el)

  el.id = 'main-panel'

  return el
}

function build(el) {
  // hide empty elements
  el.classList.add('hidden')
  setMessage('Fetching item info...')

  el.appendChild(createItemGroup())

  const phw = createDiv({
    id: 'media-header-wrapper',
    className: 'flex align-center'
  })

  el.appendChild(phw)

  phw.appendChild(
    createHeader({ type: 'h4', html: 'Media', className: 'mt-0' })
  )

  phw.appendChild(
    createIcon({
      id: 'add-media-toggle',
      classes: { primary: 'fa-camera', other: 'primary btn' }
    })
  )

  const upw = createDiv({
    id: 'upload-media-wrapper'
  })

  el.appendChild(upw)
  upw.appendChild(createMediaForm())

  el.appendChild(mediaList())

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-40' }))

  el.appendChild(createSpan({ id: 'item-id' }))
}

function react(el) {
  state.on('main-documents', 'mainPanel', (docs) => {
    const doc = docs[0]

    el.querySelector('#title').value = doc.title
    el.querySelector('#carted').value = doc.carted
    el.querySelector('#recurring').value = doc.recurring
    // store select value is set after store options are set in state
    el.querySelector('#note').setValue(doc.note)
    el.querySelector('.markdown-wrapper').updateEditor(doc.note)
    el.querySelector('#item-id').insertHtml(doc.id)

    // show filled elements
    el.classList.remove('hidden')
    const urlParams = new URLSearchParams(window.location.search)
    if (!urlParams.get('message')) {
      console.debug('Clearing setMessage on main-documents state')
      setMessage()
    }
  })

  state.on('stores', 'item.group', (stores) => {
    const options = stores.map(createOption)
    const storeEl = document.getElementById('store')
    options.unshift(createOption({ id: null, name: 'Select store' }))
    storeEl.setOptions(options)
    const storeId = state.get('main-documents')[0].store || ''
    storeEl.selectByValue(storeId)
  })
}

/**
 *
 */
function createOption({ id, name }) {
  const o = document.createElement('option')
  o.value = id
  o.label = name
  return o
}
