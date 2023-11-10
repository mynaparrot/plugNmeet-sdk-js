import { ApiTransport } from './ApiTransport.ts';
import { CreateRoomParams, CreateRoomResponse } from './types/createRoom.ts';
import { JoinTokenParams, JoinTokenResponse } from './types/joinToken.ts';
import {
  IsRoomActiveParams,
  IsRoomActiveResponse,
} from './types/isRoomActive.ts';
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
import { ClientFilesResponse } from './types/clientFiles.ts';
import { FetchPastRoomsInfoParams, FetchRoomsInfoResponse } from "../src";

export class PlugNmeet {
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
   * @param params: CreateRoomParams
   * @returns Promise<CreateRoomResponse>
   */
  public async createRoom(
    params: CreateRoomParams,
  ): Promise<CreateRoomResponse> {
    const output = await this.apiTransport.sendRequest('/room/create', params);
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
    const output = await this.apiTransport.sendRequest(
      '/room/getJoinToken',
      params,
    );
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
    const output = await this.apiTransport.sendRequest(
      '/room/isRoomActive',
      params,
    );
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
    const output = await this.apiTransport.sendRequest(
      '/room/getActiveRoomInfo',
      params,
    );
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
    const output = await this.apiTransport.sendRequest(
      '/room/getActiveRoomsInfo',
      {},
    );
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
   * Fetch info about past rooms
   * @param params: FetchPastRoomsInfoParams
   * @returns Promise<FetchRoomsInfoResponse>
   */
  public async fetchPastRoomsInfo(
    params: FetchPastRoomsInfoParams,
  ): Promise<FetchRoomsInfoResponse> {
    const output = await this.apiTransport.sendRequest(
      '/room/fetchPastRooms',
      params,
    );
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
   * End active room
   * @param params: EndRoomParams
   * @returns Promise<EndRoomResponse>
   */
  public async endRoom(params: EndRoomParams): Promise<EndRoomResponse> {
    const output = await this.apiTransport.sendRequest('/room/endRoom', params);
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
    const output = await this.apiTransport.sendRequest(
      '/recording/fetch',
      params,
    );
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
    const output = await this.apiTransport.sendRequest(
      '/recording/delete',
      params,
    );
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
    const output = await this.apiTransport.sendRequest(
      '/recording/getDownloadToken',
      params,
    );
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
   * @returns Promise<ClientFilesResponse>
   */
  public async getClientFiles(): Promise<ClientFilesResponse> {
    const output = await this.apiTransport.sendRequest('/getClientFiles', {});
    if (!output.status) {
      return {
        status: false,
        msg: output.response,
      };
    }

    return {
      status: output.response.status,
      msg: output.response.msg,
      css: output.response.css,
      js: output.response.js,
    };
  }
}
