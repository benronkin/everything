import { describe, it, expect } from 'vitest'
import { createList } from './list.js'
import { createListItem } from './listItem.js'
import { createTitleDetailsItem } from './titleDetailsItem.js'
import { createRightDrawer } from './rightDrawer.js'

describe('create a list for listItem', () => {
  let listEl
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

describe('create a right drawer', () => {
  const listEl = createRightDrawer({ id: 'test-list', active: 'journal' })
  expect(listEl.itemClass).toBe('list-item')

  it('adds three listItems', () => {
    const fourthChild = listEl.getChildById('rd-item-journal')
    expect(fourthChild.selected).toBe(true)
    expect(fourthChild.url).toBe('../journal/index.html')
  })
})
