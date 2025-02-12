const { describe, test, expect } = require('@jest/globals')

const check = require('../../handlers/conditions/value_contains_array')
const mockOptions = require('../lib/mock-options')

describe('Return true when', () => {
  test('"value" contains one off array items case sensitive', async () => {
    const options = {
      ...mockOptions,
      args: {
        array: ['HELL', 'hell', 'HELLO', 'hi'].join(';'),
        casesenitive: 'true',
        value: 'hello'
      }
    }
    const result = await check(options)
    expect(result).toBeTruthy()
  })

  test('"value" contains one off array items not case sensitive', async () => {
    const options = {
      ...mockOptions,
      args: {
        array: ['HELL', 'hell', 'HELLO', 'hi'].join(';'),
        casesenitive: 'false',
        value: 'hello'
      }
    }
    const result = await check(options)
    expect(result).toBeTruthy()
  })
})

describe('Return false when', () => {
  test('"value" does not contain one off array items case sensitive', async () => {
    const options = {
      ...mockOptions,
      args: {
        array: ['hi', 'hei', 'yo'].join(';'),
        casesenitive: 'true',
        value: 'hello'
      }
    }
    const result = await check(options)
    expect(result).toBeFalsy()
  })

  test('"value" does not contain one off array items not case sensitive', async () => {
    const options = {
      ...mockOptions,
      args: {
        array: ['hi', 'hei', 'yo'].join(';'),
        casesenitive: 'false',
        value: 'hello'
      }
    }
    const result = await check(options)
    expect(result).toBeFalsy()
  })

  test('"value" is missing', async () => {
    const options = {
      ...mockOptions,
      args: {
        array: ['hi', 'hei', 'yo'].join(';'),
        casesenitive: 'false'
      }
    }
    const result = await check(options)
    expect(result).toBeFalsy()
  })

  test('"array" is missing', async () => {
    const options = {
      ...mockOptions,
      args: {
        casesenitive: 'false',
        value: 'hello'
      }
    }
    const result = await check(options)
    expect(result).toBeFalsy()
  })

  test('"value" is an empty string', async () => {
    const options = {
      ...mockOptions,
      args: {
        array: ['hi', 'hei', 'yo'].join(';'),
        casesenitive: 'false',
        value: ''
      }
    }
    const result = await check(options)
    expect(result).toBeFalsy()
  })

  test('"array" is an empty string', async () => {
    const options = {
      ...mockOptions,
      args: {
        array: '',
        casesenitive: 'false',
        value: 'hello'
      }
    }
    const result = await check(options)
    expect(result).toBeFalsy()
  })
})
