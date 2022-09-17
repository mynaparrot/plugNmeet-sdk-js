import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

let _endPoint: string, _apiKey = "", _apiSecret = "";

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
  _endPoint = apiEndPointURL;
};

export const sendRequest = async (path: string, body: any) => {
  const output: APIResponse = {
    status: false,
    response: undefined,
  };

  const b = JSON.stringify(body)
  const signature = hmac('sha256', _apiSecret, b, 'utf8', 'hex');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'API-KEY': _apiKey,
    'HASH-SIGNATURE': signature,
  };

  const resp = await fetch(`${_endPoint}${path}`, {
    method: 'POST',
    headers,
    body: b,
  });

  if (resp.ok) {
    output.status = true;
    output.response = await resp.json();
  } else {
    output.response = resp.json();
  }

  return output;
};
