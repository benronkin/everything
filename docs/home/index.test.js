import { describe, it, expect } from 'vitest'
import { getNextPage, getSiteMap } from './home.js'

const siteMap = getSiteMap()

describe('Index redirect', () => {
  it('Redirects to tasks', () => {
    const nextPage = getNextPage([{}, {}])
    expect(nextPage).toBe(siteMap.getPath('tasks'))
  })

  it('Redirects to tasks if no tasks ', () => {
    const nextPage = getNextPage([], 'journal')
    expect(nextPage).toBe(siteMap.getPath('journal'))
  })

  it('Redirects to recipes by default', () => {
    const nextPage = getNextPage([], null)
    expect(nextPage).toBe(siteMap.getPath('recipes'))
  })
})
