import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { createprojectGroup } from './project.group.js'
import { dangerZone } from './dangerZone.js'
import { state } from '../../assets/js/state.js'

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
`

export function mainPanel() {
  injectStyle(css)

  const el = createDiv({ id: 'main-panel', className: 'mt-20' })

  react(el)
  return el
}

function react(el) {
  state.on('main-documents', 'mainPanel', (docs) => {
    const doc = docs[0]
    el.appendChild(createprojectGroup(doc))

    el.appendChild(createHeader({ type: 'h5', html: 'Id', className: 'mt-20' }))

    el.appendChild(
      createSpan({ id: 'note-id', className: 'smaller', html: doc.id }),
    )

    el.appendChild(dangerZone())
  })
}
