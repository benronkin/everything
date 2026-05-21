import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createUserSelect } from '../../assets/partials/userSelect.js'

const css = `
.task-step {
  display: flex;
  align-items: center;
  padding: 5px 0;
}
.task-step:hover {
  background: var(--gray1);
}

.task-step .step-caption {
  color: inherit;
  text-decoration: none;
  margin-left: 10px;
}
.task-step .step-caption.completed {
  color: var(--gray3);
  text-decoration: line-through;
}
.task-step .mark-complete {
  width: 9px;
  margin-right: 15px;
  color: var(--gray6);
}
.task-step .fa-circle-check {
  color: var(--teal3);
}
.task-step .fa-close {
  color: var(--gray6);
  margin-right: 5px;
  margin-left: auto;
}
.task-step .assignee {
  margin-left: 20px;
}
`

export function createStep({ caption, completed = false, id, assignee } = {}) {
  injectStyle(css)

  const el = createDiv({
    id,
    className: 'task-step'
  })

  build(el)
  listen(el, id)

  el.querySelector('.step-caption').innerHTML = caption

  state.set(`step-${id}`, completed)
  if (completed) {
    el.querySelector('.mark-complete').toggleClasses()
    el.querySelector('.step-caption').classList.add('completed')
    el.querySelector('.select-wrapper').setDisabled(completed)
  }

  if (assignee) {
    el.querySelector('.assignee').setUser(assignee)
  }

  return el
}

function build(el) {
  el.appendChild(
    createIcon({
      classes: {
        primary: 'fa-circle',
        secondary: 'fa-circle-check',
        other: ['mark-complete']
      },
      useFaRegular: true
    })
  )

  el.appendChild(createDiv({ className: 'step-caption' }))

  el.appendChild(
    createUserSelect({
      className: 'assignee hidden',
      name: 'assignee',
      users: state.get('users'),
      setUpdateState: false,
      value: state.get('user').id
    })
  )

  el.appendChild(createIcon({ classes: { primary: 'fa-close' } }))
}

function listen(el, id) {
  el.querySelector('.assignee').addEventListener('change', (e) => {
    const stepEl = e.target.closest('.task-step')
    id = id || stepEl.id
    const userId = e.target.value

    state.set('step-updated', {
      id,
      section: 'assignee',
      value: userId
    })
  })

  el.querySelector('.mark-complete').addEventListener('click', (e) => {
    const stepEl = e.target.closest('.task-step')
    id = id || stepEl.id

    const completed = !state.get(`step-${id}`)
    state.set(`step-${id}`, completed)
    state.set('step-updated', { id, section: 'completed', value: completed })

    el.querySelector('.step-caption').classList.toggle('completed', completed)
    el.querySelector('.select-wrapper').setDisabled(completed)
  })

  el.querySelector('.fa-close').addEventListener('click', (e) => {
    if (!id) {
      // delete step that was added to the DOM
      // before getting an id from the server
      const stepEl = e.target.closest('.task-step')
      id = stepEl.id
    }
    state.set('step-deleted', { id })
  })
}
