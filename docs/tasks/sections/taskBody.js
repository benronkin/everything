import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createButton } from '../../assets/partials/button.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createHeaderGroup } from '../../assets/partials/headerGroup.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createMarkdown } from '../../assets/composites/markdown.js'
import { createStep } from './step.js'
import { createDueDate } from './dueDate.js'
import { createSpan } from '../../assets/partials/span.js'
import { createUserSelect } from '../../assets/partials/userSelect.js'

const css = `
#due-date-wrapper {
  margin-top: 30px;
}
#note-header5 {
  margin: 0;
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
[data-type="TEMPLATE"] .task-step .assignee,
[data-type="TEMPLATE"] .task-step .mark-complete {
  visibility: hidden;
}
[data-type="TEMPLATE"] .task-assignee-wrapper,
[data-type="TEMPLATE"] #add-due-date-wrapper {
  display: none !important;
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
  let typeString = 'Task'

  if (doc.type === 'TEMPLATE') {
    typeString = 'Template'
    el.dataset.type = 'TEMPLATE'

    el.appendChild(
      createButton({
        id: 'duplicate-task',
        html: 'Create task from this template',
        className: 'primary mb-30',
      }),
    )
  }

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
    el.querySelector('.starts_at').setDateTime(doc.starts_at)
    el.querySelector('#add-due-date-wrapper').click()
  }

  el.appendChild(
    createDiv({
      className: 'flex justify-start align-center mt-20 task-assignee-wrapper',
      html: [
        createSpan({ html: 'Assignee:' }),
        createUserSelect({
          id: 'assignee',
          name: 'assignee',
          caption: 'Assignee:',
          value: doc.assignee,
          users: state.get('users'),
        }),
      ],
    }),
  )

  el.appendChild(
    createDiv({
      className: 'mt-30 mb-20 flex align-center gap-10 justify-start',
      html: [
        createHeader({ html: 'Notes', type: 'h5', id: 'note-header5' }),
        createIcon({
          id: 'notes-toggle',
          classes: {
            primary: 'fa-pencil',
            secondary: 'fa-close',
            other: ['primary'],
          },
        }),
      ],
    }),
  )

  el.appendChild(
    createMarkdown({
      name: 'details',
      id: 'details',
      className: 'mb-20 w-100',
      toggleId: 'notes-toggle',
      value: doc.details || '',
    }),
  )

  const trashBtn = createButton({
    id: 'trash-btn',
    className: 'transparent',
    html: createSpan({
      html: `<i class="fa-solid fa-trash"></i> Delete ${typeString}`,
    }),
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

    const taskId = state.get('active-doc')
    state.set('step-added', { taskId, caption })
  })
}
