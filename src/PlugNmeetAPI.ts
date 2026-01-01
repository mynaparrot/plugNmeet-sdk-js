import {
  CreateRoomReq,
  CreateRoomRes,
  GenerateTokenReq,
  GenerateTokenRes,
  IsRoomActiveReq,
  IsRoomActiveRes,
  GetActiveRoomInfoReq,
  GetActiveRoomInfoRes,
  GetActiveRoomsInfoRes,
  FetchPastRoomsReq,
  FetchPastRoomsRes,
  RoomEndReq,
  RoomEndRes,
  FetchArtifactsReq,
  FetchArtifactsRes,
  DeleteArtifactReq,
  DeleteArtifactRes,
  GetArtifactDownloadTokenReq,
  GetArtifactDownloadTokenRes,
  ArtifactInfoReq,
  ArtifactInfoRes,
  FetchRecordingsReq,
  FetchRecordingsRes,
  DeleteRecordingReq,
  DeleteRecordingRes,
  GetDownloadTokenReq,
  GetDownloadTokenRes,
  RecordingInfoReq,
  RecordingInfoRes,
  UpdateRecordingMetadataReq,
  UpdateRecordingMetadataRes,
  GetClientFilesRes,
} from 'plugnmeet-protocol-js';

export interface PlugNmeetAPI {
  /**
   * Create new room
   * @returns Promise<CreateRoomRes>
   * @param params
   */
  createRoom(params: CreateRoomReq): Promise<CreateRoomRes>;
  /**
   * Generate join token
   * @param params
   * @returns Promise<GenerateTokenRes>
   */
  getJoinToken(params: GenerateTokenReq): Promise<GenerateTokenRes>;
  /**
   * If room is active or not
   * @param params
   * @returns Promise<IsRoomActiveRes>
   */
  isRoomActive(params: IsRoomActiveReq): Promise<IsRoomActiveRes>;
  /**
   * Get active room information
   * @param params
   * @returns Promise<GetActiveRoomInfoRes>
   */
  getActiveRoomInfo(
    params: GetActiveRoomInfoReq,
  ): Promise<GetActiveRoomInfoRes>;
  /**
   * Get all active rooms
   * @returns Promise<GetActiveRoomsInfoRes>
   */
  getActiveRoomsInfo(): Promise<GetActiveRoomsInfoRes>;
  /**
   * Fetch info about past rooms
   * @param params
   * @returns Promise<FetchPastRoomsRes>
   */
  fetchPastRoomsInfo(params: FetchPastRoomsReq): Promise<FetchPastRoomsRes>;
  /**
   * End active room
   * @param params
   * @returns Promise<RoomEndRes>
   */
  endRoom(params: RoomEndReq): Promise<RoomEndRes>;
  /**
   * Fetch artifacts
   * @param params
   * @returns Promise<FetchArtifactsRes>
   */
  fetchArtifacts(params: FetchArtifactsReq): Promise<FetchArtifactsRes>;
  /**
   * Delete artifact
   * @param params
   * @returns Promise<DeleteArtifactRes>
   */
  deleteArtifact(params: DeleteArtifactReq): Promise<DeleteArtifactRes>;
  /**
   * Generate token to download Artifact
   * @param params
   * @returns Promise<AnalyticsDownloadTokenResponse>
   */
  getArtifactDownloadToken(
    params: GetArtifactDownloadTokenReq,
  ): Promise<GetArtifactDownloadTokenRes>;
  /**
   * Get Artifact details
   * @param params
   * @returns Promise<ArtifactInfoRes>
   */
  getArtifactInfo(params: ArtifactInfoReq): Promise<ArtifactInfoRes>;
  /**
   * Fetch recordings
   * @param params
   * @returns Promise<FetchRecordingsRes>
   */
  fetchRecordings(params: FetchRecordingsReq): Promise<FetchRecordingsRes>;
  /**
   * Delete recording
   * @param params
   * @returns Promise<DeleteRecordingRes>
   */
  deleteRecordings(params: DeleteRecordingReq): Promise<DeleteRecordingRes>;
  /**
   * Generate token to download recording
   * @param params
   * @returns Promise<GetDownloadTokenRes>
   */
  getRecordingDownloadToken(
    params: GetDownloadTokenReq,
  ): Promise<GetDownloadTokenRes>;
  /**
   * Update recording metadata info
   * @param params
   * @returns Promise<UpdateRecordingMetadataRes>
   */
  updateRecordingMetadata(
    params: UpdateRecordingMetadataReq,
  ): Promise<UpdateRecordingMetadataRes>;
  /**
   * Get recording details
   * @param params
   * @returns Promise<RecordingInfoRes>
   */
  getRecordingInfo(params: RecordingInfoReq): Promise<RecordingInfoRes>;
  /**
   * To get JS & CSS files to build interface
   * @returns Promise<GetClientFilesRes>
   */
  getClientFiles(): Promise<GetClientFilesRes>;
}
