import { beforeAll, describe, expect, it } from 'vitest'
import { shoppingItem } from './shoppingItem.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

beforeAll(() => {
  localStorage.setItem('debug', 'true')
  state.set('shopping-list', ['carrots'])
  state.set('suggestions-list', [])
  // log('main-documents', state.getSubscribers('main-documents'))
})

describe('Testing shoppingItem', () => {
  let item

  it('creates a shoppingItem', async () => {
    item = shoppingItem({ item: 'carrots' })
    document.body.appendChild(item)
    await Promise.resolve()
    const title = item.querySelector('.title')
    expect(title.tagName).toBe('SPAN')
    expect(title.innerHTML).toContain('carrots')

    item.querySelector('.fa-lightbulb').dispatchEvent(new Event('click'))
    expect(state.get('suggestions-list')).toContain('carrots')
  })

  it('clicks the add-to-suggestions icon', async () => {
    const addToSuggestIcon = item.querySelector('.fa-lightbulb')
    addToSuggestIcon.dispatchEvent(new Event('click'))
    expect(state.get('suggestions-list')).toContain('carrots')
    expect(addToSuggestIcon.classList).toContain('hidden')
  })
})
