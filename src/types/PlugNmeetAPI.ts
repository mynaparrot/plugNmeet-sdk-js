import { CreateRoomParams, CreateRoomResponse } from './createRoom';
import { JoinTokenParams, JoinTokenResponse } from './joinToken';
import { IsRoomActiveParams, IsRoomActiveResponse } from './isRoomActive';
import { ActiveRoomInfoParams, ActiveRoomInfoResponse } from './activeRoomInfo';
import { ActiveRoomsInfoResponse } from './activeRoomsInfo';
import {
  FetchPastRoomsInfoParams,
  FetchRoomsInfoResponse,
} from './fetchPastRoomsInfo';
import { EndRoomParams, EndRoomResponse } from './endRoom';
import { FetchAnalyticsParams, FetchAnalyticsResponse } from './fetchAnalytics';
import {
  DeleteAnalyticsParams,
  DeleteAnalyticsResponse,
} from './deleteAnalytics';
import {
  AnalyticsDownloadTokenParams,
  AnalyticsDownloadTokenResponse,
} from './analyticsDownloadToken';
import {
  FetchRecordingsParams,
  FetchRecordingsResponse,
} from './fetchRecordings';
import {
  DeleteRecordingsParams,
  DeleteRecordingsResponse,
} from './deleteRecordings';
import {
  RecordingDownloadTokenParams,
  RecordingDownloadTokenResponse,
} from './recordingDownloadToken';
import { ClientFilesResponse } from './clientFiles';

export interface PlugNmeetAPI {
  /**
   * Create new room
   * @param params
   * @returns Promise<CreateRoomResponse>
   */
  createRoom(params: CreateRoomParams): Promise<CreateRoomResponse>;
  /**
   * Generate join token
   * @param params
   * @returns Promise<JoinTokenResponse>
   */
  getJoinToken(params: JoinTokenParams): Promise<JoinTokenResponse>;
  /**
   * If room is active or not
   * @param params
   * @returns Promise<IsRoomActiveResponse>
   */
  isRoomActive(params: IsRoomActiveParams): Promise<IsRoomActiveResponse>;
  /**
   * Get active room information
   * @param params
   * @returns Promise<ActiveRoomInfoResponse>
   */
  getActiveRoomInfo(
    params: ActiveRoomInfoParams,
  ): Promise<ActiveRoomInfoResponse>;
  /**
   * Get all active rooms
   * @returns Promise<ActiveRoomsInfoResponse>
   */
  getActiveRoomsInfo(): Promise<ActiveRoomsInfoResponse>;
  /**
   * Fetch info about past rooms
   * @param params
   * @returns Promise<FetchRoomsInfoResponse>
   */
  fetchPastRoomsInfo(
    params: FetchPastRoomsInfoParams,
  ): Promise<FetchRoomsInfoResponse>;
  /**
   * End active room
   * @param params
   * @returns Promise<EndRoomResponse>
   */
  endRoom(params: EndRoomParams): Promise<EndRoomResponse>;
  /**
   * Fetch analytics
   * @param params
   * @returns Promise<FetchAnalyticsResponse>
   */
  fetchAnalytics(params: FetchAnalyticsParams): Promise<FetchAnalyticsResponse>;
  /**
   * Delete analytics
   * @param params
   * @returns Promise<DeleteAnalyticsResponse>
   */
  deleteAnalytics(
    params: DeleteAnalyticsParams,
  ): Promise<DeleteAnalyticsResponse>;
  /**
   * Generate token to download recording
   * @param params
   * @returns Promise<AnalyticsDownloadTokenResponse>
   */
  getAnalyticsDownloadToken(
    params: AnalyticsDownloadTokenParams,
  ): Promise<AnalyticsDownloadTokenResponse>;
  /**
   * Fetch recordings
   * @param params
   * @returns Promise<FetchRecordingsResponse>
   */
  fetchRecordings(
    params: FetchRecordingsParams,
  ): Promise<FetchRecordingsResponse>;
  /**
   * Delete recording
   * @param params
   * @returns Promise<DeleteRecordingsResponse>
   */
  deleteRecordings(
    params: DeleteRecordingsParams,
  ): Promise<DeleteRecordingsResponse>;
  /**
   * Generate token to download recording
   * @param params
   * @returns Promise<RecordingDownloadTokenResponse>
   */
  getRecordingDownloadToken(
    params: RecordingDownloadTokenParams,
  ): Promise<RecordingDownloadTokenResponse>;

  /**
   * To get JS & CSS files to build interface
   * @returns Promise<ClientFilesResponse>
   */
  getClientFiles(): Promise<ClientFilesResponse>;
}
