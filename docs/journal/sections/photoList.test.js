import { describe, expect, it, vi } from 'vitest'
import { newState } from '../../_assets/js/newState'
import { createImageGalleryList } from './imageGalleryList'
// import { setStateAfterPartials } from '../journal/stateAfterPartials.js'

describe('Image gallery for the active-doc', () => {
  let igListEl

  it('creates an image gallery list', () => {
    igListEl = createImageGalleryList({ id: 'test-123' })

    expect(igListEl.itemClass.includes('ig-item')).toBe(true)
    expect(newState.getSubscribers('active-doc')).includes('imageGalleryList')
  })

  it('creates two imageGalleryItems for active-doc', () => {
    // the list
    // const journalEntries = [
    //   {
    //     id: 'abc123',
    //     location: 'Seattle Opera',
    //     visit_date: '2025-05-12T',
    //   },
    //   {
    //     id: 'def456',
    //     location: "Don't yell at me",
    //     visit_date: '2025-06-23T',
    //   },
    // ]
    // setStateAfterPartials(journalEntries)

    vi.mock('../_assets/js/r2MetaData.js', () => ({
      getR2MetaData: vi.fn(() =>
        Promise.resolve([
          { id: 'p1', url: 'url1', caption: 'Caption 1' },
          { id: 'p2', url: 'url2', caption: 'Caption 2' },
        ])
      ),
    }))

    newState.set('active-doc', {
      id: 'def456',
      location: "Don't yell at me",
      visit_date: '2025-06-23T',
    })
  })
})
