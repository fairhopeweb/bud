import type {Bud} from '@roots/bud-framework'
import {Extension} from '@roots/bud-framework/extension'
import {
  bind,
  dependsOn,
  dependsOnOptional,
  expose,
  label,
  options,
} from '@roots/bud-framework/extension/decorators'
import {isUndefined} from '@roots/bud-support/lodash-es'

/**
 * BudTypeScript configures the TypeScript compiler
 *
 * @public
 * @decorator `@label`
 * @decorator `@expose`
 * @decorator `@options`
 * @decorator `@dependsOn`
 */
@label(`@roots/bud-typescript`)
@expose(`typescript`)
@options({
  babel: true,
  loader: {
    transpileOnly: true,
  },
})
@dependsOn([`@roots/bud-typescript/typecheck`])
@dependsOnOptional([`@roots/bud-babel`])
export default class BudTypeScript extends Extension {
  /**
   * Typechecking controls
   *
   * @public
   * @decorator `@bind`
   */
  public get typecheck() {
    return this.app.extensions.get(`@roots/bud-typescript/typecheck`)
  }

  /**
   * Disable or enable babel
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public useBabel(enable?: boolean): this {
    if (isUndefined(enable)) this.setOption(`babel`, true)
    this.setOption(`babel`, enable)
    return this
  }

  /**
   * `register` callback
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public override async register(bud: Bud) {
    this.useBabel = this.useBabel.bind(this)
    this.setOption(`context`, bud.context.basedir)

    bud.hooks.on(`build.resolve.extensions`, extensions =>
      extensions.add(`.ts`).add(`.jsx`).add(`.tsx`),
    )
  }

  /**
   * `configAfter` callback
   *
   * @public
   * @decorator `@bind`
   */
  @bind
  public override async configAfter(bud: Bud) {
    bud.build
      .setLoader(`ts`, await this.resolve(`ts-loader`))
      .setItem(`ts`, {
        loader: `ts`,
        options: () => this.options.loader,
      })
      .setRule(`ts`, {
        test: ({hooks}) => hooks.filter(`pattern.ts`),
        include: [({path}) => path(`@src`)],
        use: [this.options.babel ? `babel` : null, `ts`].filter(
          Boolean,
        ) as Array<any>,
      })

    bud.build.rules.js.setUse(
      [this.options.babel ? `babel` : null, `ts`].filter(
        Boolean,
      ) as Array<any>,
    )
  }
}
