import { injectStyle } from '../../assets/js/ui.js'
import { state } from '../../assets/js/state.js'
import { createList } from '../../assets/partials/list.js'
import { createSpan } from '../../assets/partials/span.js'
import { calendarListChildren } from '../../tasks/sections/calendarListChildren.js'
import { dueInfo } from '../../tasks/tasks.utils.js'

const css = `
.md-item:not(:last-child) {
    margin-bottom: 10px;
}
`

export function projectTasksList(doc) {
  injectStyle(css)

  const el = createList({
    id: 'tasks-list'
  })

  build(el, doc)

  return el
}

function build(el, doc) {
  el.deleteChildren()

  const docs = doc.items.filter((i) => i.type === 'task')
  const users = state.get('users')
  const user = state.get('user')

  const tasks = docs.map((task) => {
    if (task.starts_at) {
      task.dueInfo = dueInfo(task.starts_at)
    }

    if (task.assignee && task.assignee !== user.id) {
      const user = users.find((user) => user.id === task.assignee)
      if (!user) {
        console.log('users', users)
        throw new Error(
          `Oops, tasks.js cannot locate user with id "${task.assignee}"`
        )
      }
      task.assignedPeer = { name: user.first_name, color: user.color }
    }
    return task
  })

  if (!tasks.length) {
    el.appendChild(
      createSpan({
        className: 'c-gray3',
        html: `No tasks for this project`
      })
    )
    return
  }

  const children = calendarListChildren(tasks)
  // const children = docs.map(({ id, title, starts_at, className }) => {
  //   const obj = formatDateParts(starts_at)
  //   const startDate = `${obj.month}/${obj.day}/${obj.shortYear}`

  //   const html = [
  //     createSpan({ html: title }),
  //     createSpan({ html: `Due ${startDate}`, className: 'c-gray3' })
  //   ]
  //   return createMainDocumentLink({
  //     id,
  //     className: `md-item list-item ${className}`.trim(),
  //     html,
  //     url: `${state.getBaseUrl()}tasks/task.html?id=${id}`
  //   })
  // })

  el.addChildren(children)
}
