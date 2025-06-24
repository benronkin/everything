import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { setMessage } from '../../assets/js/ui.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentItem } from '../../assets/partials/mainDocumentItem.js'
import { createSpan } from '../../assets/partials/span.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'
import { log } from '../../assets/js/logger.js'

const css = `
.md-item .title {
  flex: 1 1 auto;           /* take all leftover width */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  /* … when it runs out */
}
`

export function mainDocumentsList() {
  injectStyle(css)

  const el = createMainDocumentsList({
    id: 'left-panel-list',
    className: 'mt-10',
  })

  react(el)

  return el
}

function react(el) {
  state.on('main-documents', 'mainDocumentsList', (docs) => {
    const children = docs.map((doc) => {
      const html = [createSpan({ html: doc.title })]
      if (doc?.peers?.length) {
        html.push(createAvatarGroup({ peers: doc.peers }))
      }
      return createMainDocumentItem({ id: doc.id, html })
    })
    el.deleteChildren().addChildren(children)
  })

  setMessage()
}
