import { create } from '@bufbuild/protobuf';
import {
  CreatePollReqSchema,
  CreateRoomReqSchema,
  GenerateTokenReqSchema,
  IsRoomActiveReqSchema,
  RoomEndReqSchema,
  StatusCode,
  UserInfoSchema,
} from 'plugnmeet-protocol-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PlugNmeet } from '../src/PlugNmeet';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({ post })),
  },
}));

const createClient = () =>
  new PlugNmeet('http://localhost:8080', 'test-key', 'test-secret');

describe('PlugNmeet', () => {
  beforeEach(() => {
    post.mockReset();
  });

  it('creates a room and decodes the raw response', async () => {
    post.mockResolvedValue({ data: '{"status":true,"msg":"created"}' });

    const result = await createClient().createRoom(
      create(CreateRoomReqSchema, { roomId: 'room-1' }),
    );

    expect(post).toHaveBeenCalledTimes(1);
    const [path, body] = post.mock.calls[0];
    expect(path).toBe('/room/create');
    expect(body).toBe('{"roomId":"room-1"}');
    expect(result).toMatchObject({
      $typeName: 'plugnmeet.CreateRoomRes',
      status: true,
      msg: 'created',
    });
  });

  it('requests a join token with the nested user info', async () => {
    post.mockResolvedValue({
      data: '{"status":true,"msg":"ok","token":"tok-123"}',
    });

    const result = await createClient().getJoinToken(
      create(GenerateTokenReqSchema, {
        roomId: 'room-1',
        userInfo: create(UserInfoSchema, {
          name: 'User One',
          userId: 'u1',
          isAdmin: true,
        }),
      }),
    );

    expect(post).toHaveBeenCalledTimes(1);
    const [path, body] = post.mock.calls[0];
    expect(path).toBe('/room/getJoinToken');
    expect(body).toBe(
      '{"roomId":"room-1","userInfo":{"name":"User One","userId":"u1","isAdmin":true}}',
    );
    expect(result).toMatchObject({
      $typeName: 'plugnmeet.GenerateTokenRes',
      status: true,
      token: 'tok-123',
    });
  });

  it('ends a room', async () => {
    post.mockResolvedValue({ data: '{"status":true,"msg":"ended"}' });

    const result = await createClient().endRoom(
      create(RoomEndReqSchema, { roomId: 'room-1' }),
    );

    const [path, body] = post.mock.calls[0];
    expect(path).toBe('/room/endRoom');
    expect(body).toBe('{"roomId":"room-1"}');
    expect(result).toMatchObject({
      $typeName: 'plugnmeet.RoomEndRes',
      status: true,
      msg: 'ended',
    });
  });

  it('reports transport failures through msg', async () => {
    post.mockRejectedValue(new Error('invalid signature'));

    const result = await createClient().isRoomActive(
      create(IsRoomActiveReqSchema, { roomId: 'room-1' }),
    );

    const [path] = post.mock.calls[0];
    expect(path).toBe('/room/isRoomActive');
    expect(result.status).toBe(false);
    expect(result.msg).toBe('invalid signature');
    expect(result.statusCode).toBe(StatusCode.UNKNOWN_STATUS);
  });

  it('propagates the CommonResponse status code from an error body', async () => {
    const error = Object.assign(new Error('Request failed'), {
      response: {
        data: '{"status":false,"msg":"The room was not found.","status_code":"ROOM_NOT_FOUND"}',
      },
    });
    post.mockRejectedValue(error);

    const result = await createClient().isRoomActive(
      create(IsRoomActiveReqSchema, { roomId: 'room-1' }),
    );

    expect(result.status).toBe(false);
    expect(result.msg).toBe('The room was not found.');
    expect(result.statusCode).toBe(StatusCode.ROOM_NOT_FOUND);
  });

  it('keeps a CommonResponse error returned with HTTP 200', async () => {
    post.mockResolvedValue({
      data: '{"status":false,"msg":"The room was not found.","status_code":"ROOM_NOT_FOUND"}',
    });

    const result = await createClient().isRoomActive(
      create(IsRoomActiveReqSchema, { roomId: 'room-1' }),
    );

    expect(result.status).toBe(false);
    expect(result.msg).toBe('The room was not found.');
    expect(result.statusCode).toBe(StatusCode.ROOM_NOT_FOUND);
  });

  it('propagates errors from parameterless endpoints', async () => {
    const error = Object.assign(new Error('Request failed'), {
      response: {
        data: '{"status":false,"msg":"Permission denied","status_code":"PERMISSION_DENIED"}',
      },
    });
    post.mockRejectedValue(error);

    const result = await createClient().getActiveRoomsInfo();

    const [path, body] = post.mock.calls[0];
    expect(path).toBe('/room/getActiveRoomsInfo');
    expect(body).toBe('{}');
    expect(result.status).toBe(false);
    expect(result.msg).toBe('Permission denied');
    expect(result.statusCode).toBe(StatusCode.PERMISSION_DENIED);
  });

  it('rejects uploads without a file source before calling the server', async () => {
    const result = await createClient().uploadWhiteboardFile({
      roomId: 'room-1',
    });

    expect(post).not.toHaveBeenCalled();
    expect(result.status).toBe(false);
    expect(result.msg).toBe('Either filePath or document_link is required');
    expect(result.statusCode).toBe(StatusCode.INVALID_PARAMETERS);
  });

  it('replaces the upload validation code with the server error code', async () => {
    const error = Object.assign(new Error('Request failed'), {
      response: {
        data: '{"status":false,"msg":"The room was not found.","status_code":"ROOM_NOT_FOUND"}',
      },
    });
    post.mockRejectedValue(error);

    const result = await createClient().uploadWhiteboardFile({
      roomId: 'room-1',
      document_link: 'https://example.com/doc.pdf',
    });

    expect(result.status).toBe(false);
    expect(result.msg).toBe('The room was not found.');
    expect(result.statusCode).toBe(StatusCode.ROOM_NOT_FOUND);
  });

  it('only exposes status and msg for createPoll errors', async () => {
    const error = Object.assign(new Error('Request failed'), {
      response: {
        data: '{"status":false,"msg":"The room was not found.","status_code":"ROOM_NOT_FOUND"}',
      },
    });
    post.mockRejectedValue(error);

    const result = await createClient().createPoll(
      create(CreatePollReqSchema, { roomId: 'room-1' }),
    );

    // CreatePollRes does not define status_code in the protocol.
    expect(result.status).toBe(false);
    expect(result.msg).toBe('The room was not found.');
    expect(result).not.toHaveProperty('statusCode');
  });
});
