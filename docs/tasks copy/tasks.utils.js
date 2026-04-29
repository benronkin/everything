import { createDiv } from '../assets/partials/div.js'
import { createIcon } from '../assets/partials/icon.js'
import { createTask } from './sections/task.js'

export function createDueLabel(dueInfo, viewMode) {
  let dueHTML = ''

  if (!dueInfo) return dueHTML

  if (viewMode === 'priority') {
    if (dueInfo.label === 'Overdue')
      dueHTML = createIcon({
        classes: {
          primary: 'fa-bell',
          other: ['danger-foreground', 'due-label'],
        },
      })
    if (dueInfo.label === 'Today')
      dueHTML = createIcon({
        classes: { primary: 'fa-bell', other: ['due-label'] },
      })
  }

  if (viewMode === 'calendar') {
    if (
      ['Today', 'Tomorrow'].includes(dueInfo.label) &&
      dueInfo.time !== '00:00'
    ) {
      dueHTML = createDiv({ html: dueInfo.time, className: 'due-label' })
    }
    if (['Later'].includes(dueInfo.label)) {
      dueHTML = createDiv({ html: dueInfo.date, className: 'due-label' })
    }
  }
  return dueHTML
}

export function createTaskHelper(doc, viewMode, expandable = true) {
  let dueHTML = createDueLabel(doc.dueInfo, viewMode)

  return createTask({
    id: doc.id,
    title: doc.title,
    details: doc.details,
    steps: doc.steps,
    startAt: doc.starts_at,
    dueInfo: dueHTML,
    expandable,
  })
}

export function dueInfo(isoString) {
  if (!isoString) return {}

  // Get the Parts
  const [givenDatePart, givenTimePart] = isoString.split('T')
  const hhMm = givenTimePart.slice(0, 5)
  const [givenYear, givenMonth, givenDay] = givenDatePart.split('-')
  const givenFormattedDate = `${givenMonth}/${givenDay}`

  // Get "Today" and "Tomorrow" as Strings in LOCAL time
  const now = new Date()
  const nowDatePart = now.toLocaleDateString('en-CA') // Returns "YYYY-MM-DD"

  const tomorrow = new Date()
  tomorrow.setDate(now.getDate() + 1)
  const tomorrowDatePart = tomorrow.toLocaleDateString('en-CA')

  let obj = {
    isoString,
    date: givenFormattedDate,
    time: hhMm,
  }

  if (givenDatePart < nowDatePart) {
    obj.label = 'Overdue'
  } else if (givenDatePart === nowDatePart) {
    obj.label = 'Today'
  } else if (givenDatePart === tomorrowDatePart) {
    obj.label = 'Tomorrow'
  } else {
    obj.label = 'Later'
  }

  return obj
}
