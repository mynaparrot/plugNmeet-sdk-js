import http from 'http';
import https, { RequestOptions } from 'https';
import { createHmac } from 'crypto';

let mainOptions: RequestOptions,
  isSecure = true, _apiKey = "", _apiSecret = "";

export type APIResponse = {
  status: boolean;
  response: any;
};

export const prepareAPI = (
  apiEndPointURL: string,
  apiKey: string,
  apiSecret: string,
) => {
  _apiKey = apiKey;
  _apiSecret = apiSecret;

  const url = new URL(apiEndPointURL);
  let port = url.protocol === 'https:' ? 443 : 80;
  isSecure = url.protocol === 'https:' ?? false;

  // use port if supplied with url
  if (url.port) {
    port = Number(url.port);
  }

  mainOptions = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    port,
  };
};

const prepareHeader = (body: string) => {
  const signature = createHmac('sha256', _apiSecret)
    .update(body)
    .digest('hex');

  const headers = {
    'Content-Type': 'application/json',
    'API-KEY': _apiKey,
    'HASH-SIGNATURE': signature,
  };

  return headers;
};

export const sendRequest = async (path: string, body: any) => {
  return new Promise<APIResponse>((resolve) => {
    const output: APIResponse = {
      status: false,
      response: undefined,
    };

    const chunk = JSON.stringify(body);

    const options = { ...mainOptions };
    options.path += path;
    options.headers = prepareHeader(chunk);

    const req = (isSecure ? https : http).request(options, (res) => {
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
