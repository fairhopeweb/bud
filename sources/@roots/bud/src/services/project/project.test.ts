import {describe, expect, it} from '@jest/globals'
import {factory} from '@repo/test-kit/bud'
import {Service} from '@roots/bud-framework/service'

import Bud from '../../bud'
import Project from './index'

describe(`@roots/bud/services/project`, () => {
  let bud: Bud

  beforeEach(async () => {
    bud = await factory()
  })

  it(`is constructable`, () => {
    expect(Project).toBeInstanceOf(Function)
  })

  it(`is a container service`, () => {
    const instance = new Project(
      // @ts-ignore
      bud,
    )
    expect(instance).toBeInstanceOf(Service)
  })
})