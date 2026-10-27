# plugNmeet-sdk-js

Plug-N-Meet JS SDK for NodeJS. You can use this SDK to make API requests to the Plug-N-Meet server from your backend application.

## Installation:

```js
npm install plugnmeet-sdk-js
```

## Usage

**Import**

CommonJS:

```js
const plugNmeet = require('plugnmeet-sdk-js').PlugNmeet;

// now
const pnm = new plugNmeet(
  'http://localhost:8080',
  'plugnmeet',
  'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
);
```

ES Modules/TypeScript:

```js
import { PlugNmeet } from 'plugnmeet-sdk-js';

const pnm = new PlugNmeet(
  'http://localhost:8080',
  'plugnmeet',
  'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
);
```

Please check `examples` directory to see some examples.

## Deno

The SDK also runs on Deno 2.9+ from the same `src/` source. Relative imports are extensionless, so Deno needs the `--sloppy-imports` flag:

```ts
import { PlugNmeet } from './src/index.ts';

const pnm = new PlugNmeet(
  'http://localhost:8080',
  'plugnmeet',
  'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
);
```

```sh
deno run --sloppy-imports ./your_script.ts
```

Dependencies are the npm packages declared in `package.json`, resolved from the installed `node_modules` (`deno.json` sets `nodeModulesDir: "manual"`). 
Run `pnpm install` once; there is no separate `deno.lock` and no `deno install` step. Type-check and test with the bundled tasks:

```sh
deno task check   # deno check src/index.ts and tests/*.test.ts
deno task test    # runs the Vitest suite on the Deno runtime
```

`examples/deno/` mirrors the Node examples in `examples/*.js` one-to-one. Run them from the repository root, after `pnpm install`:

```sh
# AnalyticsFormatter over the bundled fixture (no server needed)
deno run --sloppy-imports --allow-read=tests/fixtures/analytics_sample.json --allow-env examples/deno/analyticsFormatter.ts

# API examples: need a reachable plugNmeet server, the host is hard-coded to http://localhost:8080
deno run --sloppy-imports --allow-net=localhost:8080 --allow-env examples/deno/getActiveRoomInfo.ts
deno run --sloppy-imports --allow-net=localhost:8080 --allow-env examples/deno/getRecordings.ts
deno run --sloppy-imports --allow-net=localhost:8080 --allow-env examples/deno/quickJoin.ts
```

Permissions used by these examples:

- `--allow-env` is required because importing `src/index.ts` also loads the SDK's HTTP client, which reads `process.env` at import time.
- `--allow-read` is scoped to the sample fixture only.
- `--allow-net=localhost:8080` matches the host hard-coded in the examples; widen it if you point them at another server. These examples need a real plugNmeet deployment with the matching API key/secret, so only the analytics example runs without a server.

Type-check every Deno example with:

```sh
deno check --sloppy-imports examples/deno/*.ts
```

There is no external Deno distribution yet: the SDK is not published to JSR, deno.land or any other Deno registry. Deno support currently works only when you use the source from a checkout of this repository (as shown above). 
Importing the source over a raw URL will not work, because the SDK's bare npm dependencies (`axios`, `@bufbuild/protobuf`, `form-data`, `plugnmeet-protocol-js`) would not resolve outside the repo's installed `node_modules`.

## Methods/API

| Methods                                                                                                                     | Description                               |
| --------------------------------------------------------------------------------------------------------------------------- |-------------------------------------------|
| [createRoom](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#createRoom)                               | To create new room                        |
| [getJoinToken](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getJoinToken)                           | Generate join token                       |
| [isRoomActive](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#isRoomActive)                           | To check if room is active or not         |
| [getActiveRoomInfo](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getActiveRoomInfo)                 | Get active room information               |
| [getActiveRoomsInfo](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getActiveRoomsInfo)               | Get all active rooms                      |
| [fetchPastRoomsInfo](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#fetchPastRoomsInfo)               | Get past rooms  information               |
| [endRoom](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#endRoom)                                     | End active room                           |
| [fetchAnalytics](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#fetchAnalytics)                     | Fetch analytics                           |
| [deleteAnalytics](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#deleteAnalytics)                   | Delete analytics                          |
| [getAnalyticsDownloadToken](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getAnalyticsDownloadToken) | Generate token to download analytics data |
| [fetchRecordings](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#fetchRecordings)                     | Fetch recordings                          |
| [deleteRecordings](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#deleteRecordings)                   | Delete recording                          |
| [getRecordingDownloadToken](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getRecordingDownloadToken) | Generate token to download recording      |
| [getClientFiles](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getClientFiles)                       | Get client's files                        |
