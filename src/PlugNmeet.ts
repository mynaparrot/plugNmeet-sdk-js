import { ApiTransport } from './ApiTransport';
import { CreateRoomParams, CreateRoomResponse } from './types/createRoom';
import { JoinTokenParams, JoinTokenResponse } from './types/joinToken';
import { IsRoomActiveParams, IsRoomActiveResponse } from './types/isRoomActive';
import {
  ActiveRoomInfoParams,
  ActiveRoomInfoResponse,
} from './types/activeRoomInfo';
import { ActiveRoomsInfoResponse } from './types/activeRoomsInfo';
import { EndRoomParams, EndRoomResponse } from './types/endRoom';
import {
  FetchRecordingsParams,
  FetchRecordingsResponse,
} from './types/fetchRecordings';
import {
  DeleteRecordingsParams,
  DeleteRecordingsResponse,
} from './types/deleteRecordings';
import {
  RecordingDownloadTokenParams,
  RecordingDownloadTokenResponse,
} from './types/RecordingDownloadToken';
import { ClientFilesResponse } from './types/clientFiles';

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
}
