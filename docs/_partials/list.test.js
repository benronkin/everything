import { describe, it, expect } from 'vitest'
import { createList } from './list.js'
import { createListItem } from './listItem.js'
import { createTitleDetailsItem } from './titleDetailsItem.js'
import { createRightDrawer } from '../sections/rightDrawer.js'

let listEl

describe('Creating a list for listItem', () => {
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

  it('clicks on two items and only one is selected', () => {
    listEl.deleteChildren()
    listEl.addChildren([
      createListItem({ id: 'abc123' }),
      createListItem({ id: 'def456' }),
    ])
    listEl.getNthChild(0).click()
    listEl.getNthChild(1).click()
    expect(listEl.querySelectorAll('[data-selected="true"]').length).toBe(1)
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
