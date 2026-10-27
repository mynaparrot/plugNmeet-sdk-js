import {
  PlugNmeet,
  createRequest,
  CreateRoomReqSchema,
  GenerateTokenReqSchema,
  IsRoomActiveReqSchema,
} from '../../src/index.ts';

const roomId = 'room01'; // must be unique.
const userFullname = 'Your name';
const userId = 'Your-Unique-User-Id'; // must be unique for each user.
const isAdmin = true; // if this user is admin
const host = 'http://localhost:8080';

const pnm = new PlugNmeet(
  host,
  'plugnmeet',
  'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
);

const roomInfo = createRequest(CreateRoomReqSchema, {
  roomId: roomId,
  metadata: {
    roomTitle: 'Demo room',
    welcomeMessage:
      'Welcome to plugNmeet!<br /> To share microphone click mic icon from bottom left side.',
    //webhookUrl: "http://example.com",
    roomFeatures: {
      allowWebcams: true,
      muteOnStart: false,
      allowScreenShare: true,
      adminOnlyWebcams: false,
      allowViewOtherWebcams: true,
      allowViewOtherUsersList: true,
      allowVirtualBg: true,
      allowRaiseHand: true,
      allowReactions: true,
      enableAnalytics: true,
      roomDuration: '0', // 0 = no limit/unlimited
      recordingFeatures: {
        isAllow: true,
        isAllowCloud: true,
        isAllowLocal: true,
        enableAutoCloudRecording: false,
      },
      externalBroadcastingFeatures: {
        isAllow: true,
        isAllowRtmp: true,
      },
      chatFeatures: {
        isAllow: true,
        isAllowFileUpload: true,
        maxFileSize: '50',
        allowedFileTypes: ['jpg', 'png', 'zip'],
      },
      sharedNotePadFeatures: {
        isAllow: true,
      },
      whiteboardFeatures: {
        isAllow: true,
      },
    },
    // defaultLockSettings: {
    //     lockMicrophone: true,
    //     lockScreenSharing: true,
    //     lockWebcam: true,
    //     lockChatFileShare: true,
    //     lockChatSendMessage: true
    // }
  },
});

let isRoomActive = false,
  hasError = false;

const activeRes = await pnm.isRoomActive(
  createRequest(IsRoomActiveReqSchema, {
    roomId: roomId,
  }),
);

if (!activeRes.status) {
  hasError = true;
  console.log(activeRes.msg);
} else if (typeof activeRes.isActive !== 'undefined') {
  isRoomActive = activeRes.isActive;
}

if (!isRoomActive && !hasError) {
  const createRes = await pnm.createRoom(roomInfo);
  if (!createRes.status) {
    hasError = true;
    console.log(createRes.msg);
  } else {
    isRoomActive = true;
  }
}

if (isRoomActive && !hasError) {
  const tokenRes = await pnm.getJoinToken(
    createRequest(GenerateTokenReqSchema, {
      roomId: roomId,
      userInfo: {
        name: userFullname,
        userId: userId,
        isAdmin: isAdmin,
        isHidden: false,
      },
    }),
  );

  if (tokenRes.status) {
    const url = host + '?access_token=' + tokenRes.token;
    console.log(url);
  } else {
    console.log(tokenRes.msg);
  }
}
