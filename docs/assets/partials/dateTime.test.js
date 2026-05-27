/* global process */
import { beforeAll, describe, expect, it } from 'vitest'
import { state } from '../../assets/js/state.js'
import { badDateTimeValue } from './dateTime.js'

beforeAll(() => {
  // defined in vitest.config.js
  localStorage.setItem('authToken', process.env.AUTH_TOKEN)
})

describe('Tests dateTime component', () => {
  it('receives a valid iso date string', () => {
    const resp = badDateTimeValue('2026-08-04T00:00:00.000Z')
    expect(resp).toStrictEqual({})
  })
  it('receives a non-iso date string', () => {
    const { dateString } = badDateTimeValue('2026-08-04')
    expect(dateString).toBe('2026-08-04T00:00:00.000Z')
  })
  it('receives an empty string', () => {
    const { error } = badDateTimeValue()
    expect(error).toBe('Oops, dateTime.set() did not receive a value')
  })
  it('receives a date', () => {
    const { dateString } = badDateTimeValue(new Date('2026-08-04'))
    expect(dateString).toBe('2026-08-04T00:00:00.000Z')
  })
})
