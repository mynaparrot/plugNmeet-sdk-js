export type FetchPastRoomsInfoParams = {
  room_ids?: Array<string>;
  from?: number;
  limit?: number;
  order_by?: 'ASC' | 'DESC';
};

export type FetchRoomsInfoResponse = {
  status: boolean;
  msg: string;
  result?: PastRoomInfoResult;
};

export type PastRoomInfoResult = {
  total_rooms: number;
  from: number;
  limit: number;
  order_by: string;
  rooms_list: Array<PastRoomInfo>;
};

export type PastRoomInfo = {
  room_title: string;
  room_id: string;
  room_sid: string;
  joined_participants: number;
  webhook_url: string;
  created: string;
  ended: string;
  analytics_files_id: string;
};
