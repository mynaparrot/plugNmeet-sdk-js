import {
  PlugNmeet,
  createRequest,
  GetActiveRoomInfoReqSchema,
} from '../../src/index.ts';

const pnm = new PlugNmeet(
  'http://localhost:8080',
  'plugnmeet',
  'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
);

const res = await pnm.getActiveRoomInfo(
  createRequest(GetActiveRoomInfoReqSchema, {
    roomId: 'room01',
  }),
);
console.log(res);
