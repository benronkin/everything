/* global beforeEach cy Cypress describe expect it */

const authToken = Cypress.env('authToken')
describe('Custom recipe list functionality', () => {
  beforeEach(() => {
    cy.visit('/docs/recipes/index.html', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', authToken)
      },
    })
  })

  it('Custom recipe list in place', () => {
    cy.get('[data-id="left-panel-list0"]').should(
      'have.attr',
      'data-item-class',
      'list-item'
    )
  })
})
