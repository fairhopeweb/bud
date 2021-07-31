import * as sage from '@roots/sage'

import {
  config,
  Framework,
  setupBud,
  teardownBud,
} from '../../util'

const SAGE_DIR = process.cwd().concat('/examples/sage')
const EXAMPLES_SAGE_CONFIG = {
  ...config,
  location: {
    ...config.location,
    project: SAGE_DIR,
  },
}

describe('@roots/sage', () => {
  describe('settings', () => {
    let bud: Framework = null
    let bootSpy = jest.spyOn(sage, 'boot')

    beforeAll(done => {
      bud = setupBud('development', EXAMPLES_SAGE_CONFIG)
      bud.use(sage)
      done()
    })

    afterAll(done => {
      bud = teardownBud(bud)
      done()
    })

    it('extension has name prop', () => {
      expect(sage.name).toBe('@roots/sage')
    })

    it('extension boot method was called', () => {
      expect(bootSpy).toHaveBeenCalled()
    })

    it('has expected paths', () => {
      expect(bud.path('storage')).toEqual(
        SAGE_DIR.concat('/storage/bud'),
      )
      expect(bud.publicPath()).toEqual('auto')
      expect(bud.path('dist')).toEqual(
        SAGE_DIR.concat('/public'),
      )
      expect(bud.path('src')).toEqual(
        SAGE_DIR.concat('/resources'),
      )
    })

    it('has expected aliases', () => {
      const {alias: aliases} = bud.build.config.resolve

      bud.use(sage)

      expect(aliases['@fonts']).toEqual(
        SAGE_DIR.concat('/resources/fonts'),
      )
      expect(aliases['@images']).toEqual(
        SAGE_DIR.concat('/resources/images'),
      )
      expect(aliases['@scripts']).toEqual(
        SAGE_DIR.concat('/resources/scripts'),
      )
      expect(aliases['@styles']).toEqual(
        SAGE_DIR.concat('/resources/styles'),
      )
    })
  })

  describe('babel', () => {
    let bud: Framework = null

    beforeAll(done => {
      bud = setupBud('development', EXAMPLES_SAGE_CONFIG)
      done()
    })

    afterAll(done => {
      bud = teardownBud(bud)
      done()
    })

    it('is used', done => {
      bud.discovery.set('devDependencies.babel', '*')
      bud.use(sage)
      expect(bud.extensions.has('@roots/bud-babel')).toEqual(
        true,
      )
      done()
    })
  })

  describe('postcss', () => {
    let bud: Framework = null

    beforeAll(done => {
      bud = setupBud('development', EXAMPLES_SAGE_CONFIG)
      done()
    })

    afterAll(done => {
      bud = teardownBud(bud)
      done()
    })

    it('is used', done => {
      bud.discovery.set('devDependencies.postcss', '*')
      bud.use(sage)
      expect(bud.extensions.has('@roots/bud-postcss')).toEqual(
        true,
      )
      done()
    })
  })

  describe('react', () => {
    let bud: Framework = null

    beforeAll(done => {
      bud = setupBud('development', EXAMPLES_SAGE_CONFIG)
      done()
    })

    afterAll(done => {
      bud = teardownBud(bud)
      done()
    })

    it('is used', done => {
      bud.discovery.set('devDependencies.react', '*')
      bud.use(sage)
      expect(bud.extensions.has('@roots/bud-react')).toEqual(
        true,
      )
      done()
    })
  })

  describe('tailwindcss', () => {
    let bud: Framework = null

    beforeAll(done => {
      bud = setupBud('development', EXAMPLES_SAGE_CONFIG)
      done()
    })

    afterAll(done => {
      bud = teardownBud(bud)
      done()
    })

    it('is used', done => {
      bud.discovery.set('devDependencies.tailwindcss', '*')
      bud.use(sage)
      expect(
        bud.extensions.has('@roots/bud-tailwindcss'),
      ).toEqual(true)
      done()
    })
  })
})