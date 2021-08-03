import {factory} from '@roots/bud'
import DefaultImportBabel from '@roots/bud-babel'
import * as StarBabel from '@roots/bud-babel'
import {Framework} from '@roots/bud-framework'

const RequiredBabel = require('@roots/bud-babel')

describe('@roots/bud-babel', function () {
  let Config: StarBabel.Config

  beforeAll(() => {
    Config = new StarBabel.Config(factory())
  })

  it('works with require', () => {
    expect(Object.keys(RequiredBabel)).toContain('name')
    expect(Object.keys(RequiredBabel)).toContain('register')
    expect(Object.keys(RequiredBabel)).toContain('boot')
  })

  it('works with default import', () => {
    expect(Object.keys(DefaultImportBabel)).toContain('name')
    expect(Object.keys(DefaultImportBabel)).toContain('register')
    expect(Object.keys(DefaultImportBabel)).toContain('boot')
  })

  it('works with star import', () => {
    expect(Object.keys(StarBabel)).toContain('name')
    expect(Object.keys(StarBabel)).toContain('register')
    expect(Object.keys(StarBabel)).toContain('boot')
  })

  it('config class has a setPlugins', () => {
    expect(Config.setPlugins).toBeInstanceOf(Function)
  })

  it('config class has a setPresets', () => {
    expect(Config.setPresets).toBeInstanceOf(Function)
  })

  it('config class has a setPlugin', () => {
    expect(Config.setPlugin).toBeInstanceOf(Function)
  })

  it('config class has a setPreset', () => {
    expect(Config.setPreset).toBeInstanceOf(Function)
  })

  it('config class has a setPluginOptions', () => {
    expect(Config.setPluginOptions).toBeInstanceOf(Function)
  })

  it('config class has a setPluginOptions', () => {
    expect(Config.setPresetOptions).toBeInstanceOf(Function)
  })

  it('has expected default plugins', () => {
    expect(StarBabel.DEFAULT_PLUGINS).toEqual([
      ['@babel/plugin-transform-runtime', {helpers: false}],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
    ])
  })

  it('has correctly interpreted default plugins', () => {
    Config.setPlugins(StarBabel.DEFAULT_PLUGINS)

    expect(Config.plugins).toEqual({
      '@babel/plugin-transform-runtime': [
        '@babel/plugin-transform-runtime',
        {helpers: false},
      ],
      '@babel/plugin-proposal-object-rest-spread': [
        '@babel/plugin-proposal-object-rest-spread',
        {},
      ],
      '@babel/plugin-syntax-dynamic-import': [
        '@babel/plugin-syntax-dynamic-import',
        {},
      ],
      '@babel/plugin-proposal-class-properties': [
        '@babel/plugin-proposal-class-properties',
        {},
      ],
    })
  })

  it('has expected default presets', () => {
    expect(StarBabel.DEFAULT_PRESETS).toEqual([
      '@babel/preset-env',
    ])
  })

  it('has correctly interpreted default plugins', () => {
    Config.setPresets(StarBabel.DEFAULT_PRESETS)

    expect(Config.presets).toEqual({
      '@babel/preset-env': ['@babel/preset-env', {}],
    })
  })

  it('bud.babel.setPreset functions', () => {
    Config.presets = {}

    Config.setPreset('@babel/preset-env')

    expect(Config.presets).toEqual({
      '@babel/preset-env': ['@babel/preset-env', {}],
    })

    Config.presets = {}

    Config.setPreset(['@babel/preset-env', {foo: 'bar'}])

    expect(Config.presets).toEqual({
      '@babel/preset-env': ['@babel/preset-env', {foo: 'bar'}],
    })
  })

  it('bud.babel.setPlugin functions', () => {
    Config.plugins = {}

    Config.setPlugin('someBabelPlugin')

    expect(Config.plugins).toEqual({
      someBabelPlugin: ['someBabelPlugin', {}],
    })

    Config.plugins = {}

    Config.setPlugin(['someBabelPlugin', {foo: 'bar'}])

    expect(Config.plugins).toEqual({
      someBabelPlugin: ['someBabelPlugin', {foo: 'bar'}],
    })
  })

  it('bud.babel.unsetPlugin functions', () => {
    Config.plugins = {
      someBabelPlugin: ['someBabelPlugin', {}],
    }

    Config.unsetPlugin('someBabelPlugin')

    expect(Config.plugins).toEqual({})
  })

  it('bud.babel.unsetPreset functions', () => {
    Config.presets = {
      someBabelPreset: ['someBabelPreset', {}],
    }

    Config.unsetPreset('someBabelPreset')

    expect(Config.presets).toEqual({})
  })

  it('bud.babel.normalizeEntry is a function', () => {
    expect(Config.normalizeEntry).toBeInstanceOf(Function)
  })

  it('bud.babel.normalizeEntry normalizes plugins', () => {
    const plugin = 'foo'
    const result = Config.normalizeEntry(plugin)

    expect(result).toEqual(['foo', {}])
  })

  it('bud.babel.app returns app', () => {
    expect(Config.app).toBeInstanceOf(Framework)
  })
})