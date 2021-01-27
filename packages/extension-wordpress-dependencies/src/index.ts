import {Plugin} from '@roots/wordpress-dependencies-webpack-plugin'
import type {Bud} from '@roots/bud'

// extension identifier
export const name =
  '@roots/wordpress-dependencies-webpack-plugin'

// @roots/wordpress-externals-webpack-plugin
export const make: Bud.Module.Make<Plugin> = () => new Plugin()