import { describe, it, expect } from 'vitest'
import { createList } from './list.js'
import { createListItem } from './listItem.js'
import { createTitleDetailsItem } from './titleDetailsItem.js'

let listEl

describe('create a list for textDetailsItems', () => {
  it('creates a list element with default itemClass', () => {
    listEl = createList({ id: 'test-list', itemClass: 'td-item' })
    expect(listEl.itemClass).toBe('td-item')
    expect(listEl.tagName).toBe('DIV')
    expect(listEl.classList.contains('list')).toBe(true)
  })
})

describe('getChildren', () => {
  it('creates two children with different itemClasses', () => {
    const goodChild = createTitleDetailsItem()
    const badChild = createListItem()
    listEl.addChild(goodChild)
    expect(listEl.length).toBe(1) // listEl is set with itemClass td-item
    listEl.deleteChildren()
    expect(() => {
      listEl.addChild(badChild)
    }).toThrowError() // test that wrong child
  })
})
