import { describe, it, expect } from 'vitest'
import { newState } from '../js/newState.js'
import { createList } from './list.js'
import { createListItem } from './listItem.js'
import { createTitleDetailsItem } from './titleDetailsItem.js'
import { createRightDrawer } from '../sections/rightDrawer.js'
import { setStateAfterPartials } from '../journal/stateAfterPartials.js'

let listEl

describe('creating a list for listItem', () => {
  it('creates a list element with default itemClass', () => {
    listEl = createList({ id: 'test-list', itemClass: 'list-item' })
    expect(listEl.itemClass).toBe('list-item')
    expect(listEl.tagName).toBe('DIV')
    expect(listEl.classList.contains('list')).toBe(true)
  })

  it('creates two children with different itemClasses', () => {
    const goodChild = createListItem()
    const badChild = createTitleDetailsItem()
    listEl.addChild(goodChild)
    expect(listEl.length).toBe(1) // listEl is set with itemClass td-item
    listEl.deleteChildren()
    expect(() => {
      listEl.addChild(badChild)
    }).toThrowError() // test that wrong child
  })
})

describe('Creating a right drawer', () => {
  const listEl = createRightDrawer({
    id: 'test-list',
    active: 'journal',
    itemClass: 'menu-item',
  })
  expect(listEl.itemClass).toBe('list-item')

  it('adds three listItems', () => {
    const fourthChild = listEl.getChildById('rd-item-journal')
    expect(fourthChild.selected).toBe(true)
    expect(fourthChild.url).toBe('../journal/index.html')
  })
})

describe('Creating a list of mainDocumentItems', () => {
  it('expects that list.js subscribed to a main-documents state', () => {
    delete newState._listeners['main-documents']
    listEl = createList({ id: 'main-documents-list', itemClass: 'md-item' })
    expect(newState.getSubscribers('main-documents')).includes('list.js')
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
    expect(listEl.getChildren()[1].classList.contains('md-item')).toBe(true)
  })

  it('expects item id def456 to be selected', () => {
    expect(listEl.getChildById('def456').selected).toBe(true)
  })
})
