let headers: HeadersInit, endPoint: string;

export type APIResponse = {
  status: boolean;
  response: any;
};

export const prepareAPI = (
  apiEndPointURL: string,
  apiKey: string,
  apiSecret: string,
) => {
  headers = {
    'Content-Type': 'application/json',
    'API-KEY': apiKey,
    'API-SECRET': apiSecret,
  };
  endPoint = apiEndPointURL;
};

export const sendRequest = async (path: string, body: any) => {
  const output: APIResponse = {
    status: false,
    response: undefined,
  };

  const resp = await fetch(`${endPoint}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (resp.ok) {
    output.status = true;
    output.response = await resp.json();
  } else {
    output.response = resp.json();
  }

  return output;
};
