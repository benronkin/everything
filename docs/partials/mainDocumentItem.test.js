import { describe, expect, it } from 'vitest'
import { newState } from '../js/newState.js'
import { createMainDocumentItem } from './mainDocumentItem'
import { setStateAfterPartials } from '../journal/stateAfterPartials.js'

describe('Creating a mainDocumentItem', () => {
  let el
  it('creates an item with class md-item', () => {
    el = createMainDocumentItem({ id: 'def456' })
    expect(el.classList.contains('md-item')).toBe(true)
  })

  it('clicks it and expect an active-doc state', () => {
    // first, set main-documents where one doc has
    // the same id as the md-item's
    const journalEntries = [
      {
        id: 'abc123',
        location: 'Seattle Opera',
        visit_date: '2025-05-12T',
      },
      {
        id: 'def456',
        location: "Don't yell at me",
        visit_date: '2025-06-23T',
      },
    ]
    setStateAfterPartials(journalEntries)

    el.click()
    expect(newState.get('active-doc')).toBeTruthy()
  })
})
