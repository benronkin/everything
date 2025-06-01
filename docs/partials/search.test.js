import { describe, it, expect } from 'vitest'
import { createSearch } from './search'

describe('Create search partial', () => {
  it('creates search with defeault search messages', () => {
    const el = createSearch()
    el.setSearchMessage(['', '', '', ''])
    expect(el.message).toBe('4 entries found')
  })
  it('creates search with custom search message', () => {
    const el = createSearch({ searchEntity: { singular: 'bookmark' } })
    el.setSearchMessage([''])
    expect(el.message).toBe('1 bookmark found')
  })
})
