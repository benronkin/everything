import { beforeAll, describe, expect, it, vi } from 'vitest'
import { newState } from '../_assets/js/newState.js'
import { dangerZone } from '../journal/sections/dangerZone.js'

let el

beforeAll(() => {
  el = dangerZone()
  document.querySelector('body').appendChild(el)

  newState.set('active-doc', {
    id: 'abc123',
    location: 'Kirkland Brewery',
    visit_date: '2024-04-18T22:00:00.000Z',
  })
})

describe('Create a dangerZone section', () => {
  it('sets a dangerZone entry header', () => {
    expect(el.querySelector('#danger-zone-header').textContent).toBe(
      'Delete entry'
    )
  })

  const mockedShowModal = () =>
    Promise.resolve({
      showModal() {
        console.log('Mocking modal.showModal')
      },
    })

  it('responds to a dangerZone button click to open modal', () => {
    const modal = el.querySelector('#modal-delete')
    modal.showModal = vi.fn(mockedShowModal) // mock fetch

    expect(modal).not.toBeNull()
    expect(modal.querySelector('#modal-delete-input')).toBeTruthy()

    // trigger a dangerZone click
    const showModalIcon = el.querySelector('#show-delete-modal-icon')
    showModalIcon.click()

    expect(newState.get('icon-click:show-delete-modal-icon')).toBeTruthy()
    expect(modal.querySelector('#modal-delete-body').textContent).toBe(
      'Kirkland Brewery (4/18)'
    )
    // modal should react to the state change
    expect(modal.dataset.vitest).toBe('modal-open')
  })
})
