const check = require('../../handlers/conditions/number_is_between')
const mockOptions = require('../lib/mock-options')

describe('Return true when', () => {
  test('"Includes" and "value1" is equal to "value2" but lower than "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 1,
        value2: 1,
        value3: 2,
        includes: 'true'
      }
    }
    const result = await check(options)
    expect(result).toBe(true)
  })

  test('"Includes" and "value1" is greater than "value2" but equal to "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 1,
        value2: 0,
        value3: 1,
        includes: 'true'
      }
    }
    const result = await check(options)
    expect(result).toBe(true)
  })

  test('"Includes" and "value1" is equal to "value2" and equal to "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 1,
        value2: 1,
        value3: 1,
        includes: 'true'
      }
    }
    const result = await check(options)
    expect(result).toBe(true)
  })

  test('"Not includes" and "value1" is greater than "value2" and lower than "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 1,
        value2: 0,
        value3: 2,
        includes: 'false'
      }
    }
    const result = await check(options)
    expect(result).toBe(true)
  })
})

describe('Return false when', () => {
  test('"Includes" and "value1" is greater "value2" and greater than "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 3,
        value2: 1,
        value3: 2,
        includes: 'true'
      }
    }
    const result = await check(options)
    expect(result).toBe(false)
  })

  test('"Includes" and "value1" is lower than "value2" and lower than "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 0,
        value2: 1,
        value3: 2,
        includes: 'true'
      }
    }
    const result = await check(options)
    expect(result).toBe(false)
  })

  test('"Not includes" and "value1" is greater "value2" and greater than "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 3,
        value2: 1,
        value3: 2,
        includes: 'false'
      }
    }
    const result = await check(options)
    expect(result).toBe(false)
  })

  test('"Not includes" and "value1" is equal to "value2" and lower than "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 2,
        value2: 2,
        value3: 3,
        includes: 'false'
      }
    }
    const result = await check(options)
    expect(result).toBe(false)
  })

  test('"Not includes" and "value1" is greater than "value2" and equal to "value3"', async () => {
    const options = {
      ...mockOptions,
      args: {
        value1: 2,
        value2: 1,
        value3: 2,
        includes: 'false'
      }
    }
    const result = await check(options)
    expect(result).toBe(false)
  })
})
