/* global process */
import { beforeAll, describe, expect, it } from 'vitest'
import { state } from '../assets/js/state.js'
import { fetchTasks } from './tasks.api.js'

beforeAll(async () => {
  localStorage.setItem('authToken', process.env.AUTH_TOKEN)
})

async function setAndFetchTasks() {
  const { tasks } = await fetchTasks()
  state.set('main-documents', tasks)
}

describe('Tests tasks', () => {
  it('Looks for main documents', () => {
    return new Promise((resolve, reject) => {
      // 1. Set up the listener first
      state.on('main-documents', 'tasks.test', (docs) => {
        try {
          expect(docs.length).toBeGreaterThan(0)
          resolve() // Test passes
        } catch (error) {
          reject(error) // Test fails with the correct error layout
        }
      })

      // 2. Trigger the action that fires the event
      setAndFetchTasks().catch(reject)
    })
  })
})
