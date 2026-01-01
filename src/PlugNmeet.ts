import { create, fromJsonString, toJsonString } from '@bufbuild/protobuf';
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
  CreateRoomReqSchema,
  CreateRoomResSchema,
  GenerateTokenReqSchema,
  GenerateTokenResSchema,
  IsRoomActiveReqSchema,
  IsRoomActiveResSchema,
  GetActiveRoomInfoReqSchema,
  GetActiveRoomInfoResSchema,
  GetActiveRoomsInfoResSchema,
  FetchPastRoomsReqSchema,
  FetchPastRoomsResSchema,
  RoomEndReqSchema,
  RoomEndResSchema,
  FetchArtifactsReqSchema,
  FetchArtifactsResSchema,
  DeleteArtifactReqSchema,
  DeleteArtifactResSchema,
  GetArtifactDownloadTokenReqSchema,
  GetArtifactDownloadTokenResSchema,
  ArtifactInfoReqSchema,
  ArtifactInfoResSchema,
  FetchRecordingsReqSchema,
  FetchRecordingsResSchema,
  DeleteRecordingReqSchema,
  DeleteRecordingResSchema,
  GetDownloadTokenReqSchema,
  GetDownloadTokenResSchema,
  RecordingInfoReqSchema,
  RecordingInfoResSchema,
  UpdateRecordingMetadataReqSchema,
  UpdateRecordingMetadataResSchema,
  GetClientFilesResSchema,
} from 'plugnmeet-protocol-js';

import { ApiTransport } from './ApiTransport';
import { PlugNmeetAPI } from './PlugNmeetAPI';

export class PlugNmeet implements PlugNmeetAPI {
  protected defaultPath = '/auth';
  private apiTransport: ApiTransport;

  /**
   * @param serverUrl plugNmeet server URL
   * @param apiKey plugNmeet API_Key
   * @param apiSecret plugNmeet API_Secret
   */
  constructor(serverUrl: string, apiKey: string, apiSecret: string) {
    this.apiTransport = new ApiTransport(
      serverUrl + this.defaultPath,
      apiKey,
      apiSecret,
    );
  }

  /**
   * Create new room
   * @param params
   * @returns Promise<CreateRoomRes>
   */
  public async createRoom(params: CreateRoomReq): Promise<CreateRoomRes> {
    const body = create(CreateRoomReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/room/create',
      toJsonString(CreateRoomReqSchema, body),
    );
    const output = create(CreateRoomResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(CreateRoomResSchema, res.response);
  }

  /**
   * Generate join token
   * @param params
   * @returns Promise<GenerateTokenRes>
   */
  public async getJoinToken(
    params: GenerateTokenReq,
  ): Promise<GenerateTokenRes> {
    const body = create(GenerateTokenReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/room/getJoinToken',
      toJsonString(GenerateTokenReqSchema, body),
    );
    const output = create(GenerateTokenResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(GenerateTokenResSchema, res.response);
  }

  /**
   * If room is active or not
   * @param params
   * @returns Promise<IsRoomActiveRes>
   */
  public async isRoomActive(params: IsRoomActiveReq): Promise<IsRoomActiveRes> {
    const body = create(IsRoomActiveReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/room/isRoomActive',
      toJsonString(IsRoomActiveReqSchema, body),
    );
    const output = create(IsRoomActiveResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(IsRoomActiveResSchema, res.response);
  }

  /**
   * Get active room information
   * @param params
   * @returns Promise<GetActiveRoomInfoRes>
   */
  public async getActiveRoomInfo(
    params: GetActiveRoomInfoReq,
  ): Promise<GetActiveRoomInfoRes> {
    const body = create(GetActiveRoomInfoReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/room/getActiveRoomInfo',
      toJsonString(GetActiveRoomInfoReqSchema, body),
    );
    const output = create(GetActiveRoomInfoResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(GetActiveRoomInfoResSchema, res.response);
  }

  /**
   * Get all active rooms
   * @returns Promise<GetActiveRoomsInfoRes>
   */
  public async getActiveRoomsInfo(): Promise<GetActiveRoomsInfoRes> {
    const res = await this.apiTransport.sendRequest(
      '/room/getActiveRoomsInfo',
      '{}',
    );
    const output = create(GetActiveRoomsInfoResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(GetActiveRoomsInfoResSchema, res.response);
  }

  /**
   * Fetch info about past rooms
   * @param params
   * @returns Promise<FetchPastRoomsRes>
   */
  public async fetchPastRoomsInfo(
    params: FetchPastRoomsReq,
  ): Promise<FetchPastRoomsRes> {
    const body = create(FetchPastRoomsReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/room/fetchPastRooms',
      toJsonString(FetchPastRoomsReqSchema, body),
    );
    const output = create(FetchPastRoomsResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(FetchPastRoomsResSchema, res.response);
  }

  /**
   * End active room
   * @param params
   * @returns Promise<RoomEndRes>
   */
  public async endRoom(params: RoomEndReq): Promise<RoomEndRes> {
    const body = create(RoomEndReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/room/endRoom',
      toJsonString(RoomEndReqSchema, body),
    );
    const output = create(RoomEndResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(RoomEndResSchema, res.response);
  }

  /**
   * Fetch artifacts
   * @param params
   * @returns Promise<FetchArtifactsRes>
   */
  public async fetchArtifacts(
    params: FetchArtifactsReq,
  ): Promise<FetchArtifactsRes> {
    const body = create(FetchArtifactsReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/artifact/fetch',
      toJsonString(FetchArtifactsReqSchema, body),
    );
    const output = create(FetchArtifactsResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(FetchArtifactsResSchema, res.response);
  }

  /**
   * Delete artifact
   * @param params
   * @returns Promise<DeleteArtifactRes>
   */
  public async deleteArtifact(
    params: DeleteArtifactReq,
  ): Promise<DeleteArtifactRes> {
    const body = create(DeleteArtifactReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/artifact/delete',
      toJsonString(DeleteArtifactReqSchema, body),
    );
    const output = create(DeleteArtifactResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(DeleteArtifactResSchema, res.response);
  }

  /**
   * Generate token to download Artifact
   * @param params
   * @returns Promise<GetArtifactDownloadTokenRes>
   */
  public async getArtifactDownloadToken(
    params: GetArtifactDownloadTokenReq,
  ): Promise<GetArtifactDownloadTokenRes> {
    const body = create(GetArtifactDownloadTokenReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/artifact/getDownloadToken',
      toJsonString(GetArtifactDownloadTokenReqSchema, body),
    );
    const output = create(GetArtifactDownloadTokenResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(GetArtifactDownloadTokenResSchema, res.response);
  }

  /**
   * Get Artifact details
   * @param params
   * @returns Promise<ArtifactInfoRes>
   */
  public async getArtifactInfo(
    params: ArtifactInfoReq,
  ): Promise<ArtifactInfoRes> {
    const body = create(ArtifactInfoReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/artifact/info',
      toJsonString(ArtifactInfoReqSchema, body),
    );
    const output = create(ArtifactInfoResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(ArtifactInfoResSchema, res.response);
  }

  /**
   * Fetch recordings
   * @param params
   * @returns Promise<FetchRecordingsRes>
   */
  public async fetchRecordings(
    params: FetchRecordingsReq,
  ): Promise<FetchRecordingsRes> {
    const body = create(FetchRecordingsReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/recording/fetch',
      toJsonString(FetchRecordingsReqSchema, body),
    );
    const output = create(FetchRecordingsResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(FetchRecordingsResSchema, res.response);
  }

  /**
   * Delete recording
   * @param params
   * @returns Promise<DeleteRecordingRes>
   */
  public async deleteRecordings(
    params: DeleteRecordingReq,
  ): Promise<DeleteRecordingRes> {
    const body = create(DeleteRecordingReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/recording/delete',
      toJsonString(DeleteRecordingReqSchema, body),
    );
    const output = create(DeleteRecordingResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(DeleteRecordingResSchema, res.response);
  }

  /**
   * Generate token to download recording
   * @param params
   * @returns Promise<GetDownloadTokenRes>
   */
  public async getRecordingDownloadToken(
    params: GetDownloadTokenReq,
  ): Promise<GetDownloadTokenRes> {
    const body = create(GetDownloadTokenReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/recording/getDownloadToken',
      toJsonString(GetDownloadTokenReqSchema, body),
    );
    const output = create(GetDownloadTokenResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(GetDownloadTokenResSchema, res.response);
  }

  /**
   * Update recording metadata info
   * @param params
   * @returns Promise<UpdateRecordingMetadataRes>
   */
  public async updateRecordingMetadata(
    params: UpdateRecordingMetadataReq,
  ): Promise<UpdateRecordingMetadataRes> {
    const body = create(UpdateRecordingMetadataReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/recording/updateMetadata',
      toJsonString(UpdateRecordingMetadataReqSchema, body),
    );
    const output = create(UpdateRecordingMetadataResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(UpdateRecordingMetadataResSchema, res.response);
  }

  /**
   * Get recording details
   * @param params
   * @returns Promise<RecordingInfoRes>
   */
  public async getRecordingInfo(
    params: RecordingInfoReq,
  ): Promise<RecordingInfoRes> {
    const body = create(RecordingInfoReqSchema, params);
    const res = await this.apiTransport.sendRequest(
      '/recording/info',
      toJsonString(RecordingInfoReqSchema, body),
    );
    const output = create(RecordingInfoResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(RecordingInfoResSchema, res.response);
  }

  /**
   * To get JS & CSS files to build interface
   * @returns Promise<GetClientFilesRes>
   */
  public async getClientFiles(): Promise<GetClientFilesRes> {
    const res = await this.apiTransport.sendRequest('/getClientFiles', '{}');
    const output = create(GetClientFilesResSchema);

    if (!res.status) {
      output.msg = res.response;
      return output;
    }

    return fromJsonString(GetClientFilesResSchema, res.response);
  }
}
