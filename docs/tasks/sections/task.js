import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDiv } from '../../assets/partials/div.js'
import { createButton } from '../../assets/partials/button.js'
import { createButtonGroup } from '../../assets/composites/buttonGroup.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createInput } from '../../assets/partials/input.js'
import { createSpan } from '../../assets/partials/span.js'
import { createSpanGroup } from '../../assets/partials/spanGroup.js'
import { createTextarea } from '../../assets/partials/textarea.js'
import { toLocalDateTimeStrings } from '../../assets/js/format.js'

const css = `
#schedule-wrapper {
  width: 200px;
  margin-top: 10px;
}
#schedule-selector-group {
  justify-content: space-between;
  margin: 10px 0;
}  
#add-schedule {
  margin: 0 auto;
}
#due-date {
  width: 82px;
}
.task-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.task-item #title {
  font-size: 1.5rem;
  border-bottom: none;
}
.task-item #title:hover {
  font-size: 1.5rem;
  border-bottom: 1px solid var(--gray2);
}
`

export function createTask() {
  injectStyle(css)

  const el = createDiv({ className: 'task-item' })

  react(el)

  return el
}

function react(el) {
  state.on('icon-click:back', 'task', () => {
    el.innerHTML = ''
  })

  state.on('active-doc', 'task', (id) => {
    if (!id) return
    buildAsync(el)

    const task = state.get('main-documents').find((t) => t.id === id)
    task.scheduleType = 'due'
    task.due = '2025-10-29T04:22:00.000Z'

    if (task.scheduleType) {
      document.querySelector('#add-schedule').click()
    }

    if (task.scheduleType === 'due') {
      const { date, time } = toLocalDateTimeStrings(task.due)
      el.querySelector('[name=due-date-input-date]').value = date
      el.querySelector('[name=due-date-input-time]').value = time
    }

    if (task.scheduleType === 'from-to') {
      const { date: dateFrom, time: timeFrom } = toLocalDateTimeStrings(
        task.from
      )
      el.querySelector('[name=from-input-date]').value = dateFrom
      el.querySelector('[name=from-input-time]').value = timeFrom
      const { date: dateTo, time: timeTo } = toLocalDateTimeStrings(task.to)
      el.querySelector('[name=to-input-date]').value = dateTo
      el.querySelector('[name=to-input-time]').value = timeTo
    }
  })

  state.on('button-click:add-schedule', 'task', () => {
    document.querySelector('#add-schedule').classList.add('hidden')
    document.querySelector('#set-schedule').classList.remove('hidden')
    document.querySelector('#delete-schedule').classList.remove('hidden')
    document
      .querySelector('#schedule-selector-group')
      .classList.remove('hidden')

    const id = state.get('active-doc')
    const task = state.get('main-documents').find((t) => t.id === id)
    if (task.scheduleType === 'from-to') {
      document.querySelector('#start-end').click()
    } else {
      document.querySelector('#due-date').click()
    }
  })

  state.on('icon-click:delete-schedule', 'task', () => {
    document.querySelector('#delete-schedule').classList.add('hidden')
    document.querySelector('#set-schedule').classList.add('hidden')
    document.querySelector('#add-schedule').classList.remove('hidden')
    document.querySelector('#schedule-selector-group').classList.add('hidden')
    document.querySelector('#due-date-wrapper').classList.add('hidden')
    document.querySelector('#from-to-wrapper').classList.add('hidden')
  })

  state.on('button-click:due-date', 'task', () => {
    document.querySelector('#due-date-wrapper').classList.remove('hidden')
    document.querySelector('#from-to-wrapper').classList.add('hidden')
  })

  state.on('button-click:start-end', 'task', () => {
    document.querySelector('#from-to-wrapper').classList.remove('hidden')
    document.querySelector('#due-date-wrapper').classList.add('hidden')
  })
}

function buildAsync(el) {
  const id = state.get('active-doc')
  const taskInfo = state.get('main-documents').find((task) => task.id === id)

  el.appendChild(
    createInput({
      id: 'title',
      name: 'title',
      value: taskInfo.title || '',
      placeholder: 'Task...',
    })
  )

  el.appendChild(
    createSpanGroup({
      classes: { group: 'mt-40 mb-20', icon: 'fa-circle-info' },
      html: 'Description',
    })
  )

  el.appendChild(
    createTextarea({
      id: 'details',
      name: 'details',
      value: taskInfo.details || '',
      placeholder: 'Add details...',
    })
  )

  const scheduleWrapper = createDiv({
    id: 'schedule-wrapper',
    className: 'outer-wrapper',
  })
  el.appendChild(scheduleWrapper)

  scheduleWrapper.appendChild(
    createDiv({
      className: 'flex align-center',
      html: [
        createButton({
          id: 'add-schedule',
          html: 'Add Schedule',
          className: 'primary',
        }),
        createSpan({
          id: 'set-schedule',
          html: 'SCHEDULE',
          className: 'hidden',
        }),
        createIcon({
          id: 'delete-schedule',
          classes: { primary: 'fa-trash', other: 'hidden' },
        }),
      ],
    })
  )

  scheduleWrapper.appendChild(
    createButtonGroup({
      id: 'schedule-selector-group',
      className: 'hidden',
      buttons: [
        { id: 'due-date', html: 'Due' },
        { id: 'start-end', html: 'Start/End' },
      ],
    })
  )

  const dueDateWrapper = createDiv({
    id: 'due-date-wrapper',
    className: 'hidden',
  })
  scheduleWrapper.appendChild(dueDateWrapper)
  const dueDateFlex = createDiv({ className: 'flex align-center' })
  dueDateWrapper.appendChild(dueDateFlex)
  dueDateFlex.appendChild(
    createInput({ name: 'due-date-input-date', type: 'date' })
  )
  dueDateFlex.appendChild(
    createInput({ name: 'due-date-input-time', type: 'time' })
  )

  const fromToWrapper = createDiv({
    id: 'from-to-wrapper',
    className: 'hidden',
  })
  scheduleWrapper.appendChild(fromToWrapper)
  const fromFlex = createDiv({ className: 'flex align-center' })
  fromToWrapper.appendChild(fromFlex)
  fromFlex.appendChild(createInput({ name: 'from-input-date', type: 'date' }))
  fromFlex.appendChild(createInput({ name: 'from-input-time', type: 'time' }))
  const toFlex = createDiv({ className: 'flex align-center' })
  fromToWrapper.appendChild(toFlex)
  toFlex.appendChild(createInput({ name: 'to-input-date', type: 'date' }))
  toFlex.appendChild(createInput({ name: 'to-input-time', type: 'time' }))
}
