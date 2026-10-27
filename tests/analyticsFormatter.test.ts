import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { AnalyticsFormatter } from '../src/AnalyticsFormatter';
import type { RawAnalyticsData } from '../src/AnalyticsFormatter';
import { AnalyticsFormatter as ExportedFormatter } from '../src/index';

const testRoomFixture = JSON.parse(
  readFileSync(
    join(process.cwd(), 'tests/fixtures/analytics_test_room.json'),
    'utf-8',
  ),
) as RawAnalyticsData;

const sampleFixture = JSON.parse(
  readFileSync(
    join(process.cwd(), 'tests/fixtures/analytics_sample.json'),
    'utf-8',
  ),
) as RawAnalyticsData;

const DEFAULT_ROOM: Record<string, unknown> = {
  room_id: 'test',
  room_creation: '1000',
  room_ended: '3000',
  room_duration: '2000',
};

const format = (data: RawAnalyticsData, timezone = 'UTC') =>
  new AnalyticsFormatter(data, timezone).getFormattedEventData();

const withEvents = (
  events: unknown[],
  room: Record<string, unknown> = DEFAULT_ROOM,
): RawAnalyticsData => ({
  room,
  users: [
    {
      user_id: '1',
      name: 'Test',
      is_admin: false,
      ex_user_id: '1',
      events,
    },
  ],
});

const userOf = (data: RawAnalyticsData) => format(data).users[0];

const pollVote = (option: number) =>
  JSON.stringify({ poll_id: 'p1', selected_options: option });

const emptyFormatter = () => new AnalyticsFormatter({ room: {}, users: [] });

describe('fixture analytics_test_room.json', () => {
  const result = format(testRoomFixture);

  it('formats room fields without the raw events', () => {
    expect(result.room).toMatchObject({
      room_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      room_title: 'Test Room',
      room_total_users: '6',
      room_creation: '01-01-1970 00:16:40 +00:00',
      room_ended: '01-01-1970 01:06:40 +00:00',
      enabled_e2ee: false,
    });
    expect(result.room).not.toHaveProperty('events');
  });

  it('formats the user summary without duplicate joins inflating duration', () => {
    const user = result.users[0];

    expect(user).toMatchObject({
      user_id: '111',
      name: 'Test User',
      is_admin: false,
      duration: 1700,
      mic_status: 1,
      mic_muted: 0,
      mic_duration: 400,
      webcam_status: 0,
      webcam_duration: 0,
      talked_duration: 83,
      joined: [1500000, 2500000, 2500002, 2542000, 3000000, 3100000],
      left: [2200000, 2499998, 3500000, 3800000],
    });
    expect(user).not.toHaveProperty('events');
  });
});

describe('fixture analytics_sample.json', () => {
  // Anonymized export of a real session. The room ran for 3396 seconds
  // (room_creation 1792760259 -> room_ended 1792763655), which is also the
  // duration clamp limit; every user duration below stays under it.
  const result = format(sampleFixture);
  const userNamed = (name: string) =>
    result.users.find((user) => user.name === name);

  it('formats room fields without the raw events', () => {
    expect(result.room).toMatchObject({
      room_id: '11111111-2222-3333-4444-555555555555',
      room_title: 'Sample Classroom',
      room_total_users: '2',
      room_duration: '3396',
      room_creation: '23-10-2026 12:57:39 +00:00',
      room_ended: '23-10-2026 13:54:15 +00:00',
      enabled_e2ee: false,
    });
    expect(result.users).toHaveLength(2);
    expect(result.room).not.toHaveProperty('events');
  });

  it('formats User One', () => {
    // Raw timestamps in ms, all values taken from the fixture:
    //   joined 1792760384117, left 1792763652973
    //   mic    STARTED 1792760392693, ENDED 1792763652995
    //   webcam STARTED 1792760402796, ENDED 1792763653016
    // duration        = ceil((1792763652973 - 1792760384117) / 1000) = 3269
    // mic_duration    = ceil((1792763652995 - 1792760392693) / 1000) = 3261
    // webcam_duration = ceil((1792763653016 - 1792760402796) / 1000) = 3251
    // talked_duration = ceil(585411 / 1000) = 586
    const user = userNamed('User One');

    expect(user).toMatchObject({
      user_id: '22222222-3333-4444-5555-666666666666',
      name: 'User One',
      ex_user_id: 'sample-ex-user-1',
      is_admin: false,
      duration: 3269,
      mic_status: 1,
      mic_muted: 0,
      mic_duration: 3261,
      webcam_status: 1,
      webcam_duration: 3251,
      talked: 557,
      talked_duration: 586,
      joined: [1792760384117],
      left: [1792763652973],
      connection_quality: { excellent: 1, good: 0, poor: 0 },
    });
    expect(user).not.toHaveProperty('public_chat');
  });

  it('formats User Two', () => {
    // Raw timestamps in ms, all values taken from the fixture:
    //   joined 1792760345497, left 1792763654951
    //   mic    STARTED 1792760358829, ENDED 1792763654989
    //   webcam STARTED 1792760368243, ENDED 1792763654991
    // duration        = ceil((1792763654951 - 1792760345497) / 1000) = 3310
    // mic_duration    = ceil((1792763654989 - 1792760358829) / 1000) = 3297
    // webcam_duration = ceil((1792763654991 - 1792760368243) / 1000) = 3287
    // talked_duration = ceil(1010894 / 1000) = 1011
    // interface_invisible = 4 hidden values out of 9 visibility events
    // connection_quality  = 15 excellent + 11 good + 5 poor events
    const user = userNamed('User Two');

    expect(user).toMatchObject({
      user_id: '33333333-4444-5555-6666-777777777777',
      name: 'User Two',
      ex_user_id: 'sample-ex-user-2',
      is_admin: true,
      duration: 3310,
      mic_status: 1,
      mic_muted: 1,
      mic_duration: 3297,
      webcam_status: 1,
      webcam_duration: 3287,
      talked: 730,
      talked_duration: 1011,
      interface_invisible: 4,
      public_chat: 53,
      joined: [1792760345497],
      left: [1792763654951],
      connection_quality: { excellent: 15, good: 11, poor: 5 },
    });
  });
});

describe('user join duration', () => {
  it('is zero when there are no joins', () => {
    const data = withEvents([], {
      room_id: 'test',
      room_creation: '1000',
      room_ended: '2000',
      room_duration: '1000',
    });

    expect(userOf(data).duration).toBe(0);
  });

  it('sums a single session', () => {
    const data = withEvents([
      { name: 'joined', total: 1, values: [{ time: '1500000' }] },
      { name: 'left', total: 1, values: [{ time: '2500000' }] },
    ]);

    expect(userOf(data).duration).toBe(1000);
  });

  it('extends an unfinished session to the room end', () => {
    const data = withEvents([
      { name: 'joined', total: 1, values: [{ time: '1500000' }] },
    ]);

    expect(userOf(data).duration).toBe(1500);
  });

  it('ignores leaves without a matching join', () => {
    const data = withEvents([
      { name: 'left', total: 1, values: [{ time: '2000000' }] },
      { name: 'joined', total: 1, values: [{ time: '2500000' }] },
    ]);

    expect(userOf(data).duration).toBe(500);
  });

  it('sums multiple sessions', () => {
    const data = withEvents(
      [
        {
          name: 'joined',
          total: 2,
          values: [{ time: '1500000' }, { time: '3500000' }],
        },
        {
          name: 'left',
          total: 2,
          values: [{ time: '2500000' }, { time: '4500000' }],
        },
      ],
      {
        room_id: 'test',
        room_creation: '1000',
        room_ended: '5000',
        room_duration: '4000',
      },
    );

    expect(userOf(data).duration).toBe(2000);
  });

  it('is capped at room_duration', () => {
    const data = withEvents(
      [{ name: 'joined', total: 1, values: [{ time: '1100000' }] }],
      {
        room_id: 'test',
        room_creation: '1000',
        room_ended: '3000',
        room_duration: '500',
      },
    );

    expect(userOf(data).duration).toBe(500);
  });

  it('keeps the raw duration when room metadata is missing', () => {
    const data = withEvents(
      [
        { name: 'joined', total: 1, values: [{ time: '1500000' }] },
        { name: 'left', total: 1, values: [{ time: '2500000' }] },
      ],
      { room_id: 'test', room_creation: '1000' },
    );

    expect(userOf(data).duration).toBe(1000);
  });

  it('ignores events outside the room bounds', () => {
    const data = withEvents(
      [
        { name: 'joined', total: 1, values: [{ time: '500000' }] },
        { name: 'left', total: 1, values: [{ time: '3000000' }] },
      ],
      {
        room_id: 'test',
        room_creation: '2000',
        room_ended: '5000',
        room_duration: '3000',
      },
    );

    expect(userOf(data).duration).toBe(0);
  });
});

describe('device duration', () => {
  it('measures a complete start/end pair', () => {
    const data = withEvents([
      {
        name: 'mic_status',
        total: 2,
        values: [
          { time: '1500000', value: 'ANALYTICS_STATUS_STARTED' },
          { time: '2500000', value: 'ANALYTICS_STATUS_ENDED' },
        ],
      },
    ]);

    expect(userOf(data).mic_duration).toBe(1000);
  });

  it('closes at the user leave', () => {
    const data = withEvents([
      { name: 'joined', total: 1, values: [{ time: '1400000' }] },
      { name: 'left', total: 1, values: [{ time: '2000000' }] },
      {
        name: 'mic_status',
        total: 2,
        values: [
          { time: '1500000', value: 'ANALYTICS_STATUS_STARTED' },
          { time: '4000000', value: 'ANALYTICS_STATUS_ENDED' },
        ],
      },
    ]);

    expect(userOf(data).mic_duration).toBe(500);
  });

  it('extends a start without an end to the room end', () => {
    // DEFAULT_ROOM closes at 3000s, so the unfinished session runs
    // 1500000ms -> 3000000ms = 1500 seconds.
    const data = withEvents([
      {
        name: 'mic_status',
        total: 1,
        values: [{ time: '1500000', value: 'ANALYTICS_STATUS_STARTED' }],
      },
    ]);

    expect(userOf(data).mic_duration).toBe(1500);
  });

  it('ignores an end without a preceding start', () => {
    const data = withEvents([
      {
        name: 'mic_status',
        total: 1,
        values: [{ time: '2000000', value: 'ANALYTICS_STATUS_ENDED' }],
      },
    ]);

    expect(userOf(data).mic_duration).toBe(0);
  });

  it('recognises prefixed start values', () => {
    const data = withEvents([
      {
        name: 'webcam_status',
        total: 2,
        values: [
          { time: '1500000', value: 'ANALYTICS_STATUS_STARTED:node_01' },
          { time: '2500000', value: 'ANALYTICS_STATUS_ENDED' },
        ],
      },
    ]);

    expect(userOf(data).webcam_duration).toBe(1000);
  });

  it('ignores duplicate start events', () => {
    const data = withEvents([
      {
        name: 'mic_status',
        total: 3,
        values: [
          { time: '1500000', value: 'ANALYTICS_STATUS_STARTED' },
          { time: '2000000', value: 'ANALYTICS_STATUS_STARTED' },
          { time: '2500000', value: 'ANALYTICS_STATUS_ENDED' },
        ],
      },
    ]);

    expect(userOf(data).mic_duration).toBe(1000);
  });

  it('counts statuses by substring but durations by prefix', () => {
    const embedded = userOf(
      withEvents([
        {
          name: 'mic_status',
          total: 2,
          values: [
            { time: '1500000', value: 'xANALYTICS_STATUS_STARTED' },
            { time: '2500000', value: 'ANALYTICS_STATUS_ENDED' },
          ],
        },
      ]),
    );
    const prefixed = userOf(
      withEvents([
        {
          name: 'mic_status',
          total: 2,
          values: [
            { time: '1500000', value: 'ANALYTICS_STATUS_STARTED:node_01' },
            { time: '2500000', value: 'ANALYTICS_STATUS_ENDED' },
          ],
        },
      ]),
    );

    expect(embedded.mic_status).toBe(1);
    expect(embedded.mic_duration).toBe(0);
    expect(prefixed.mic_status).toBe(1);
    expect(prefixed.mic_duration).toBe(1000);
  });

  it('converts and clamps talked_duration milliseconds', () => {
    const data = withEvents(
      [{ name: 'talked_duration', total: '50000', values: [] }],
      { room_id: 'test', room_duration: '10' },
    );

    expect(userOf(data).talked_duration).toBe(10);
  });
});

describe('user event summaries', () => {
  it('counts hidden interface states', () => {
    const data = withEvents([
      {
        name: 'interface_visibility',
        total: 3,
        values: [
          { time: '1500000', value: 'hidden' },
          { time: '1600000', value: 'visible' },
          { time: '1700000', value: 'hidden' },
        ],
      },
    ]);

    expect(userOf(data).interface_invisible).toBe(2);
  });

  it('groups connection quality values', () => {
    const data = withEvents([
      {
        name: 'connection_quality',
        total: 5,
        values: [
          { time: '1500000', value: 'excellent' },
          { time: '1600000', value: 'good' },
          { time: '1700000', value: 'good' },
          { time: '1800000', value: 'poor' },
          { time: '1900000', value: 'EXCELLENT' },
        ],
      },
    ]);

    expect(userOf(data).connection_quality).toEqual({
      excellent: 2,
      good: 2,
      poor: 1,
    });
  });
});

describe('room event summaries', () => {
  it('counts status starts and event totals', () => {
    const data: RawAnalyticsData = {
      room: {
        room_id: 'test',
        events: [
          {
            name: 'recording_status',
            values: [
              { time: '1000', value: 'ANALYTICS_STATUS_STARTED' },
              { time: '2000', value: 'ANALYTICS_STATUS_STARTED' },
              { time: '3000', value: 'ANALYTICS_STATUS_ENDED' },
            ],
          },
          { name: 'ingress_created', total: '3', values: [] },
          { name: 'breakout_room', total: 2, values: [] },
        ],
      },
      users: [],
    };

    expect(format(data).room).toMatchObject({
      recording_status: 2,
      ingress_created: 3,
      breakout_room: 2,
    });
  });
});

describe('polls', () => {
  const poll = JSON.stringify({
    poll_id: 'p1',
    question: 'Q?',
    options: [
      { id: 1, text: 'A' },
      { id: 2, text: 'B' },
    ],
  });
  const data: RawAnalyticsData = {
    room: {
      room_id: 'test',
      events: [
        { name: 'poll_added', values: [{ time: '1500000', value: poll }] },
      ],
    },
    users: [
      {
        user_id: '1',
        name: 'Test',
        is_admin: false,
        ex_user_id: '1',
        events: [
          {
            name: 'voted_poll',
            total: 4,
            values: [
              { time: '1600000', value: pollVote(1) },
              { time: '1700000', value: pollVote(1) },
              { time: '1800000', value: pollVote(2) },
              {
                time: '1900000',
                value: JSON.stringify({
                  poll_id: 'unknown',
                  selected_options: 1,
                }),
              },
            ],
          },
        ],
      },
    ],
  };

  it('formats poll metadata with zeroed responses', () => {
    expect(format(data).room).toMatchObject({
      polls: {
        p1: {
          created: '01-01-1970 00:25:00 +00:00',
          question: 'Q?',
        },
      },
    });
  });

  it('counts votes and increments the matching options', () => {
    const result = format(data);

    expect(result.room).toMatchObject({
      polls: {
        p1: {
          options: {
            '1': { text: 'A', responses: 2 },
            '2': { text: 'B', responses: 1 },
          },
        },
      },
    });
    expect(result.users[0].voted_poll).toBe(4);
  });
});

describe('formatTimestamp', () => {
  it('formats millisecond input in UTC', () => {
    expect(emptyFormatter().formatTimestamp('1779058704000', true)).toBe(
      '17-05-2026 22:58:24 +00:00',
    );
  });

  it('honours the user timezone', () => {
    const formatter = new AnalyticsFormatter(
      { room: {}, users: [] },
      'Asia/Dhaka',
    );

    expect(formatter.formatTimestamp('1779058704000', true)).toBe(
      '18-05-2026 04:58:24 +06:00',
    );
  });

  it('formats a minute-offset timezone', () => {
    const formatter = new AnalyticsFormatter(
      { room: {}, users: [] },
      'Asia/Kathmandu',
    );

    expect(formatter.formatTimestamp('1779058704000', true)).toBe(
      '18-05-2026 04:43:24 +05:45',
    );
  });

  it('formats second input', () => {
    expect(emptyFormatter().formatTimestamp('1779058704', false)).toBe(
      '17-05-2026 22:58:24 +00:00',
    );
  });

  it('treats second-sized input as milliseconds by default', () => {
    expect(emptyFormatter().formatTimestamp('1779058704', true)).toBe(
      '21-01-1970 14:10:58 +00:00',
    );
  });

  it('returns an empty string for non-numeric input', () => {
    const formatter = emptyFormatter();

    expect(formatter.formatTimestamp('not-a-number')).toBe('');
    expect(formatter.formatTimestamp(null)).toBe('');
    expect(formatter.formatTimestamp(undefined)).toBe('');
    expect(formatter.formatTimestamp(Number.NaN)).toBe('');
  });

  it('falls back to UTC for an invalid timezone', () => {
    const formatter = new AnalyticsFormatter(
      { room: {}, users: [] },
      'Invalid/Timezone',
    );

    expect(formatter.formatTimestamp('1779058704000', true)).toContain(
      '+00:00',
    );
  });
});

describe('formatSecondsToTime', () => {
  const formatter = emptyFormatter();

  it('formats seconds as HH:MM:SS', () => {
    expect(formatter.formatSecondsToTime(0)).toBe('00:00:00');
    expect(formatter.formatSecondsToTime(90)).toBe('00:01:30');
    expect(formatter.formatSecondsToTime(7546)).toBe('02:05:46');
  });

  it('never returns negative time', () => {
    expect(formatter.formatSecondsToTime(-100)).toBe('00:00:00');
  });
});

describe('field lists', () => {
  it('exposes the 14 room fields', () => {
    const fields = emptyFormatter().getRoomFields();

    expect(fields).toHaveLength(14);
    expect(fields).toContain('room_duration');
    expect(fields).toContain('room_creation');
    expect(fields).toContain('room_ended');
  });

  it('exposes the 23 user fields', () => {
    const fields = emptyFormatter().getUserFields();

    expect(fields).toHaveLength(23);
    expect(fields).toContain('duration');
    expect(fields).toContain('talked_duration');
    expect(fields).toContain('mic_duration');
    expect(fields).toContain('webcam_duration');
    expect(fields).toContain('joined');
    expect(fields).toContain('left');
  });
});

describe('edge cases', () => {
  it('formats empty input without crashing', () => {
    expect(format({ room: {}, users: [] })).toEqual({ room: {}, users: [] });
  });

  it('returns the raw data unchanged', () => {
    const data: RawAnalyticsData = { room: { room_id: 'x' }, users: [] };

    expect(new AnalyticsFormatter(data).getRawAnalyticsData()).toBe(data);
  });

  it('is exported from the package entry point', () => {
    expect(typeof ExportedFormatter).toBe('function');
  });
});
