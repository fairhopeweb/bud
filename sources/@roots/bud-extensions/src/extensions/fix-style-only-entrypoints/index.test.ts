import {describe, expect, it, test} from 'vitest'

import extensionConstructor from './index.js'

describe(`bud-esm`, () => {
  it(`is an instance of Extension`, () => {
    expect(extensionConstructor).toBeInstanceOf(Function)
  })

  test.todo(`should be tested`)
})
