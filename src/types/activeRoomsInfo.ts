import { Room } from './activeRoomInfo';

export type ActiveRoomsInfoResponse = {
  status: boolean;
  msg: string;
  rooms?: Array<Room>;
};
