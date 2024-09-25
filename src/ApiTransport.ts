import http from 'http';
import https, { RequestOptions } from 'https';
import { createHmac } from 'crypto';

export type APIResponse = {
  status: boolean;
  response: any;
};

export class ApiTransport {
  protected apiEndPointURL: string;
  protected apiKey: string;
  protected apiSecret: string;

  private isSecure = false;
  private mainOptions: RequestOptions = {};

  constructor(apiEndPointURL: string, apiKey: string, apiSecret: string) {
    this.apiEndPointURL = apiEndPointURL;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    const url = new URL(apiEndPointURL);
    let port = url.protocol === 'https:' ? 443 : 80;
    this.isSecure = url.protocol === 'https:' ? true : false;

    // use port if supplied with url
    if (url.port) {
      port = Number(url.port);
    }

    this.mainOptions = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      port,
    };
  }

  private prepareHeader = (body: string) => {
    const signature = createHmac('sha256', this.apiSecret)
      .update(body)
      .digest('hex');

    return {
      'Content-Type': 'application/json',
      'API-KEY': this.apiKey,
      'HASH-SIGNATURE': signature,
    };
  };

  public sendRequest = async (path: string, body: any) => {
    return new Promise<APIResponse>((resolve) => {
      const output: APIResponse = {
        status: false,
        response: undefined,
      };

      const chunk = JSON.stringify(body);

      const options = { ...this.mainOptions };
      options.path += path;
      options.headers = this.prepareHeader(chunk);

      const req = (this.isSecure ? https : http).request(options, (res) => {
        const body: Array<Uint8Array> = [];
        res.on('data', (chunk) => body.push(chunk));

        res.on('end', () => {
          const resString = Buffer.concat(body).toString();

          try {
            output.status = true;
            output.response = JSON.parse(resString);
          } catch (error) {
            output.status = false;
            output.response = error;
          }

          resolve(output);
        });
      });

      req.on('error', (error) => {
        output.response = error.message;
        resolve(output);
      });

      req.write(chunk);
      req.end();
    });
  };
}
