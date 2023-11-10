export type FetchAnalyticsParams = {
  room_ids: Array<string>;
  from?: number;
  limit?: number;
  order_by?: 'ASC' | 'DESC';
};

export type FetchAnalyticsResponse = {
  status: boolean;
  msg: string;
  result?: FetchAnalyticsResult;
};

export type FetchAnalyticsResult = {
  total_analytics: number;
  from: number;
  limit: number;
  order_by: string;
  analytics_list: Array<AnalyticsInfo>;
};

export type AnalyticsInfo = {
  room_id: string;
  file_id: string;
  file_name: string;
  file_size: number;
  creation_time: number;
  room_creation_time: number;
};
