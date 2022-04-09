import { LockSettingsParams } from './createRoom';

export type JoinTokenParams = {
  room_id: string;
  user_info: JoinTokenUserInfo;
};

export type JoinTokenUserInfo = {
  name: string;
  user_id: string;
  is_admin: boolean;
  is_hidden: boolean;
  user_metadata?: JoinTokenUserMetadata;
};

export type JoinTokenUserMetadata = {
  profile_pic?: string;
  lock_settings?: LockSettingsParams;
};

export type JoinTokenResponse = {
  status: boolean;
  msg: string;
  token?: string;
};
