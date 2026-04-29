import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createHeaderGroup } from '../../assets/partials/headerGroup.js'
import { createButton } from '../../assets/partials/button.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { createStep } from './step.js'
import { createDueDate } from './dueDate.js'
import { createSpan } from '../../assets/partials/span.js'

const css = `
#due-date-wrapper {
  margin-top: 30px;
}
#steps-wrapper {
  margin-top: 20px;
}
#trash-btn {
  padding-left: 0;
}
#trash-btn i {
  margin-right: 20px;
  margin-left: 0 !important;  
}
.add-step {
  width: 90%;
  border: none;
}
.fa-trash {
  margin: 10px;
}
.due-date-badge {
  padding: 5px;
}
`

export function createTaskBody(doc) {
  injectStyle(css)

  const el = createDiv({
    id: 'task-body',
  })

  build(el, doc)
  listen(el, doc)

  return el
}

function build(el, doc) {
  el.appendChild(
    createInputGroup({
      id: 'title',
      name: 'title',
      placeholder: 'Title',
      autocomplete: 'off',
      classes: { group: '', input: 'w-100', icon: 'fa-square' },
      value: doc.title || '',
    }),
  )

  el.appendChild(
    createHeaderGroup({
      type: 'h5',
      classes: { group: 'mt-40 mb-20', icon: 'fa-rectangle-list' },
      html: 'Steps',
    }),
  )

  el.appendChild(createDiv({ id: 'steps-wrapper' }))

  if (doc.steps?.length) {
    for (const step of doc.steps) {
      const stepDiv = createStep(step)
      el.querySelector('#steps-wrapper').appendChild(stepDiv)
    }
  }

  el.appendChild(
    createInputGroup({
      placeholder: doc.steps?.length ? 'Next step' : 'Add step',
      classes: {
        group: 'add-step-wrapper mt-20',
        input: 'add-step',
        icon: 'fa-plus',
      },
    }),
  )

  el.appendChild(createDueDate())

  if (doc.starts_at) {
    const dateObj = new Date(doc.starts_at)
    const [datePart, fullTimePart] = dateObj.toISOString().split('T')
    const timePart = fullTimePart.substring(0, 5)

    el.querySelector('#due-date').value = datePart
    el.querySelector('#due-time').value = timePart
    el.querySelector('#add-due-date-wrapper').click()
  }

  el.appendChild(
    createHeaderGroup({
      type: 'h5',
      classes: { group: 'mt-30 mb-20', icon: 'fa-pencil' },
      html: 'Notes',
    }),
  )

  el.appendChild(
    createTextarea({
      name: 'details',
      id: 'details',
      className: 'mb-20 w-100',
      placeholder: 'Additional information...',
      value: doc.details || '',
    }),
  )

  const trashBtn = createButton({
    id: 'trash-btn',
    className: 'transparent',
    html: createSpan({ html: '<i class="fa-solid fa-trash"></i> Delete task' }),
  })

  el.appendChild(trashBtn)

  trashBtn.addEventListener('click', () => {
    state.set('task-deleted', { id: el.id })
  })

  el.appendChild(
    createHeader({ type: 'h5', html: 'Id', className: 'mt-20 mb-20' }),
  )

  el.appendChild(createSpan({ html: doc.id }))
}

/**
 *
 */
function listen(el) {
  el.querySelector('.add-step').addEventListener('change', (e) => {
    e.preventDefault()
    const caption = e.target.value.trim()
    if (!caption.length) return

    const parent = e.target.closest('.td-item')

    state.set('step-added', { taskId: parent.id, caption })
  })
}
