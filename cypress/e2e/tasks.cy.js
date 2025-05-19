/* global beforeEach cy Cypress describe expect it */

const authToken = Cypress.env('authToken')

describe('template spec', () => {
  const newTitle = 'My test task'

  beforeEach(() => {
    cy.visit('/docs/tasks/index.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', authToken)
      },
    })
  })

  it('Create a new task', () => {
    console.log('create a new task')
    cy.getTestElement('tasks-form-input').as('input')
    cy.getTestElement('tasks-list').as('list')

    cy.get('@input').should('exist') // ensures the app's ready

    cy.get('@list').then(($list) => {
      const listEl = $list[0]
      const existing = getTaskByTitleFromListEl(listEl, newTitle)
      if (!existing) {
        cy.get('@input').type(`${newTitle}{enter}`)

        cy.get('@list').should(($newList) => {
          const newEl = $newList[0]
          const newTask = getTaskByTitleFromListEl(newEl, newTitle)
          expect(newTask).to.not.be.undefined
        })
      }
    })
  })

  it('Edit task title and details. Ensure colors are consistent', () => {
    console.log('edit task')
    cy.get('.td-item').first().as('item')
    cy.get('@item').click()

    cy.get('@item').then(($item) => {
      const item = $item[0]
      const parentColor = getComputedStyle(item).color

      const input = item.querySelector('input[name="title"]')
      const textarea = item.querySelector('textarea[name="details"]')

      const inputColor = getComputedStyle(input).color
      const textareaColor = getComputedStyle(textarea).color

      expect(inputColor).to.eq(parentColor)
      expect(textareaColor).to.eq(parentColor)

      cy.wrap(input).type(' updated')
      cy.wrap(textarea).type("My new task's details").blur()
    })
  })

  it('Delete task', () => {
    console.log('Delete task')
    cy.get('.td-item')
      .first()
      .click()
      .invoke('attr', 'data-id')
      .then((id) => {
        // Click the trash icon inside that item
        cy.get(`[data-id="${id}"] .fa-trash`).click()

        // Now assert it's gone
        cy.get(`[data-id="${id}"]`).should('not.exist')
      })
  })
})

// -------------------------------
// Helpers
// -------------------------------

/**
 *
 */
function getTaskByTitleFromListEl(listEl, title) {
  return listEl.getChildren().find((child) => child.title === title)
}
