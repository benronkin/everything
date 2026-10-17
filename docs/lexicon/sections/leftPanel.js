import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'

import { mainDocumentsList } from './mainDocumentsList.js'
import { newEntry } from './newEntry.js'

const css = `
#left-panel {
  width: 100%;
}
  
#next-page {
  margin: 20px 0;
}
`

export function leftPanel() {
  injectStyle(css)

  const el = createDiv()

  build(el)
  react(el)

  el.id = 'left-panel'

  return el
}

function build(el) {
  el.appendChild(newEntry())

  el.appendChild(mainDocumentsList())

  el.appendChild(
    createButton({
      id: 'next-page',
      html: 'Show older entries',
      className: 'primary'
    })
  )
}

function react(el) {
  state.on('app-mode', 'leftPanel', (appMode) => {
    if (appMode !== 'left-panel') {
      el.classList.add('hidden')
      return
    }

    el.classList.remove('hidden')
    const currentId = state.get('active-doc')
    if (!currentId) {
      el.querySelector('#left-panel-list').reset()
      return
    }

    const docs = state.get('main-documents')
    const docExists = docs.findIndex((el) => el.id === currentId)
    if (!docExists) {
      state.set('active-doc', null)
      return
    }
  })
}
