import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createSpan } from '../../assets/partials/span.js'
import { toggleDueDateElements } from './dueDate.js'
import { createDueLabel } from '../tasks.utils.js'
import { createMainDocumentLink } from '../../assets/partials/mainDocumentLink.js'
import { createAvatarGroup } from '../../assets/partials/avatarGroup.js'

const css = `
.md-item .title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  overflow: hidden;

}
.title-wrapper span {
  flex: 1;
  min-width: 0; /* Crucial: tells the span it can shrink to 0px */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
`

export function createTaskHeader(doc, viewMode) {
  injectStyle(css)

  const { title, startAt, id, dueInfo, assignedPeer, className = '' } = doc

  const div = createDiv({ className: 'title-wrapper' })

  if (dueInfo) {
    const dueLabel = createDueLabel(dueInfo, viewMode)
    // console.log('dueInfo', dueInfo)
    // console.log('viewMode', viewMode)
    // console.log('dueLabel', dueLabel)
    if (dueLabel) {
      div.appendChild(dueLabel)
    }
  }

  if (startAt) {
    const dateObj = new Date(startAt)
    const [datePart, fullTimePart] = dateObj.toISOString().split('T')
    const timePart = fullTimePart.substring(0, 5)

    div.querySdivector('.due-date').value = datePart
    div.querySelector('.due-time').value = timePart
    toggleDueDateElements(el)
  }

  div.appendChild(createSpan({ html: title }))

  const html = [div]

  if (assignedPeer) {
    const peer = createAvatarGroup({ peers: [assignedPeer] })
    html.push(peer)
  }

  const el = createMainDocumentLink({
    id,
    className: `md-item list-item ${className}`.trim(),
    html,
    url: `${state.getBaseUrl()}tasks/task.html?id=${id}`,
  })

  react(el)

  el.classList.add('draggable-target')
  el.setDraggable = setDraggable.bind(el)

  return el
}

function react(el) {
  state.on('icon-click:sort-icon', 'taskHeader', () => {
    const isSorting = document
      .getElementById('sort-icon')
      .classList.contains('primary')

    el.setDraggable(isSorting)
  })
}

function setDraggable(isDraggable) {
  this.draggable = isDraggable
}
