import { createHmac } from 'node:crypto';

import FormData from 'form-data';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiTransport } from '../src/ApiTransport';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({ post })),
  },
}));

const API_KEY = 'test-key';
const API_SECRET = 'test-secret';

const sign = (payload: string) =>
  createHmac('sha256', API_SECRET).update(payload).digest('hex');

const createTransport = () =>
  new ApiTransport('http://localhost:8080', API_KEY, API_SECRET);

describe('ApiTransport.sendRequest', () => {
  beforeEach(() => {
    post.mockReset();
  });

  it('signs the raw body and returns the raw response', async () => {
    const body = '{"roomId":"room-1"}';
    const raw = '{"status":true,"msg":"ok"}';
    post.mockResolvedValue({ data: raw });

    const result = await createTransport().sendRequest('/room/create', body);

    expect(post).toHaveBeenCalledTimes(1);
    const [path, sentBody, config] = post.mock.calls[0];
    expect(path).toBe('/room/create');
    expect(sentBody).toBe(body);
    expect(config.headers).toEqual({
      'API-KEY': API_KEY,
      'HASH-SIGNATURE': sign(body),
    });
    expect(result).toEqual({ status: true, response: raw });
  });

  it('falls back to error.message when the request fails', async () => {
    post.mockRejectedValue(new Error('connect ECONNREFUSED'));

    const result = await createTransport().sendRequest('/room/create', '{}');

    expect(result).toEqual({
      status: false,
      response: 'connect ECONNREFUSED',
    });
  });

  it('prefers error.response.data when the server answers', async () => {
    const error = Object.assign(new Error('Request failed'), {
      response: { data: '{"status":false,"msg":"denied"}' },
    });
    post.mockRejectedValue(error);

    const result = await createTransport().sendRequest('/room/create', '{}');

    expect(result).toEqual({
      status: false,
      response: '{"status":false,"msg":"denied"}',
    });
  });
});

describe('ApiTransport.sendMultipartRequest', () => {
  beforeEach(() => {
    post.mockReset();
  });

  it('signs the room id and merges the form-data headers', async () => {
    const raw = '{"status":true,"msg":"uploaded"}';
    post.mockResolvedValue({ data: raw });
    const formData = new FormData();
    formData.append('document_link', 'https://example.com/doc.pdf');

    const result = await createTransport().sendMultipartRequest(
      '/room/uploadWhiteboardFile',
      'room-1',
      formData,
    );

    expect(post).toHaveBeenCalledTimes(1);
    const [path, sentForm, config] = post.mock.calls[0];
    expect(path).toBe('/room/uploadWhiteboardFile');
    expect(sentForm).toBe(formData);
    // The signature is computed over the room id, not over the form body.
    expect(config.headers['HASH-SIGNATURE']).toBe(sign('room-1'));
    expect(config.headers['API-KEY']).toBe(API_KEY);
    expect(config.headers['Room-Id']).toBe('room-1');
    expect(config.headers['content-type']).toMatch(
      /^multipart\/form-data; boundary=/,
    );
    expect(result).toEqual({ status: true, response: raw });
  });

  it('decodes the response message when the request fails', async () => {
    const error = Object.assign(new Error('Request failed'), {
      response: { data: '{"status":false,"msg":"upload denied"}' },
    });
    post.mockRejectedValue(error);

    const result = await createTransport().sendMultipartRequest(
      '/room/uploadWhiteboardFile',
      'room-1',
      new FormData(),
    );

    expect(result).toEqual({ status: false, response: 'upload denied' });
  });
});
