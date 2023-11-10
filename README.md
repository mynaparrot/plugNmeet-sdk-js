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
