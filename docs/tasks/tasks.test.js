import { beforeAll, describe, done, expect, it } from 'vitest'
import { state } from '../assets/js/state.js'
import { fetchTasks } from './tasks.api.js'

beforeAll(async () => {
  localStorage.setItem(
    'authToken',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZW50IjoiYmEyMDIwYUB5YWhvby5jb20iLCJpYXQiOjE3NDk0OTI5ODh9.AHywnr4aQGEEXvEIpW21mltBO6mZuX8l1yEIfFrMqoQ'
  )
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
