import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createDiv } from '../../assets/partials/div.js'
import { createMainDocumentsList } from '../../assets/partials/mainDocumentsList.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'
import { createSpan } from '../../assets/partials/span.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
.project-chip {
  background-color: var(--teal3);
  white-space: nowrap;
  padding: 5px;
  border-radius: var(--border-radius);
  color: var(--gray0);
}
`

export function mainDocumentsList() {
  injectStyle(css)

  const el = createMainDocumentsList({
    id: 'left-panel-list',
    className: 'mt-10'
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

  // for (const doc of docs) {
  //   if (!doc) {
  //     console.warn('One of the docs is empty')
  //     return
  //   }
  // }

  const children = docs.map((doc) => {
    const html = [createSpan({ html: doc.title })]

    if (doc.assigned_project) {
      const project = doc.projects.find((p) => p.id === doc.assigned_project)

      if (!project) {
        console.warn(
          `Unable to locate project with id "${doc.assigned_project}"`
        )
        return
      }

      const title = project.title
      const firstToken = title.split(/[ -]/)[0]
      html.push(createDiv({ html: firstToken, className: 'project-chip' }))
    } else if (doc?.peers?.length) {
      html.push(createAvatarGroup({ peers: doc.peers }))
    }

    return createMainDocumentLink({
      id: doc.id,
      html,
      url: `./note.html?id=${doc.id}`
    })
  })
  el.addChildren(children)
}
