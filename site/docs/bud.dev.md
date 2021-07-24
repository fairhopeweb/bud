# bud.dev

Configure **@roots/bud-server**.

## Server information

By default the server is available in `development` mode at this address:

| Property   | Value     |
| ---------- | --------- |
| host       | localhost |
| port       | 3000      |
| publicPath | /         |

## Usage

:::warning

You will need to handle resolving custom domains yourself if you don't want to use localhost.

:::

```ts title='bud.config.js'
bud.dev({
  host: 'my-local-site.example',
  port: 5000,
})
```

## Proxying

Users building on top of an existing backend framework like WordPress, Laravel, RoR, etc. will likely want to proxy their established development server.

Bud has a function specfically for configuring a proxy server: [bud.proxy](/docs/bud.proxy). But you may also configure the proxy from `bud.dev`, if desired.

```ts title='bud.config.js'
bud.dev({
  host: 'example.test',
  port: 3000,
  proxy: {
    host: 'example.test',
    port: 8080,
  },
})
```

## Middleware

You may enable or disable middleware using the middleware key.

Example disabling all server middleware:

```ts title='bud.config.js'
bud.dev({
  middleware: {
    dev: false,
    hot: false,
    proxy: false,
  },
})
```

## Browser scripts

Bud comes with a logging utility and live reload indicators which run in the browser (in dev mode).

These can be toggled using the `browser` config options:

```ts title='bud.config.js'
bud.dev({
  browser: {
    log?: boolean
    indicator?: boolean
    overlay?: boolean
  }
})
```

- **log**: enable/disable the logger.
- **indicator**: enable/disable the live reload indicator.
- **overlay**: enable/disable the error overlay.