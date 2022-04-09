import { prepareAPI, sendRequest } from './api.ts';
import { CreateRoomParams, CreateRoomResponse } from './types/createRoom.ts';
import { JoinTokenParams, JoinTokenResponse } from './types/joinToken.ts';
import { IsRoomActiveParams, IsRoomActiveResponse } from './types/isRoomActive.ts';
import {
  ActiveRoomInfoParams,
  ActiveRoomInfoResponse,
} from './types/activeRoomInfo.ts';
import { ActiveRoomsInfoResponse } from './types/activeRoomsInfo.ts';
import { EndRoomParams, EndRoomResponse } from './types/endRoom.ts';
import {
  FetchRecordingsParams,
  FetchRecordingsResponse,
} from './types/fetchRecordings.ts';
import {
  DeleteRecordingsParams,
  DeleteRecordingsResponse,
} from './types/deleteRecordings.ts';
import {
  RecordingDownloadTokenParams,
  RecordingDownloadTokenResponse,
} from './types/RecordingDownloadToken.ts';

export class PlugNmeet {
  protected defaultPath = '/auth';

  /**
   * @param serverUrl plugNmeet server URL
   * @param apiKey plugNmeet API_Key
   * @param apiSecret plugNmeet API_Secret
   */
  constructor(serverUrl: string, apiKey: string, apiSecret: string) {
    prepareAPI(serverUrl + this.defaultPath, apiKey, apiSecret);
  }

  /**
   * Create new room
   * @param params: CreateRoomParams
   * @returns Promise<CreateRoomResponse>
   */
  public async createRoom(
    params: CreateRoomParams,
  ): Promise<CreateRoomResponse> {
    const output = await sendRequest('/room/create', params);
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
      roomInfo: output.response.roomInfo,
    };
  }

  /**
   * Generate join token
   * @param params: JoinTokenParams
   * @returns Promise<JoinTokenResponse>
   */
  public async getJoinToken(
    params: JoinTokenParams,
  ): Promise<JoinTokenResponse> {
    const output = await sendRequest('/room/getJoinToken', params);
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
      token: output.response.token,
    };
  }

  /**
   * If room is active or not
   * @param params: IsRoomActiveParams
   * @returns Promise<IsRoomActiveResponse>
   */
  public async isRoomActive(
    params: IsRoomActiveParams,
  ): Promise<IsRoomActiveResponse> {
    const output = await sendRequest('/room/isRoomActive', params);
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
    };
  }

  /**
   * Get active room information
   * @param params: ActiveRoomInfoParams
   * @returns Promise<ActiveRoomInfoResponse>
   */
  public async getActiveRoomInfo(
    params: ActiveRoomInfoParams,
  ): Promise<ActiveRoomInfoResponse> {
    const output = await sendRequest('/room/getActiveRoomInfo', params);
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
      room: output.response.room,
    };
  }

  /**
   * Get all active rooms
   * @returns Promise<ActiveRoomsInfoResponse>
   */
  public async getActiveRoomsInfo(): Promise<ActiveRoomsInfoResponse> {
    const output = await sendRequest('/room/getActiveRoomsInfo', {});
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
      rooms: output.response.rooms,
    };
  }

  /**
   * End active room
   * @param params: EndRoomParams
   * @returns Promise<EndRoomResponse>
   */
  public async endRoom(params: EndRoomParams): Promise<EndRoomResponse> {
    const output = await sendRequest('/room/endRoom', params);
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
    };
  }

  /**
   * Fetch recordings
   * @param params: FetchRecordingsParams
   * @returns Promise<FetchRecordingsResponse>
   */
  public async fetchRecordings(
    params: FetchRecordingsParams,
  ): Promise<FetchRecordingsResponse> {
    const output = await sendRequest('/recording/fetch', params);
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
      result: output.response.result,
    };
  }

  /**
   * Delete recording
   * @param params: DeleteRecordingsParams
   * @returns Promise<DeleteRecordingsResponse>
   */
  public async deleteRecordings(
    params: DeleteRecordingsParams,
  ): Promise<DeleteRecordingsResponse> {
    const output = await sendRequest('/recording/delete', params);
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
    };
  }

  /**
   * Generate token to download recording
   * @param params: RecordingDownloadTokenParams
   * @returns Promise<RecordingDownloadTokenResponse>
   */
  public async getRecordingDownloadToken(
    params: RecordingDownloadTokenParams,
  ): Promise<RecordingDownloadTokenResponse> {
    const output = await sendRequest('/recording/getDownloadToken', params);
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
      token: output.response.token,
    };
  }
}
