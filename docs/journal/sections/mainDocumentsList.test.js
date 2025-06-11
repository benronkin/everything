import { beforeAll, describe, it, expect } from 'vitest'
import { state } from '../../js/state.js'
import { mainDocumentsList } from './mainDocumentsList.js'
// import { log } from '../../js/logger.js'

let mdListEl
let mdItemEl

beforeAll(() => {
  localStorage.setItem('debug', 'true')
  // log('main-documents', state.getSubscribers('main-documents'))
})

describe('Creating a list of mainDocumentItems', () => {
  it('expects that list.js subscribed to a main-documents state', () => {
    delete state._listeners['main-documents']
    mdListEl = mainDocumentsList({
      id: 'main-documents-list',
    })
    expect(state.getSubscribers('main-documents')).toContain(
      'mainDocumentsList'
    )
  })

  it('expects list to have two mainDocumentItems', () => {
    state.set('main-documents', [
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
    ])

    mdItemEl = mdListEl.getChildren()[1]
    expect(mdItemEl.classList).toContain('md-item')
  })

  it('expects item id def456 to be in the active-docs', () => {
    mdItemEl.click()

    expect(state.get('active-doc').id).toEqual('def456')
  })
})
