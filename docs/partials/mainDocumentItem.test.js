import { describe, expect, it } from 'vitest'
import { newState } from '../js/newState.js'
import { createMainDocumentItem } from './mainDocumentItem'

describe('Creating a mainDocumentItem', () => {
  let el
  it('creates an item with class md-item', () => {
    el = createMainDocumentItem({ id: 'main-document-item-test' })
    expect(el.classList.contains('md-item')).toBe(true)
  })

  it('clicks it and expect an active-doc state', () => {
    el.click()
    expect(newState.get('active-doc')).toBeTruthy()
  })
})
