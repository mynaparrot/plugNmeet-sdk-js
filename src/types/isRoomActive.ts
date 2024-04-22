export type IsRoomActiveParams = {
  room_id: string;
};

export type IsRoomActiveResponse = {
  status: boolean;
  is_active?: boolean;
  msg: string;
};
