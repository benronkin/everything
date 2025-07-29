/* global beforeEach cy Cypress describe expect it */

const authToken = Cypress.env('authToken')

describe('CRUD task', () => {
  const newTitle = 'My test task'

  beforeEach(() => {
    cy.visit('/docs/tasks/index.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', authToken)
      },
    })
  })

  it('Create a new task', () => {
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
    cy.get('.td-item:first')
      .then(($el) => expandItem($el))
      .then(() => {
        cy.get('input[name="title"]:first')
          .should('have.css', 'color', 'rgb(126, 63, 242)')
          .type(' updated')

        cy.get('textarea[name="details"]:first')
          .should('have.css', 'color', 'rgb(126, 63, 242)')
          .type("My new task's details")
          .blur()
      })
  })

  it('Delete task', () => {
    cy.get('.td-item:first')
      .as('item')
      .then(($el) => {
        const el = $el[0]
        const itemId = el.getAttribute('data-id')
        expandItem($el)

        cy.get('@item').find('.fa-trash').click()

        // Now assert it's gone
        cy.get(`[data-id="${itemId}"]`).should('not.exist')
      })
  })
})

describe('Interacting with tasks', () => {
  beforeEach(() => {
    cy.visit('/docs/tasks/index.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', authToken)
      },
    })

    cy.get('.td-item').then(($els) => {
      if ($els.length) {
        const els = [...$els]
        els.forEach((el) => {
          const id = el.dataset.id
          cy.get(`.td-item[data-id="${id}"] .fa-trash`).then(($trash) => {
            if (!$trash[0].className.includes('hidden')) {
              cy.wrap($trash).click()
            } else {
              cy.get(`.td-item[data-id="${id}"] [data-target="expander"]`)
                .click()
                .then(() => {
                  cy.get(`.td-item[data-id="${id}"] .fa-trash`).click()
                })
            }
          })
        })
      }
    })
  })

  it('Adding a task should show it expanded', () => {
    cy.getTestElement('tasks-form-input').as('input')

    cy.get('@input').type(`Task must be expanded{enter}`)
    cy.get('textarea').should('be.visible')
  })

  it('Adding a second task should select it and unselect the first task', () => {
    cy.getTestElement('tasks-form-input').as('input')

    cy.get('@input').type(`Task must be unselected{enter}`)
    cy.get('@input').type(`Task must be selected{enter}`)

    cy.get('.td-item[data-selected="true"').should('have.length', 1)
  })

  it('Clicking inside title or details must not collapse an expanded task', () => {
    cy.getTestElement('tasks-form-input').type(
      `Task must remain expanded{enter}`
    )
    cy.get('.header > input').click()
    cy.get('textarea').should('be.visible').click().should('be.visible')
  })
})

function getTaskByTitleFromListEl(listEl, title) {
  return listEl.getChildren().find((child) => child.title === title)
}

/**
 * Click the chevron-up icon to show details
 */
function expandItem($item) {
  const item = $item[0]
  const expander = item.querySelector('[data-target="expander"]')
  if (!expander) {
    throw new Error("Oops, task expander wasn't found")
  }

  const isExpanded = expander.classList.contains('fa-chevron-down')
  if (isExpanded) {
    return
  }

  cy.wrap(item.querySelector('[data-target="expander"]')).click()
}
