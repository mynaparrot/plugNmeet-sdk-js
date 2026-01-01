const { create } = require('@bufbuild/protobuf');
const {
  CreateRoomReqSchema,
  GenerateTokenReqSchema,
} = require('plugnmeet-protocol-js');

const { PlugNmeet } = require('../');

(async () => {
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

  const roomInfo = create(CreateRoomReqSchema, {
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
        allowRtmp: true,
        adminOnlyWebcams: false,
        allowViewOtherWebcams: true,
        allowViewOtherUsersList: true,
        allowVirtualBg: true,
        allowRaiseHand: true,
        enableAnalytics: true,
        roomDuration: '0', // 0 = no limit/unlimited
        recordingFeatures: {
          isAllow: true,
          isAllowCloud: true,
          isAllowLocal: true,
          enableAutoCloudRecording: false,
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
  let res = await pnm.isRoomActive({
    roomId: roomId,
  });

  if (!res.status) {
    hasError = true;
    console.log(res.msg);
  } else if (typeof res.isActive !== 'undefined') {
    isRoomActive = res.isActive;
  }

  if (!isRoomActive && !hasError) {
    res = await pnm.createRoom(roomInfo);
    if (!res.status) {
      hasError = true;
      console.log(res.msg);
    } else {
      isRoomActive = true;
    }
  }

  if (isRoomActive && !hasError) {
    res = await pnm.getJoinToken(
      create(GenerateTokenReqSchema, {
        roomId: roomId,
        userInfo: {
          name: userFullname,
          userId: userId,
          isAdmin: isAdmin,
          isHidden: false,
        },
      }),
    );

    if (res.status) {
      const url = host + '?access_token=' + res.token;
      console.log(url);
    } else {
      console.log(res.msg);
    }
  }
})();
