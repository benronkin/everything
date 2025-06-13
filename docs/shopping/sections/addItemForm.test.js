import { beforeAll, describe, expect, it } from 'vitest'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'
import { addItemForm } from './addItemForm.js'

let el
beforeAll(() => {
  localStorage.setItem('debug', 'true')
  el = addItemForm()
  document.body.appendChild(el)
})

function simulateFormValue(value) {
  state.set('form-keyup:shopping-form', { value })
}

describe('Test addItemForm functionality', () => {
  it('adds undefined', () => {
    simulateFormValue(undefined)
    expect(el.querySelector('#add-to-both-lists-button').classList).toContain(
      'hidden'
    )
  })

  it('adds an existing item', () => {
    state.set('shopping-list', ['carrots'])
    state.set('suggestions-list', ['milk'])

    simulateFormValue('carrots')

    expect(el.querySelector('#add-to-both-lists-button').classList).toContain(
      'hidden'
    )

    expect(el.querySelector('input').classList).toContain('c-gray3')

    expect(el.querySelector('#shopping-form-icon').classList).toContain(
      'c-gray3'
    )

    expect(el.querySelector('#shopping-form-icon').classList).toContain(
      'fa-cart-arrow-down'
    )

    expect(el.querySelector('#shopping-form-icon').classList).not.toContain(
      'fa-cart-shopping'
    )
  })

  it('adds a valid item', () => {
    state.set('shopping-list', ['carrots'])
    state.set('suggestions-list', ['milk'])

    simulateFormValue('pears')

    expect(
      el.querySelector('#add-to-both-lists-button').classList
    ).not.toContain('hidden')

    expect(el.querySelector('input').classList).not.toContain('c-gray3')

    expect(el.querySelector('#shopping-form-icon').classList).not.toContain(
      'c-gray3'
    )

    expect(el.querySelector('#shopping-form-icon').classList).not.toContain(
      'fa-cart-arrow-down'
    )

    expect(el.querySelector('#shopping-form-icon').classList).toContain(
      'fa-cart-shopping'
    )
  })
})
