import { injectStyle } from '../js/ui.js'
import { createDiv } from './div.js'
import { createIcon } from './icon.js'
import { createSpan } from './span.js'
import { createProjectSelect } from './projectSelect.js'
import { state } from '../js/state.js'

const css = `
#click-to-select-project  {
  background-color: var(--teal2);
  padding: 5px 7px;
}


#link-to-project {
  background-color: var(--teal2);
  padding: 5px;
}
#project {
  padding: 12px;
}
`

/**
 *
 */
export function createProjectPrompt(doc) {
  injectStyle(css)

  const el = createDiv({
    className: 'flex justify-start align-center mt-20 project-span-select-link'
  })

  build({ el, doc })
  react(el)
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

  if (doc.projects) obj.projects = doc.projects
  if (doc.assignedProject) obj.value = doc.assignedProject

  el.appendChild(
    createIcon({
      id: 'click-to-select-project',
      classes: {
        primary: 'fa-chevron-right'
      }
    })
  )

  el.appendChild(createProjectSelect(obj))

  el.appendChild(
    createIcon({
      id: 'link-to-project',
      classes: {
        primary: 'fa-circle-right'
      }
    })
  )

  if (doc.assignedProject) {
    el.querySelector('#click-to-select-project').classList.add('hidden')
  } else {
    el.querySelector('.select-wrapper').classList.add('hidden')
    el.querySelector('#link-to-project').classList.add('hidden')
  }
}

/**
 *
 */
function react(el) {
  state.on('icon-click:link-to-project', 'projectSpanSelectLink', () => {
    const linkEl = el.querySelector('#link-to-project')
    const parent = linkEl.closest('.project-span-select-link')
    const select = parent.querySelector('select')
    const value = select.value

    window.location = `../projects/project.html?id=${value}`
  })
}

/**
 *
 */
function listen(el) {
  el.querySelector('#click-to-select-project').addEventListener(
    'click',
    (e) => {
      e.target.classList.add('hidden')
      el.querySelector('.select-wrapper').classList.remove('hidden')
      el.querySelector('select').click()
    }
  )
  el.querySelector('select').addEventListener('change', (e) => {
    el.querySelector('#link-to-project').classList.toggle(
      'hidden',
      !e.target.value
    )
    el.querySelector('.select-wrapper').classList.toggle(
      'hidden',
      !e.target.value
    )
    el.querySelector('#click-to-select-project').classList.toggle(
      'hidden',
      e.target.value
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

  this.querySelector('.select-wrapper').classList.toggle(
    'hidden',
    !doc.assignedProject
  )

  this.querySelector('#link-to-project').classList.toggle(
    'hidden',
    !doc.assignedProject
  )

  this.querySelector('#click-to-select-project').classList.toggle(
    'hidden',
    !!doc.assignedProject
  )
}
