export type FetchRecordingsParams = {
  room_ids: Array<string>;
  from?: number;
  limit?: number;
  order_by?: 'ASC' | 'DESC';
};

export type FetchRecordingsResponse = {
  status: boolean;
  msg: string;
  result?: FetchRecordingsResult;
};

export type FetchRecordingsResult = {
  total_recordings: number;
  from: number;
  limit: number;
  order_by: string;
  recordings_list: Array<RecordingInfo>;
};

export type RecordingInfo = {
  record_id: string;
  room_id: string;
  room_sid: string;
  file_path: string;
  file_size: number;
  creation_time: number;
  room_creation_time: number;
};
