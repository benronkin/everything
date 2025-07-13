import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createLexiconGroup } from './lexicon.group.js'
import { createSpan } from '../../assets/partials/span.js'
import { dangerZone } from './dangerZone.js'
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
  el.appendChild(createLexiconGroup())

  el.appendChild(dangerZone())

  el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-20' }))

  el.appendChild(createSpan({ id: 'entry-id' }))
}

function react(el) {
  state.on('app-mode', 'mainPanel', (appMode) => {
    if (appMode !== 'main-panel') {
      el.classList.add('hidden')
      return
    }

    const id = state.get('active-doc')
    const doc = { ...state.get('main-documents').find((d) => d.id === id) }
    el.classList.remove('hidden')

    el.querySelector('#entry').value = doc.entry
    el.querySelector('#entry-part').selectByValue(doc.part_of_speech)
    el.querySelector('#entry-definition').setValue(doc.definition)
    el.querySelector('#entry-synonyms').setValue(doc.synonyms)
    el.querySelector('#entry-example').setValue(doc.example)
    el.querySelector('#entry-submitter').insertHtml(doc.submitterName)
    el.querySelector('#entry-id').insertHtml(doc.id)
  })
}
