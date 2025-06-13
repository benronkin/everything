import { beforeAll, describe, expect, it, vi } from 'vitest'
import { state } from '../assets/js/state.js'
import { handleAddItem } from './shopping.handlers.js'
import { log } from '../assets/js/logger.js'

beforeAll(() => {
  localStorage.setItem('debug', 'true')
})

describe('Adding items to shopping list', () => {
  // define shared mock function at module scope
  const upodateShoppingList = vi.hoisted(() => vi.fn())
  // wire mock
  vi.mock('./shopping.api.js', () => ({
    upodateShoppingList,
  }))

  it('adds an empty string', async () => {
    const resp = await handleAddItem('')
    expect(resp).toBe(undefined)
  })

  it('adds an existing item', async () => {
    state.set('shopping-list', ['carrots'])
    const { message } = await handleAddItem('carrots')
    expect(message).toEqual('carrots already on the list')
  })

  it('adds a valid item', async () => {
    upodateShoppingList.mockReturnValue({}) // no error

    await handleAddItem('chocolate')
    expect(state.get('shopping-list')).toContain('chocolate')
  })

  it('adds and gets a server error', async () => {
    upodateShoppingList.mockReturnValue({ error: 'Some server error occured' })

    state.set('shopping-list', ['carrots'])
    const { error } = await handleAddItem('bad apple')
    expect(error).toEqual('Some server error occured')
  })
})
