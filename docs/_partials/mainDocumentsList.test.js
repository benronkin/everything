import { describe, it, expect } from 'vitest'
import { newState } from '../_assets/js/newState.js'
import { createMainDocumentsList } from './mainDocumentsList.js'
import { setStateAfterPartials } from '../journal/stateAfterPartials.js'

let mdListEl

describe('Creating a list of mainDocumentItems', () => {
  it('expects that list.js subscribed to a main-documents state', () => {
    delete newState._listeners['main-documents']
    mdListEl = createMainDocumentsList({
      id: 'main-documents-list',
      itemClass: 'md-item',
    })
    expect(newState.getSubscribers('main-documents')).includes(
      'mainDocumentsList'
    )
  })

  it('expects list to have two mainDocumentItems', () => {
    newState.set('active-doc', {
      id: 'def456',
      location: "Don't yell at me",
      visit_date: '2025-06-23T',
    })

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
    expect(mdListEl.getChildren()[1].classList.contains('md-item')).toBe(true)
  })

  it('expects item id def456 to be selected', () => {
    expect(mdListEl.getChildById('def456').selected).toBe(true)
  })
})
