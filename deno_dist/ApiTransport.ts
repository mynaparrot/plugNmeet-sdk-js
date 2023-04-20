import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

export type APIResponse = {
  status: boolean;
  response: any;
};

export class ApiTransport {
  protected apiEndPointURL: string;
  protected apiKey: string;
  protected apiSecret: string;

  constructor(apiEndPointURL: string, apiKey: string, apiSecret: string) {
    this.apiEndPointURL = apiEndPointURL;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  public sendRequest = async (path: string, body: any) => {
    const output: APIResponse = {
      status: false,
      response: undefined,
    };

    const b = JSON.stringify(body);
    const signature = hmac('sha256', this.apiSecret, b, 'utf8', 'hex');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'API-KEY': this.apiKey,
      'HASH-SIGNATURE': signature,
    };

    try {
      const req = await fetch(`${this.apiEndPointURL}${path}`, {
        method: 'POST',
        headers,
        body: b,
      });
      const res = await req.json();

      if (req.ok) {
        output.status = true;
        output.response = res;
      } else {
        output.response = res.msg;
      }
    } catch (error) {
      output.response = error.message;
    }

    return output;
  };
}
