import {urlToHttpOptions} from 'node:url'

import type {Bud} from '@roots/bud-framework'

/**
 * `compiler.done` callback
 *
 * @remarks
 * Generates and emits `hmr.json` with proxy/dev server information
 * for use in Acorn.
 *
 * @public
 */
export default async function (bud: Bud) {
  try {
    if (bud.hasChildren) {
      await Promise.all(
        Object.values(bud.children).map(
          async bud => await writeIfEnabled(bud),
        ),
      )
    } else {
      await writeIfEnabled(bud)
    }
  } catch (error) {
    bud.error(error)
  }
}

const writeIfEnabled = async (bud: Bud) => {
  if (
    !bud.extensions.has(`@roots/sage`) ||
    !(await bud.extensions.get(`@roots/sage`).isEnabled())
  )
    return

  await writeJson(bud)
}

const writeJson = async function (bud: Bud) {
  const devUrl = bud.root.hooks.filter(`dev.url`)
  const proxyUrl = bud.root.hooks.filter(
    `dev.middleware.proxy.options.target`,
  )
  const publicPath = bud.root.hooks.filter(`build.output.publicPath`)
  const writePath = bud.path(`@dist`, `hmr.json`)

  await bud.fs.exists(writePath)
  await bud.fs.write(writePath, {
    dev: devUrl instanceof URL ? urlToHttpOptions(devUrl) : devUrl,
    proxy: proxyUrl instanceof URL ? urlToHttpOptions(proxyUrl) : proxyUrl,
    publicPath,
  })
}
