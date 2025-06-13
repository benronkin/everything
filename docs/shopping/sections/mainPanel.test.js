import { beforeAll, describe, expect, it } from 'vitest'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/logger.js'
import { mainPanel } from './mainPanel.js'

beforeAll(() => {
  localStorage.setItem('debug', 'true')
  // log('main-documents', state.getSubscribers('main-documents'))
})

let mainPanelEl

describe('Test addToBothLists button', () => {
  it('verifies that the button exists', () => {
    mainPanelEl = mainPanel()
    document.body.appendChild(mainPanelEl)

    const addToBothEl = mainPanelEl.querySelector('#add-to-both-lists-button')

    expect(addToBothEl).toBeTruthy()
  })
})
