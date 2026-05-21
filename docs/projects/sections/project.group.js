import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDateTime } from '../../assets/partials/dateTime.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createMarkdown } from '../../assets/composites/markdown.js'
import { createSpan } from '../../assets/partials/span.js'
import { createUserSelect } from '../../assets/partials/userSelect.js'
import { projectTasksList } from './projectTasksList.js'
import { projectNotesList } from './projectNotesList.js'
// import { projectJournalList } from './projectJournalList.js'

const css = `
#starts_at_wrapper {
  margin-top: 30px;
}
.header-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 30px 0 10px;
}
.header-with-icon h4 {
  margin: 0;
}
`

export function createprojectGroup(doc) {
  injectStyle(css)

  const el = createDiv({
    id: 'project-body'
  })

  build(el, doc)

  return el
}

function build(el, doc) {
  el.appendChild(
    createInputGroup({
      id: 'title',
      name: 'title',
      placeholder: 'Title',
      autocomplete: 'off',
      classes: {
        group: '',
        input: 'bigger border-bottom-on-hover w-100',
        icon: 'fa-square'
      },
      value: doc.title || ''
    })
  )

  el.appendChild(
    createDiv({
      className: 'flex align-center gap-20 justify-start mt-20',
      html: [
        createSpan({ html: 'Start:' }),
        createDateTime({ name: 'starts_at', value: doc.starts_at })
      ]
    })
  )

  el.appendChild(
    createDiv({
      className: 'flex align-center gap-20 justify-start mt-20',
      html: [
        createSpan({ html: 'End:&nbsp;&nbsp;' }),
        createDateTime({ name: 'ends_at', value: doc.ends_at })
      ]
    })
  )

  el.appendChild(
    createDiv({
      className:
        'flex justify-start align-center mt-20 project-assignee-wrapper',
      html: [
        createSpan({ html: 'Owner:' }),
        createUserSelect({
          id: 'assignee',
          name: 'assignee',
          caption: 'Owner:',
          value: doc.assignee,
          users: state.get('users')
        })
      ]
    })
  )

  el.appendChild(
    createDiv({
      className: 'header-with-icon',
      html: [
        createHeader({
          html: 'Details',
          type: 'h4'
        }),
        createIcon({
          id: 'notes-toggle',
          classes: {
            primary: 'fa-pencil',
            secondary: 'fa-close',
            other: ['primary']
          }
        })
      ]
    })
  )

  el.appendChild(
    createMarkdown({
      name: 'details',
      id: 'details',
      className: 'mb-20 w-100',
      toggleId: 'notes-toggle',
      value: doc.details || '',
      placeholder: 'Add details for this project...'
    })
  )

  el.appendChild(
    createDiv({
      className: 'header-with-icon',
      html: [
        createHeader({ html: 'Tasks', type: 'h4' }),
        createIcon({
          id: 'add-task',
          classes: {
            primary: 'fa-plus',
            other: ['primary']
          }
        })
      ]
    })
  )

  el.appendChild(projectTasksList(doc))

  el.appendChild(
    createDiv({
      className: 'header-with-icon',
      html: [
        createHeader({ html: 'Notes', type: 'h4' }),
        createIcon({
          id: 'add-note',
          classes: {
            primary: 'fa-plus',
            other: ['primary']
          }
        })
      ]
    })
  )

  el.appendChild(projectNotesList(doc))

  // el.appendChild(
  //   createDiv({
  //     className: 'header-with-icon',
  //     html: [
  //       createHeader({ html: 'Journal', type: 'h5', class: 'header-with-icon' }),
  //       createIcon({
  //         id: 'add-journal',
  //         classes: {
  //           primary: 'fa-plus',
  //           other: ['primary'],
  //         },
  //       }),
  //     ],
  //   }),
  // )

  // el.appendChild(projectJournalList(doc))
}
