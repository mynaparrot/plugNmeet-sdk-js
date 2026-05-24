import {
  ArtifactInfoReq,
  ArtifactInfoRes,
  BroadcastToRoomReq,
  CommonResponse,
  CreateRoomReq,
  CreateRoomRes,
  DeleteArtifactReq,
  DeleteArtifactRes,
  DeleteRecordingReq,
  DeleteRecordingRes,
  FetchArtifactsReq,
  FetchArtifactsRes,
  FetchPastRoomsReq,
  FetchPastRoomsRes,
  FetchRecordingsReq,
  FetchRecordingsRes,
  GenerateTokenReq,
  GenerateTokenRes,
  GetActiveRoomInfoReq,
  GetActiveRoomInfoRes,
  GetActiveRoomsInfoRes,
  GetArtifactDownloadTokenReq,
  GetArtifactDownloadTokenRes,
  GetClientFilesRes,
  GetDownloadTokenReq,
  GetDownloadTokenRes,
  IsRoomActiveReq,
  IsRoomActiveRes,
  MergeRecordingsReq,
  RecordingInfoReq,
  RecordingInfoRes,
  RoomEndReq,
  RoomEndRes,
  UpdateRecordingMetadataReq,
  UpdateRecordingMetadataRes,
} from 'plugnmeet-protocol-js';

export interface UploadWhiteboardFileReq {
  roomId: string;
  // You must provide either `filePath` or `document_link`, but not both.
  filePath?: string; // The local full file path to the document.
  document_link?: string;
}

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
   * Broadcast messages or notifications directly into an active Plug-N-Meet session in real-time.
   * @param params
   * @returns Promise<CommonResponse>
   */
  broadcastToRoom(params: BroadcastToRoomReq): Promise<CommonResponse>;
  /**
   * Upload a file to be used on the whiteboard.
   * @param params
   * @returns Promise<CommonResponse>
   */
  uploadWhiteboardFile(
    params: UploadWhiteboardFileReq,
  ): Promise<CommonResponse>;
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
   * @returns Promise<GetArtifactDownloadTokenRes>
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
   * Merge multiple parts of a session's recording into a single new recording.
   * @param params
   * @returns Promise<CommonResponse>
   */
  mergeRecordings(params: MergeRecordingsReq): Promise<CommonResponse>;
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
