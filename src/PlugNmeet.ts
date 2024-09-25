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
} from './types/recordingDownloadToken';
import { ClientFilesResponse } from './types/clientFiles';
import {
  FetchRoomsInfoResponse,
  FetchPastRoomsInfoParams,
} from './types/fetchPastRoomsInfo';
import {
  FetchAnalyticsParams,
  FetchAnalyticsResponse,
} from './types/fetchAnalytics';
import {
  DeleteAnalyticsParams,
  DeleteAnalyticsResponse,
} from './types/deleteAnalytics';
import {
  AnalyticsDownloadTokenParams,
  AnalyticsDownloadTokenResponse,
} from './types/analyticsDownloadToken';
import { PlugNmeetAPI } from './types/PlugNmeetAPI';

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
      room_info: output.response.room_info,
    };
  }

  /**
   * Generate join token
   * @param params
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
   * @param params
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
      is_active: output.response.is_active,
      msg: output.response.msg,
    };
  }

  /**
   * Get active room information
   * @param params
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
   * @param params
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
   * @param params
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
   * Fetch analytics
   * @param params
   * @returns Promise<FetchAnalyticsResponse>
   */
  public async fetchAnalytics(
    params: FetchAnalyticsParams,
  ): Promise<FetchAnalyticsResponse> {
    const output = await this.apiTransport.sendRequest(
      '/analytics/fetch',
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
   * Delete analytics
   * @param params
   * @returns Promise<DeleteAnalyticsResponse>
   */
  public async deleteAnalytics(
    params: DeleteAnalyticsParams,
  ): Promise<DeleteAnalyticsResponse> {
    const output = await this.apiTransport.sendRequest(
      '/analytics/delete',
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
   * @param params
   * @returns Promise<AnalyticsDownloadTokenResponse>
   */
  public async getAnalyticsDownloadToken(
    params: AnalyticsDownloadTokenParams,
  ): Promise<AnalyticsDownloadTokenResponse> {
    const output = await this.apiTransport.sendRequest(
      '/analytics/getDownloadToken',
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
   * Fetch recordings
   * @param params
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
   * @param params
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
   * @param params
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
   * To get JS & CSS files to build interface
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
