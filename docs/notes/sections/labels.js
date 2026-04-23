import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createSpan } from '../../assets/partials/span.js'
import { createIcon } from '../../assets/partials/icon.js'
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
  for (const label of labels) {
    el.appendChild(createLabelElement(label))
  }
}

function react(el) {}

/**
 * Create a label element with title and more icon
 */
function createLabelElement([id, title, assigned]) {
  const labelDiv = createDiv({
    id,
    className: 'toc-item flex align-center',
    html: [
      createDiv({
        html: [
          createSpan({ html: title }),
          createIcon({
            classes: {
              primary: 'fa-check',
              other: [`ml-10 ${assigned ? '' : 'hidden'}`],
            },
          }),
        ],
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
  const visibleCheck = !labelDiv
    .querySelector('.fa-check')
    .classList.contains('hidden')

  let menuDiv = document.querySelector('#label-menu')
  if (!menuDiv) {
    menuDiv = createDiv({
      id: 'label-menu',
      html: [
        createSpan({
          id: 'assign-label',
          html: visibleCheck ? 'Unassign' : 'Assign',
        }),
        createSpan({ id: 'edit-label', html: 'Edit' }),
        createSpan({ id: 'delete-label', html: 'Delete' }),
        createSpan({ id: 'cancel-label', html: 'Cancel' }),
      ],
      dataset: { labelId: labelDiv.id },
    })
    document.querySelector('#right-panel').appendChild(menuDiv)
  }

  const rect = e.currentTarget.getBoundingClientRect()

  menuDiv.classList.remove('hidden')
  menuDiv.style.top = `${rect.bottom - 90}px`
  menuDiv.style.left = `165px`

  menuDiv
    .querySelector('#assign-label')
    .addEventListener('click', handleAssignLabel)

  menuDiv
    .querySelector('#cancel-label')
    .addEventListener('click', handleCancelLabel)
}

function handleAssignLabel(e) {
  const menuEl = e.target.parentElement
  const labelId = menuEl.dataset.labelId
  const labelEl = document.getElementById(labelId)

  const checkIcon = labelEl.querySelector('.fa-check')
  const isAssgined = !checkIcon.classList.contains('hidden')
  e.target.innerHTML = isAssgined ? 'Assign' : 'Unassign'
  checkIcon.classList.toggle('hidden')

  console.log('labelId', labelId)
}

function handleCancelLabel() {
  document.getElementById('label-menu').classList.add('hidden')
}
