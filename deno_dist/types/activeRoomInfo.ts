export type ActiveRoomInfoParams = {
  room_id: string;
};

export type ActiveRoomInfoResponse = {
  status: boolean;
  msg: string;
  room?: Room;
};

export type Room = {
  room_info: ActiveRoomInfo;
  participants_info: Array<ParticipantInfo>;
};

export type ActiveRoomInfo = {
  room_title: string;
  room_id: string;
  sid: string;
  joined_participants: number;
  is_running: boolean;
  is_recording: boolean;
  is_active_rtmp: boolean;
  webhook_url: string;
  creation_time: number;
  metadata: string;
};

export type ParticipantInfo = {
  sid: string;
  identity: string;
  state: string;
  metadata: string;
  joined_at: number;
  name: string;
  version: number;
  permission: any;
};
