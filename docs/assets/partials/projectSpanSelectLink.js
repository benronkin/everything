import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createSpan } from './span.js'
import { createProjectSelect } from './projectSelect.js'
import { state } from '../js/state.js'

const css = `
`

/**
 *
 */
export function createProjectSpanSelectLink(doc) {
  injectStyle(css)

  const el = createDiv({
    className: 'flex justify-start align-center mt-20 project-span-select-link'
  })

  build({ el, doc })
  react()
  listen(el)

  el.update = update.bind(el)

  return el
}

/**
 *
 */
function build({ el, doc }) {
  el.appendChild(createSpan({ html: 'Project:' }))

  const obj = {
    id: 'project',
    name: 'project',
    caption: 'Project:'
  }

  let otherClassString = 'primary hidden'

  if (doc.projects) {
    obj.value = doc.assignedProject
    obj.projects = doc.projects
    otherClassString = 'primary'
  }

  el.appendChild(createProjectSelect(obj))

  el.appendChild(
    createIcon({
      id: 'link-to-project',
      classes: {
        primary: 'fa-circle-right',
        other: [otherClassString]
      }
    })
  )
}

/**
 *
 */
function react() {
  state.on('icon-click:link-to-project', 'projectSpanSelectLink', () => {
    const doc = state.get('main-documents')[0]

    window.location = `../projects/project.html?id=${doc.assignedProject}`
  })
}

/**
 *
 */
function listen(el) {
  el.querySelector('select').addEventListener('change', (e) => {
    el.querySelector('#link-to-project').classList.toggle(
      'hidden',
      !e.target.value
    )
  })
}

/**
 *
 */
function update(doc) {
  this.querySelector('.select-wrapper').setOptions(
    doc.projects.map((project) => ({
      label: project.title,
      value: project.id
    }))
  )

  this.querySelector('.select-wrapper').selectByValue(doc.assignedProject)

  this.querySelector('#link-to-project').classList.toggle(
    'hidden',
    !doc.assignedProject
  )
}
