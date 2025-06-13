import { beforeAll, describe, expect, it } from 'vitest'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'
import { addItemForm } from './addItemForm.js'
import { handleAddToBothLists } from '../shopping.handlers.js'

let el
beforeAll(() => {
  localStorage.setItem('debug', 'true')
  el = addItemForm()
  document.body.appendChild(el)
})

function simulateFormValue(value) {
  state.set('form-keyup:shopping-form', { value })
}

describe('addItemForm input functionality', () => {
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

describe('addItemForm addToBothButton functionality', () => {
  it('adds a new item and clicks addToBothButton', () => {
    const addToBothEl = el.querySelector('#add-to-both-lists-button')
    el.querySelector('input').value = 'berries'
    addToBothEl.dispatchEvent(new Event('click'))

    expect(addToBothEl.classList).toContain('hidden')

    handleAddToBothLists('berries')
    expect(state.get('shopping-list')).toContain('berries')
    expect(state.get('suggestions-list')).toContain('berries')
  })
})
