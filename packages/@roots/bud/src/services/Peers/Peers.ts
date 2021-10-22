import {dirname, join} from 'path'

import {bind, pkgUp, readJsonSync} from './peers.dependencies'
import type {Peers, Project} from './peers.interface'

/**
 * Peers service class
 *
 * @public
 */
export default class implements Peers.Interface {
  public project: Project.Interface

  /**
   * Class constructor
   *
   * @public
   */
  public constructor(project: Project.Interface) {
    this.project = project
    this.discover('dependencies').discover('devDependencies')
  }

  /**
   * Returns path for a module name (if findable)
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public resolvePeerByName(name: string) {
    try {
      const dir = dirname(
        pkgUp.sync({
          cwd: dirname(require.resolve(name)),
        }),
      )

      return dir
    } catch (err) {
      return null
    }
  }

  /**
   * Returns manifest for a module from name (if findable)
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public getPeerManifest(name: string) {
    const path = this.resolvePeerByName(name)
    return path ? readJsonSync(join(path, '/package.json')) : {}
  }

  /**
   * Returns true if a module is a bud
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public isExtension(name: string): boolean {
    return name?.includes('@roots') || name?.includes('bud-')
  }

  /**
   * Plumbs project dependencies and gathers data
   * on bud related modules
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public discover(
    type: 'dependencies' | 'devDependencies',
  ): this {
    this.project.has(type) &&
      this.project.getKeys(type).map((name: string) => {
        /**
         * Resolver: given a manifest, will separate peers
         * and extensions for further processing.
         *
         * If an extension requires another extension, it will call
         * itself recursively until it reaches bottom.
         *
         * If two extensions require one another it will not iterate
         * infinitely as it checks if an extension exists before
         * recursing.
         */
        const resolvePeers = (manifest: {
          [key: string]: any
        }) => {
          /**
           * Add to eligible extensions
           */
          !this.project.has(`extensions.${manifest.name}`) &&
            this.project.set(`extensions.${manifest.name}`, {
              name: manifest.name,
              ver: manifest.version,
              type: type,
            })

          /**
           * Add to resolvable paths
           */
          !this.project.resolveFrom.includes(
            this.resolvePeerByName(manifest.name),
          ) &&
            this.project.resolveFrom.push(
              this.resolvePeerByName(manifest.name),
            )

          /**
           * Dive through peer deps
           */
          manifest.peerDependencies &&
            Object.entries(manifest.peerDependencies).forEach(
              ([depName, ver]) => {
                !this.project.has(`peers.${depName}`) &&
                  this.project.set(`peers.${depName}`, {
                    name: depName,
                    ver: ver,
                    type: 'devDependencies',
                  })
              },
            )

          /**
           * Tail recursion on nested requires
           */
          manifest?.bud?.peers?.forEach((name: string) => {
            this.isExtension(name) &&
              !this.project.has(`extensions.${name}`) &&
              resolvePeers(this.getPeerManifest(name))
          })
        }

        /**
         * Checks each key in project level package.json
         * to determine if it is a bud extension. If so it
         * engages resolvePeers
         */
        this.isExtension(name) &&
          resolvePeers(this.getPeerManifest(name))
      })

    return this
  }

  /**
   * Registers all bud related extensions with bud.extensions
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public registerDiscovered() {
    this.project.getValues('extensions').forEach(pkg => {
      if (!pkg?.name) return

      this.project.app.extensions.add(require(pkg.name))
      this.project.set(`registered.${pkg.name}`, pkg)
    })
  }

  /**
   * Installs all required peer dependencies
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public install(): void {
    const required = this.project.get('peers')

    required &&
      this.project.app.dependencies.install(
        Object.values(required),
      )
  }
}