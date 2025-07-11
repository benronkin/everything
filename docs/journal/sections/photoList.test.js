import { beforeAll, describe, expect, it, vi } from 'vitest'
import { state } from '../../assets/js/state'
import { photoList } from './photoList.js'
// import { log } from '../../assets/js/logger.js'

beforeAll(() => {
  localStorage.setItem('debug', 'true')
})

describe('Photo gallery for the active-doc', () => {
  it('creates two photoItems for active-doc', async () => {
    const photoListEl = photoList({ id: 'test-123' })
    document.body.appendChild(photoListEl)

    vi.mock('../journal.api.js', () => ({
      fetchEntryPhotosMetadata: vi.fn(() =>
        Promise.resolve({
          photos: [
            { id: 'p1', url: 'url1', caption: 'Caption 1' },
            { id: 'p2', url: 'url2', caption: 'Caption 2' },
          ],
          error: null,
        })
      ),
    }))

    const doc = {
      id: 'def456',
      location: "Don't yell at me",
      visit_date: '2025-06-23T',
    }

    state.set('active-doc', doc.id)

    await photoListEl.showPhotos()

    expect(photoListEl.getNthChild(0).querySelector('img').src).toBe('url1')
  })
})
