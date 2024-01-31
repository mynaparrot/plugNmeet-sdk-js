export type CreateRoomParams = {
  room_id: string;
  max_participants?: number;
  empty_timeout?: number;
  metadata: RooMetadata;
};

export type RooMetadata = {
  room_title: string;
  welcome_message?: string;
  webhook_url?: string;
  logout_url?: string;
  room_features: RoomFeaturesParams;
  default_lock_settings?: LockSettingsParams;
};

export type RoomFeaturesParams = {
  allow_webcams: boolean;
  mute_on_start: boolean;
  allow_screen_share: boolean;
  allow_rtmp: boolean;
  admin_only_webcams: boolean;
  allow_view_other_webcams: boolean;
  allow_view_other_users_list: boolean;
  room_duration: number;
  enable_analytics: boolean;
  allow_virtual_bg: boolean;
  allow_raise_hand: boolean;
  recording_features: RecordingFeaturesParams;
  chat_features: ChatFeaturesParams;
  shared_note_pad_features?: SharedNotePadFeaturesParams;
  whiteboard_features?: WhiteboardFeaturesParams;
  external_media_player_features?: ExternalMediaPlayerFeatures;
  waiting_room_features?: WaitingRoomFeatures;
  breakout_room_features?: BreakoutRoomFeatures;
  display_external_link_features?: DisplayExternalLinkFeatures;
  ingress_features?: IngressFeatures;
  speech_to_text_translation_features?: SpeechToTextTranslationFeatures;
  end_to_end_encryption_features?: EndToEndEncryptionFeatures;
};

export type RecordingFeaturesParams = {
  is_allow: boolean;
  is_allow_cloud: boolean;
  is_allow_local: boolean;
  enable_auto_cloud_recording: boolean;
};

export type ChatFeaturesParams = {
  allow_chat: boolean;
  allow_file_upload: boolean;
  allowed_file_types: Array<string>;
  max_file_size: number;
};

export type SharedNotePadFeaturesParams = {
  allowed_shared_note_pad: boolean;
};

export type WhiteboardFeaturesParams = {
  allowed_whiteboard: boolean;
  preload_file?: string;
};

export type ExternalMediaPlayerFeatures = {
  allowed_external_media_player: boolean;
};

export type WaitingRoomFeatures = {
  is_active: boolean;
  waiting_room_msg?: string;
};

export type BreakoutRoomFeatures = {
  is_allow: boolean;
};

export type DisplayExternalLinkFeatures = {
  is_allow: boolean;
};

export type IngressFeatures = {
  is_allow: boolean;
};

export type SpeechToTextTranslationFeatures = {
  is_allow: boolean;
  is_allow_translation: boolean;
};

export type EndToEndEncryptionFeatures = {
  is_enabled: boolean;
};

export type LockSettingsParams = {
  lock_microphone?: boolean;
  lock_webcam?: boolean;
  lock_screen_sharing?: boolean;
  lock_whiteboard?: boolean;
  lock_shared_notepad?: boolean;
  lock_chat?: boolean;
  lock_chat_send_message?: boolean;
  lock_chat_file_share?: boolean;
};

export type CreateRoomResponse = {
  status: boolean;
  msg: string;
  roomInfo?: CreateRoomResponseRoomInfo;
};

export type CreateRoomResponseRoomInfo = {
  sid: string;
  name: string;
  max_participants: number;
  empty_timeout: number;
  creation_time: number;
  turn_password: string;
  enabled_codecs: Array<any>;
  metadata: string;
};
