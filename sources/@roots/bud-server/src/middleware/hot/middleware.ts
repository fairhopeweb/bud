/* eslint-disable no-console */

import type {Bud} from '@roots/bud-framework'
import type {
  MultiCompiler,
  StatsCompilation,
  StatsModule,
} from '@roots/bud-support/webpack'
import type {RequestHandler} from 'express'

import type {Payload} from './payload.js'
import {HotEventStream} from './stream.js'

const middlewarePath = `/bud/hot`

let latestStats = null
let closed = false
let logger: Bud['logger']['instance']

export default (app: Bud) => {
  logger = app.logger.instance.scope(...app.logger.scope, `hmr`)
  return makeHandler(app.compiler.instance)
}

export const makeHandler = (compiler: MultiCompiler) => {
  const stream = new HotEventStream()

  const onInvalid = () => {
    if (closed) return
    stream.publish({action: `building`})
  }

  const onDone = (stats: StatsCompilation) => {
    if (closed) return
    latestStats = stats
    publish(`built`, latestStats, stream)
  }

  compiler.hooks.invalid.tap(`bud-hot-middleware`, onInvalid)
  compiler.hooks.done.tap(`bud-hot-middleware`, onDone)

  const middleware: RequestHandler = function (req, res, next) {
    if (closed) return next()

    if (!req.url.endsWith(middlewarePath)) return next()

    stream.handle(req, res)

    if (latestStats) {
      publish(`sync`, latestStats, stream)
    }
  }

  // @ts-ignore
  middleware.publish = function (payload) {
    if (closed) return
    stream.publish(payload)
  }

  // @ts-ignore
  middleware.close = function () {
    if (closed) return
    closed = true
    stream.close()
    // @ts-ignore https://github.com/webpack/tapable/issues/32#issuecomment-350644466
    stream = null
  }

  return middleware
}

export const publish = (
  action: Payload['action'],
  statsCompilation: StatsCompilation,
  stream: HotEventStream,
) => {
  const compilations = collectCompilations(
    statsCompilation.toJson({
      all: false,
      cached: true,
      children: true,
      modules: true,
      timings: true,
      hash: true,
      errors: true,
    }),
  )

  compilations.forEach((stats: StatsCompilation) => {
    const name: string = stats.name ?? statsCompilation.name ?? `unnamed`
    const modules = collectModules(stats.modules)

    logger.log(`built`, name, `(${stats.hash})`, `in`, `${stats.time}ms`)

    stream.publish({
      name,
      action,
      time: stats.time,
      hash: stats.hash,
      warnings: stats.warnings ?? [],
      errors: stats.errors ?? [],
      modules,
    })
  })
}

export const collectModules = (modules: Array<StatsModule>) =>
  modules?.reduce(
    (modules, module) => ({...modules, [module.id]: module.name}),
    {},
  )

export const collectCompilations = (
  stats: StatsCompilation,
): Array<StatsCompilation> => {
  let collection = []

  // Stats has modules, single bundle
  if (stats.modules) collection.push(stats)

  // Stats has children, multiple bundles
  if (stats.children?.length) collection.push(...stats.children)

  // Not sure, assume single
  return collection
}
