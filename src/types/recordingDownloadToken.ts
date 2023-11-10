export type RecordingDownloadTokenParams = {
  record_id: string;
};

export type RecordingDownloadTokenResponse = {
  status: boolean;
  msg: string;
  token?: string;
};
