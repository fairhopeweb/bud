## API Report File for "@roots/bud-criticalcss"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { Container } from '@roots/container';
import { CriticalCssWebpackPlugin } from '@roots/critical-css-webpack-plugin';
import type { Extension } from '@roots/bud-framework';
import type { Framework } from '@roots/bud-framework';
import { Options } from '@roots/critical-css-webpack-plugin';

// @public
interface BudCriticalCssPlugin extends Extension.CompilerPlugin<CriticalCssWebpackPlugin, Partial<Options>> {
    // (undocumented)
    api: {
        critical: critical;
    };
    // (undocumented)
    make: (options: Container<Partial<Options>>, app: Framework) => CriticalCssWebpackPlugin;
    // (undocumented)
    name: '@roots/bud-criticalcss';
    // (undocumented)
    options: Partial<Options>;
}

// @public
const BudCriticalCssPlugin: BudCriticalCssPlugin;
export default BudCriticalCssPlugin;

// Warnings were encountered during analysis:
//
// src/BudCriticalCssPlugin.ts:22:9 - (ae-forgotten-export) The symbol "critical" needs to be exported by the entry point index.d.ts

```