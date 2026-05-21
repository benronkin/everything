import { state } from '../../assets/js/state.js'
import { injectStyle } from '../../assets/js/ui.js'
import { createDateTime } from '../../assets/partials/dateTime.js'
import { createDiv } from '../../assets/partials/div.js'
import { createHeader } from '../../assets/partials/header.js'
import { createIcon } from '../../assets/partials/icon.js'
import { createInputGroup } from '../../assets/partials/inputGroup.js'
import { createMarkdown } from '../../assets/composites/markdown.js'
import { createSpan } from '../../assets/partials/span.js'
import { floatingMenu } from '../../assets/partials/floatingMenu.js'
import { createUserSelect } from '../../assets/partials/userSelect.js'
import { projectTasksList } from './projectTasksList.js'
import { projectNotesList } from './projectNotesList.js'
// import { projectJournalList } from './projectJournalList.js'

const css = `
#starts_at_wrapper {
  margin-top: 30px;
}
#note-header5 {
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
      classes: { group: '', input: 'w-100', icon: 'fa-square' },
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
        createSpan({ html: 'Assignee:' }),
        createUserSelect({
          id: 'assignee',
          name: 'assignee',
          caption: 'Assignee:',
          value: doc.assignee,
          users: state.get('users')
        })
      ]
    })
  )

  el.appendChild(
    createDiv({
      className: 'mt-30 mb-20 flex align-center gap-10 justify-start',
      html: [
        createHeader({ html: 'Details', type: 'h5', id: 'note-header5' }),
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
      className: 'mt-30 mb-20 flex align-center gap-10 justify-start',
      html: [
        createHeader({ html: 'Tasks', type: 'h5', id: 'note-header5' }),
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
      className: 'mt-30 mb-20 flex align-center gap-10 justify-start',
      html: [
        createHeader({ html: 'Notes', type: 'h5', id: 'note-header5' }),
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
  //     className: 'mt-30 mb-20 flex align-center gap-10 justify-start',
  //     html: [
  //       createHeader({ html: 'Journal', type: 'h5', id: 'note-header5' }),
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
