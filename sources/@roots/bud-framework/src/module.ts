import {createRequire} from 'node:module'
import {join, normalize, relative} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

import chalk from '@roots/bud-support/chalk'
import {bind} from '@roots/bud-support/decorators'
import {resolve} from '@roots/bud-support/import-meta-resolve'
import type {Instance} from '@roots/bud-support/signale'

import type {Bud} from './bud.js'

/**
 * Module resolver
 *
 * @public
 */
export class Module {
  /**
   * Node require
   *
   * @public
   */
  public require: NodeRequire

  /**
   * Logger
   *
   * @public
   */
  public logger: Instance

  /**
   * Class constructor
   *
   * @public
   */
  public constructor(public app: Bud) {
    this.require = createRequire(
      this.makeContextURL(this.app.root.context.basedir),
    )

    this.logger = this.app.logger.instance.scope(
      ...this.app.logger.scope,
      `module`,
    )
  }

  /**
   * Get `package.json` absolute path from a module signifier
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public async getDirectory(signifier: string, context?: string) {
    return await this.resolve(signifier, context)
      .then(path =>
        relative(context ?? this.app.root.context.basedir, path),
      )
      .then(path => path.split(signifier).shift())
      .then(path => this.app.root.path(path as any, signifier))
  }

  /**
   * Get `package.json` absolute path from a module signifier
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public async getManifestPath(pkgName: string) {
    return await this.getDirectory(pkgName).then(dir =>
      join(dir, `package.json`),
    )
  }

  /**
   * Read `package.json` manifest from a module signifier
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public async readManifest(signifier: string) {
    return await this.getManifestPath(signifier).then(async path => {
      this.logger.log(signifier, `manifest resolved to`, path)

      return await this.app.fs.json.read(path)
    })
  }

  /**
   * Resolve a module path from its signifier
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public async resolve(
    signifier: string,
    context?: string | URL,
  ): Promise<string> {
    try {
      const resolvedPath = await resolve(
        signifier,
        this.makeContextURL(context) as unknown as string,
      )

      const normalpath = normalize(fileURLToPath(resolvedPath))

      this.logger.success(
        chalk.dim(
          `resolved ${signifier} to ${this.app.root.relPath(normalpath)}`,
        ),
      )
      return normalpath
    } catch (err) {
      this.logger.info(
        signifier,
        `not resolvable`,
        `(context: ${context})`,
      )
    }
  }

  /**
   * Import a module from its signifier
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public async import<T = any>(
    signifier: string,
    context?: URL | URL | string,
  ): Promise<T> {
    const modulePath = await this.resolve(signifier, context)
    if (!modulePath) {
      throw new Error(`Could not resolve ${signifier}`)
    }

    const result = await import(modulePath)
    if (!result) {
      throw new Error(`Could not import ${signifier}`)
    }

    this.logger.success(chalk.dim(`imported ${signifier}`))
    return result?.default ?? result
  }

  /**
   * Import a module from its signifier
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public async tryImport<T = any>(
    signifier: string,
    context?: URL | URL | string,
  ): Promise<T> | undefined | null {
    try {
      const modulePath = await this.resolve(signifier, context)
      const result = await import(modulePath)
      this.logger.success(chalk.dim(`imported ${signifier} (optional)`))
      return result?.default ?? result
    } catch (err) {
      this.logger.info(
        chalk.dim(`${signifier} could not be imported (optional)`),
        err,
      )
    }
  }

  /**
   * Make context URL
   *
   * @param context  - context directory
   * @returns
   */
  @bind
  protected makeContextURL(context?: string | URL): URL {
    context = context ?? this.app.root.path(`package.json`)
    return context instanceof URL ? context : pathToFileURL(context)
  }
}
