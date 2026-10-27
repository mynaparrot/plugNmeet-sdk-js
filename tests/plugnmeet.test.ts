import { create } from '@bufbuild/protobuf';
import {
  CreateRoomReqSchema,
  GenerateTokenReqSchema,
  IsRoomActiveReqSchema,
  RoomEndReqSchema,
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
  });
});
