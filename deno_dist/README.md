# plugNmeet-sdk-js

Plug-N-Meet SDK for Deno. You can use this SDK to make API requests to the Plug-N-Meet server from your backend application.

## Usage

You can change it according to latest version

```js
import { PlugNmeet } from 'https://deno.land/x/plugnmeet@v1.0.0/mod.ts';

const pnm = new PlugNmeet(
  'http://localhost:8080',
  'plugnmeet',
  'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
);
```

Please check `examples` directory to see some examples.

## Methods/API

| Methods                                                                                                                     | Description                          |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [createRoom](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#createRoom)                               | To create new room                   |
| [getJoinToken](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getJoinToken)                           | Generate join token                  |
| [isRoomActive](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#isRoomActive)                           | To check if room is active or not    |
| [getActiveRoomInfo](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getActiveRoomInfo)                 | Get active room information          |
| [getActiveRoomsInfo](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getActiveRoomsInfo)               | Get all active rooms                 |
| [endRoom](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#endRoom)                                     | End active room                      |
| [fetchRecordings](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#fetchRecordings)                     | Fetch recordings                     |
| [deleteRecordings](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#deleteRecordings)                   | Delete recording                     |
| [getRecordingDownloadToken](https://mynaparrot.github.io/plugNmeet-sdk-js/classes/PlugNmeet.html#getRecordingDownloadToken) | Generate token to download recording |
