import { Room } from './activeRoomInfo.ts';

export type ActiveRoomsInfoResponse = {
  status: boolean;
  msg: string;
  rooms?: Array<Room>;
};
