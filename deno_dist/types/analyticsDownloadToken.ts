export type AnalyticsDownloadTokenParams = {
  file_id: string;
};

export type AnalyticsDownloadTokenResponse = {
  status: boolean;
  msg: string;
  token?: string;
};
