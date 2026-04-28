import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'
import { createSpan } from '../../assets/partials/span.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'

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
    addChildren(el, docs)
  })

  state.on('view-by-label', 'mainDocumentsList', (labelId) => {
    const labelAssignments = state
      .get('note-label-assignments')
      .filter((arr) => arr[0] === labelId)
    let docs = state.get('main-documents')

    if (labelId)
      docs = docs.filter((doc) => labelAssignments.find((a) => a[1] === doc.id))

    addChildren(el, docs)
  })
}

/**
 *
 */
function addChildren(el, docs) {
  el.deleteChildren()

  if (!docs || !docs.length) return

  const children = docs.map((doc) => {
    const html = [createSpan({ html: doc.title })]
    if (doc?.peers?.length) {
      html.push(createAvatarGroup({ peers: doc.peers }))
    }

    return createMainDocumentLink({
      id: doc.id,
      html,
      url: `./note.html?id=${doc.id}`,
    })
  })
  el.addChildren(children)
}
