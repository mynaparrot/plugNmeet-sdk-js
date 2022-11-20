const plugNmeet = require('../dist').PlugNmeet;

(async () => {
  const roomId = "room01"; // must be unique.
  const userFullname = "Your name";
  const userId = "Your-Unique-User-Id"; // must be unique for each user.
  const isAdmin = true; // if this user is admin
  const host = "http://localhost:8080"

  const pnm = new plugNmeet(
    host,
    'plugnmeet',
    'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
  );

  const roomInfo = {
    room_id: roomId,
    metadata: {
      room_title: 'Demo room',
      welcome_message:
        'Welcome to plugNmeet!<br /> To share microphone click mic icon from bottom left side.',
      //webhook_url: "http://example.com",
      room_features: {
        allow_webcams: true,
        mute_on_start: false,
        allow_screen_share: true,
        allow_rtmp: true,
        admin_only_webcams: false,
        allow_view_other_webcams: true,
        allow_view_other_users_list: true,
        recording_features: {
          is_allow: true,
          is_allow_cloud: true,
          is_allow_local: true,
          enable_auto_cloud_recording: false,
        },
        chat_features: {
          allow_chat: true,
          allow_file_upload: true,
          max_file_size: 50,
          allowed_file_types: ['jpg', 'png', 'zip'],
        },
        shared_note_pad_features: {
          allowed_shared_note_pad: true,
        },
        whiteboard_features: {
          allowed_whiteboard: true,
        },
      },
      // default_lock_settings: {
      //     lock_microphone: true,
      //     lock_screen_sharing: true,
      //     lock_webcam: true,
      //     lock_chat_file_share: true,
      //     lock_chat_send_message: true
      // }
    },
  };

  let isRoomActive = false, hasError = false;
  let res = await pnm.isRoomActive({
    room_id: roomId
  });
  isRoomActive = res.status;

  if (!isRoomActive) {
    res = await pnm.createRoom(roomInfo);
    if (!res.status) {
      hasError = true;
      console.log(res.msg);
    } else {
      isRoomActive = true;
    }
  }

  if (isRoomActive && !hasError) {
    res = await pnm.getJoinToken({
      room_id: roomId,
      user_info: {
        name: userFullname,
        user_id: userId,
        is_admin: isAdmin,
        is_hidden: false,
      }
    });

    if (res.status) {
      const url = host + "?access_token=" + res.token;
      console.log(url);
    } else {
      console.log(res.msg)
    }
  }
})()

