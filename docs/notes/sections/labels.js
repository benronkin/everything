import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createLabelsDialog } from './labelDialog.js'
import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'

const css = `
#labels-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#add-label {
  padding: 5px;
}
#label-menu {
  position: absolute;
  z-index: 9999;
  margin: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--gray6);
  color: var(--gray0);
  border-radius: 3px;
}
#label-menu span {
  padding: 7px;
  cursor: pointer;
  border-radius: 0;
}
#label-menu span:hover {
  background-color: var(--gray5);
}
.fa-ellipsis-vertical {
  padding: 0 10px;
}
`

export function labels(el) {
  injectStyle(css)

  el.innerHTML = ''

  el.appendChild(
    createHeader({
      id: 'labels-header',
      html: [
        createSpan({ html: 'labels' }),
        createIcon({
          id: 'add-label',
          classes: { primary: 'fa-plus' },
        }),
      ],
      type: 'h5',
      className: 'toc-header',
    }),
  )

  const labels = state.get('note-labels')
  const labelAssignments = state.get('note-label-assignments')

  for (const label of labels) {
    el.appendChild(createLabelElement(label, labelAssignments))
  }

  if (!document.querySelector('#dialog')) {
    document.querySelector('body').appendChild(createLabelsDialog())
  }

  listen(el)
}

function listen(el) {
  el.querySelector('#add-label').addEventListener('click', handleAddLabel)
}

/**
 * Create a label element with title and more icon
 */
function createLabelElement([id, title], labelAssignments) {
  const html = createSpan({ html: title })

  if (state.get('app-mode') === 'main-panel') {
    const isAssigned = labelAssignments.find((a) => a[1] === id)
    html.appendChild(
      createIcon({
        classes: {
          primary: 'fa-check',
          other: [`ml-10 ${isAssigned ? '' : 'hidden'}`],
        },
      }),
    )
  }

  const labelDiv = createDiv({
    id,
    className: 'toc-item flex align-center',
    dataset: { title },
    html: [
      createDiv({
        html,
      }),
      createIcon({
        classes: { primary: 'fa-ellipsis-vertical' },
      }),
    ],
  })

  labelDiv.addEventListener('click', handleLabelClick)

  labelDiv
    .querySelector('.fa-ellipsis-vertical')
    .addEventListener('click', handleMoreClick)

  return labelDiv
}

/**
 * Close the label menu
 */
function handleLabelClick() {
  document.querySelector('#label-menu')?.classList.add('hidden')
}

/**
 * Show the label menu
 */
function handleMoreClick(e) {
  e.stopPropagation()
  const labelDiv = e.target.parentElement

  let menuDiv = document.querySelector('#label-menu')
  if (!menuDiv) {
    menuDiv = createDiv({
      id: 'label-menu',
      html: [
        createSpan({ id: 'edit-label', html: 'Edit' }),
        createSpan({ id: 'delete-label', html: 'Delete' }),
      ],
    })
    document.querySelector('#right-panel').appendChild(menuDiv)

    if (state.get('app-mode') === 'main-panel') {
      const visibleCheck = !labelDiv
        .querySelector('.fa-check')
        .classList.contains('hidden')

      menuDiv.prepend(
        createSpan({
          id: 'assign-label',
          html: visibleCheck ? 'Unassign' : 'Assign',
        }),
      )

      menuDiv
        .querySelector('#assign-label')
        .addEventListener('click', handleAssignLabel)
    }

    menuDiv
      .querySelector('#delete-label')
      .addEventListener('click', handleDeleteLabel)

    menuDiv
      .querySelector('#edit-label')
      .addEventListener('click', handleEditLabel)
  }

  menuDiv.dataset.labelId = labelDiv.id
  const rect = e.currentTarget.getBoundingClientRect()

  menuDiv.classList.remove('hidden')
  menuDiv.style.top = `${rect.top - 60}px`
  menuDiv.style.left = `165px`
}

function handleAddLabel() {
  document.querySelector('#label-menu')?.classList.add('hidden')
  document
    .querySelector('#labels-dialog')
    .customize({ action: 'add' })
    .showModal()
}

/**
 *
 */
function handleAssignLabel(e) {
  const menuEl = e.target.parentElement
  const labelId = menuEl.dataset.labelId
  const labelEl = document.getElementById(labelId)

  document.querySelector('#label-menu')?.classList.add('hidden')

  const checkIcon = labelEl.querySelector('.fa-check')
  const currentAssignState = e.target.innerHTML.toLowerCase()
  const isAssgined = !checkIcon.classList.contains('hidden')
  e.target.innerHTML = isAssgined ? 'Assign' : 'Unassign'
  checkIcon.classList.toggle('hidden')

  state.set('note-label-update', {
    labelId,
    action: currentAssignState,
  })
}

/**
 *
 */
function handleDeleteLabel(e) {
  e.stopPropagation()
  const menuEl = e.target.parentElement
  const labelId = menuEl.dataset.labelId
  const labelEl = document.getElementById(labelId)

  document.querySelector('#label-menu')?.classList.add('hidden')
  document
    .querySelector('#labels-dialog')
    .customize({ action: 'delete', id: labelId, title: labelEl.dataset.title })
    .showModal()
}

/**
 *
 */
function handleEditLabel(e) {
  e.stopPropagation()
  const menuEl = e.target.parentElement
  const labelId = menuEl.dataset.labelId
  const labelEl = document.getElementById(labelId)

  document.querySelector('#label-menu')?.classList.add('hidden')
  document
    .querySelector('#labels-dialog')
    .customize({ action: 'update', id: labelId, title: labelEl.dataset.title })
    .showModal()
}
