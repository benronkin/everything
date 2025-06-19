import { beforeAll, describe, expect, it } from 'vitest'
import { createPill } from './pill.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'

beforeAll(() => {
  localStorage.setItem('debug', 'true')
  // log('main-documents', state.getSubscribers('main-documents'))
})

describe('Pill partial', () => {
  it('creates a pill with a check icon', () => {
    const pillEl = createPill({
      classes: { icon: 'fa-check' },
      isSelected: true,
    })
    const iEl = pillEl.querySelector('i')

    expect(pillEl.classList).toContain('active')
    expect(iEl.classList).not.toContain('hidden')

    pillEl.click()
    expect(pillEl.classList).not.toContain('active')
    expect(iEl.classList).toContain('hidden')
  })
})
