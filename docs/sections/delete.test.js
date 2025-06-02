import { beforeAll, describe, expect, it } from 'vitest'
import { newState } from '../js/newState.js'
import { makeReactive } from '../journal/reactivity.js'
import { setStateBeforePartials } from '../journal/stateBeforePartials'
import { createDelete } from './delete.js'

let el

beforeAll(() => {
  setStateBeforePartials()
  makeReactive()
  el = createDelete()
  document.querySelector('body').appendChild(el)

  newState.set('active-doc', {
    id: 'abc123',
    location: 'Kirkland Brewery',
    visit_date: '2024-04-18T',
  })
})

describe('Create a delete section', () => {
  it('creates a delete wrapper', () => {
    expect(el.tagName).toBe('DIV')
    expect(el.classList.contains('delete-wrapper')).toBe(true)
  })
  it('sets a Delete entry header', () => {
    const dz = el.querySelector('.danger-zone')
    expect(dz.querySelector('#danger-zone-header').textContent).toBe(
      'Delete entry'
    )
  })
  it("populates dialog's body from state", () => {
    const modal = el.querySelector('#modal-delete')
    expect(modal).not.toBeNull()
    expect(modal.querySelector('#modal-delete-body').textContent).toBe(
      'Kirkland Brewery (04/18)'
    )
  })
  it('adds password field to dialog', () => {
    const modal = el.querySelector('#modal-delete')
    expect(modal.querySelector('#modal-delete-input')).toBeTruthy()
  })
  it('responds to a dangerZone button click to open modal', () => {
    // trigger a dangerZone click
    const showModalIcon = el.querySelector('#show-delete-modal-icon')
    showModalIcon.click()
    // button partial should set state
    expect(newState.get('show-delete-modal-icon-click')).toBeTruthy()
    // modal should react to the state change
    const modal = el.querySelector('#modal-delete')
    expect(modal.dataset.vitest).toBe('modal-open')
  })
})
