/* eslint-disable n/no-process-exit */

import type {Bud} from './bud.js'

let initialized: boolean = false

/**
 * Registers a callback for all kinds of application shutdown events.
 *
 * @remarks
 * Intended to be called in the constructor.
 *
 * @param app - The Bud instance
 * @returns void
 *
 * @public
 */
export const initialize = (app: Bud): void => {
  if (initialized) return
  initialized = true

  process
    // exit with errors
    .once(`uncaughtException`, makeProcessHandler(app, 1))
    // exit with errors
    .once(`unhandledRejection`, makeProcessHandler(app, 1))

    // only works when the process normally exits
    .once(`SIGINT`, makeProcessHandler(app, 0))
    .once(`SIGTERM`, makeProcessHandler(app, 0))
    .once(`beforeExit`, makeProcessHandler(app, 0))
}

/**
 * Has the application already exited?
 *
 * @public
 */
let appExited: boolean = false

/**
 * Create an error handler
 *
 * @public
 */
const makeProcessHandler =
  (app: Bud, code: number): NodeJS.BeforeExitListener =>
  _code => {
    if (appExited) return

    appExited = true

    app?.logger?.instance
      ? app.logger.instance[process.exitCode === 0 ? `success` : `error`](
          `exiting with code ${process.exitCode}`,
        )
      : app.context[process.exitCode === 0 ? `stdout` : `stderr`].write(
          `exiting with code ${process.exitCode}`,
        )

    app?.close()
  }
