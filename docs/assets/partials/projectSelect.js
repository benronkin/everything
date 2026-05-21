import { createSelect } from './select.js'
import { injectStyle } from '../js/ui.js'

const css = `
select {
  font-size: 1.5rem;
}
select option {
  font-size: 1.5rem;
}
.project-select {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  background-color: var(--teal2);
}

.custom-select:disabled, 
.select-wrapper.disabled .fa-caret-down {
color: var(--gray2) !important;
}

`

export function createProjectSelect(obj) {
  injectStyle(css)

  const { id, className, name, value, projects = [], setUpdateState } = obj

  const options = projects.map((project) => ({
    label: project.title,
    value: project.id
  }))

  const el = createSelect({
    id,
    className,
    name,
    value,
    options,
    setUpdateState
  })

  el.classList.add('project-select')

  listen(el)

  el._projects = projects
  el.setproject = setproject.bind(el)

  if (value) {
    el.setproject(value)
  }

  return el
}

function listen(el) {
  el.addEventListener('change', () => {})
}

/**
 *
 */
function setproject(id) {
  this.selectByValue(id)
}
