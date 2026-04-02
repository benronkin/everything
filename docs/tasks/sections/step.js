import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createIcon } from '../../assets/partials/icon.js'

const css = `
.task-step {
  display: flex;
  margin: 10px;
  align-items: center;
  padding: 5px;
}
.task-step:hover {
  background: var(--gray1);
}
.task-step div {
  margin: 0 auto 0 10px;
}
.task-step .step-caption {
  color: inherit;
  text-decoration: none;
}
.task-step .step-caption.completed {
  color: var(--gray3);
  text-decoration: line-through;
}
.task-step .mark-complete {
  width: 9px;
  margin-right: 10px;
  color: var(--gray6);
}
.task-step .fa-circle-check {
  color: var(--teal3);
}
`

export function createStep({ caption, completed = false, id } = {}) {
  injectStyle(css)

  const el = createDiv({
    id,
    className: 'task-step',
  })

  build(el)
  listen(el, id)
  react(el, id)

  el.querySelector('.step-caption').innerHTML = caption

  state.set(`step-${id}`, completed)
  if (completed) el.querySelector('.mark-complete').toggleClasses()

  return el
}

function build(el) {
  el.appendChild(
    createIcon({
      classes: {
        primary: 'fa-circle',
        secondary: 'fa-circle-check',
        other: ['mark-complete'],
      },
      useFaRegular: true,
    }),
  )

  el.appendChild(createDiv({ className: 'step-caption' }))

  el.appendChild(createIcon({ classes: { primary: 'fa-close' } }))
}

function listen(el, id) {
  el.querySelector('.mark-complete').addEventListener('click', () => {
    const completed = !state.get(`step-${id}`)
    state.set(`step-${id}`, completed)
    state.set('step-updated', { id, completed })
  })

  el.querySelector('.fa-close').addEventListener('click', () => {
    state.set('step-deleted', { id })
  })
}

function react(el, id) {
  state.on(`step-${id}`, 'step', (completed) => {
    el.querySelector('.step-caption').classList.toggle('completed', completed)
  })
}
