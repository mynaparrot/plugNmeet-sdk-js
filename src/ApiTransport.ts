import axios, { AxiosInstance } from 'axios';
import { createHmac } from 'crypto';
import FormData from 'form-data';
import { fromJsonString } from '@bufbuild/protobuf';
import { CommonResponseSchema } from 'plugnmeet-protocol-js';

export type APIResponse = {
  status: boolean;
  response: any;
};

export class ApiTransport {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private axios: AxiosInstance;

  constructor(apiEndPointURL: string, apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    this.axios = axios.create({
      baseURL: apiEndPointURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private prepareHeader = (body: string): Record<string, string> => {
    const signature = createHmac('sha256', this.apiSecret)
      .update(body)
      .digest('hex');

    return {
      'API-KEY': this.apiKey,
      'HASH-SIGNATURE': signature,
    };
  };

  public sendRequest = async (path: string, body: string) => {
    const output: APIResponse = {
      status: false,
      response: undefined,
    };

    const headers = this.prepareHeader(body);

    try {
      const res = await this.axios.post(path, body, {
        headers,
        // Return the raw response string, preventing axios from decoding it.
        // The protobuf `fromJson` method will handle the parsing.
        transformResponse: [(data) => data],
      });
      output.status = true;
      output.response = res.data;
      return output;
    } catch (error: any) {
      output.response = error.message;
      if (error.response) {
        output.response = error.response.data;
      }
      return output;
    }
  };

  public sendMultipartRequest = async (
    path: string,
    roomId: string,
    formData: FormData,
  ) => {
    const output: APIResponse = {
      status: false,
      response: undefined,
    };

    const headers = {
      'Room-Id': roomId,
      ...this.prepareHeader(roomId),
      ...formData.getHeaders(),
    };

    try {
      const res = await this.axios.post(path, formData, {
        headers,
        // Return the raw response string, preventing axios from decoding it.
        // The protobuf `fromJson` method will handle the parsing.
        transformResponse: [(data) => data],
      });
      output.status = true;
      output.response = res.data;
      return output;
    } catch (error: any) {
      output.response = error.message;
      if (error.response) {
        try {
          const decode = fromJsonString(
            CommonResponseSchema,
            error.response.data,
          );
          output.response = decode.msg;
          // oxlint-disable-next-line
        } catch (e) {}
      }
      return output;
    }
  };
}
