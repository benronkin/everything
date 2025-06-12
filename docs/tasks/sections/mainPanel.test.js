import { beforeAll, describe, expect, it } from 'vitest'
import { mainPanel } from './mainPanel.js'
import { state } from '../../assets/js/state.js'
import { log } from '../../assets/js/ui.js'

beforeAll(() => {
  localStorage.setItem('debug', 'true')
  // log('main-documents', newState.getSubscribers('main-documents'))
})

describe('Create a task', () => {
  it('submits a task title and form-submit state is set', () => {
    const mainPanelEl = mainPanel()
    document.body.appendChild(mainPanelEl)
    const inputEl = mainPanelEl.querySelector('input[name="task"]')
    inputEl.value = 'test-1-2-3'

    inputEl.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13, // optional but useful for older handlers
        which: 13, // same here
        bubbles: true,
      })
    )

    expect(state.get('form-submit:tasks-form')).toStrictEqual({
      id: 'tasks-form',
    })
  })
})
