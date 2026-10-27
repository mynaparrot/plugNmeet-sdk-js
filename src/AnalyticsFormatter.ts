import {
  createFormatter,
  isNumeric,
  isRecord,
  isSet,
  parseJsonRecord,
  toFloat,
  toInt,
} from './utils';

export type AnalyticsEventValue = { time?: unknown; value?: unknown };
export type AnalyticsEvent = {
  name?: unknown;
  total?: unknown;
  values?: unknown;
};

export interface RawAnalyticsData {
  room?: Record<string, unknown>;
  users?: unknown[];
}

export type FormattedAnalyticsData = {
  room: Record<string, unknown>;
  users: Record<string, unknown>[];
};

type PollOption = { text: unknown; responses: number };
type PollEntry = {
  created: string;
  question: unknown;
  options: Record<string, PollOption>;
};
type PollsMap = Record<string, PollEntry>;

const ROOM_FIELDS: string[] = [
  'room_id',
  'room_title',
  'room_creation',
  'room_ended',
  'room_duration',
  'room_total_users',
  'enabled_e2ee',
  'recording_status',
  'rtmp_status',
  'shared_notepad_status',
  'ingress_created',
  'breakout_room',
  'external_display_link_status',
  'external_media_player_status',
];

const USER_FIELDS: string[] = [
  'name',
  'ex_user_id',
  'is_admin',
  'duration',
  'joined',
  'left',
  'mic_status',
  'mic_muted',
  'mic_duration',
  'talked',
  'talked_duration',
  'webcam_status',
  'webcam_duration',
  'raise_hand',
  'voted_poll',
  'whiteboard_annotated',
  'whiteboard_files',
  'screen_share_status',
  'public_chat',
  'private_chat',
  'chat_files',
  'interface_invisible',
  'connection_quality',
];

export class AnalyticsFormatter {
  private rawData: RawAnalyticsData;
  private roomData: Record<string, unknown> = {};
  private usersData: Record<string, unknown>[] = [];
  private dateFormatter: Intl.DateTimeFormat;
  private roomFields: string[] = [...ROOM_FIELDS];

  constructor(rawData: RawAnalyticsData, userTimezone = 'UTC') {
    this.rawData = rawData;
    this.dateFormatter = createFormatter(userTimezone);

    this.formatRoomData();
    this.formatUsersData();
  }

  getFormattedEventData(): FormattedAnalyticsData {
    return { room: this.roomData, users: this.usersData };
  }

  getRawAnalyticsData(): RawAnalyticsData {
    return this.rawData;
  }

  getUserFields(): string[] {
    return [...USER_FIELDS];
  }

  getRoomFields(): string[] {
    return [...this.roomFields];
  }

  formatTimestamp(timestamp: unknown, ms = true): string {
    if (!isNumeric(timestamp)) {
      return '';
    }

    const value = ms
      ? Math.floor(toFloat(timestamp) / 1000)
      : Math.floor(toFloat(timestamp));

    return this.formatEpochSeconds(value);
  }

  formatSecondsToTime(seconds: unknown): string {
    const total = Math.max(0, Math.round(toFloat(seconds)));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);

    return [hours, minutes, total % 60]
      .map((part) => String(part).padStart(2, '0'))
      .join(':');
  }

  private formatEpochSeconds(seconds: number): string {
    const parts = this.dateFormatter.formatToParts(new Date(seconds * 1000));
    const part = (type: string): string =>
      parts.find((entry) => entry.type === type)?.value ?? '';

    const date = [part('day'), part('month'), part('year')].join('-');
    const time = [part('hour'), part('minute'), part('second')].join(':');
    const rawOffset = part('timeZoneName').replace(/^GMT/, '');
    const offset = rawOffset === '' ? '+00:00' : rawOffset;

    return `${date} ${time} ${offset}`;
  }

  private formatRoomData(): void {
    const room = this.rawData.room ?? {};

    for (const [key, value] of Object.entries(room)) {
      if (key === 'events') {
        continue;
      }

      const isTimestampKey = key === 'room_creation' || key === 'room_ended';
      this.roomData[key] =
        isTimestampKey && isNumeric(value)
          ? this.formatTimestamp(value, false)
          : value;
    }

    const events = room.events;
    if (Array.isArray(events)) {
      this.formatRoomEvents(events);
    }
  }

  private formatRoomEvents(events: unknown[]): void {
    for (const event of events) {
      if (!isRecord(event)) {
        continue;
      }

      const name = event.name;
      const values = Array.isArray(event.values) ? event.values : [];

      if (typeof name !== 'string') {
        continue;
      }

      switch (name) {
        case 'recording_status':
        case 'rtmp_status':
        case 'external_media_player_status':
        case 'external_display_link_status':
        case 'shared_notepad_status':
          this.roomData[name] = this.countStatusStartTypeEvent(values);
          break;

        case 'ingress_created':
        case 'breakout_room':
          this.roomData[name] = Math.max(0, toInt(event.total ?? 0));
          break;

        case 'whiteboard_files':
          this.roomData[name] = values;
          break;

        case 'poll_added':
          this.roomData.polls = this.formatRoomPolls(values);
          break;
      }
    }
  }

  private formatUsersData(): void {
    const users = Array.isArray(this.rawData.users) ? this.rawData.users : [];

    for (const user of users) {
      if (!isRecord(user)) {
        continue;
      }

      const formattedUser: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(user)) {
        if (key !== 'events') {
          formattedUser[key] = value;
        }
      }

      const events = Array.isArray(user.events) ? user.events : [];

      this.formatUserEvents(formattedUser, events);
      this.formatUserJoinDuration(formattedUser);
      this.capDurationsAtRoomDuration(formattedUser);
      this.usersData.push(formattedUser);
    }
  }

  private formatUserEvents(
    user: Record<string, unknown>,
    events: unknown[],
  ): void {
    // First pass: collect attendance timestamps.
    for (const event of events) {
      if (!isRecord(event)) {
        continue;
      }

      const name = event.name;
      if (name !== 'joined' && name !== 'left') {
        continue;
      }

      const values = Array.isArray(event.values) ? event.values : [];
      const timestamps: number[] = [];

      for (const value of values) {
        if (!isRecord(value)) {
          continue;
        }

        const timestamp = value.value ?? value.time;
        if (isNumeric(timestamp)) {
          timestamps.push(toInt(timestamp));
        }
      }

      timestamps.sort((a, b) => a - b);
      user[name] = timestamps;
    }

    // Second pass: process all other events.
    const leaveEvents = Array.isArray(user.left) ? user.left : [];

    for (const event of events) {
      if (!isRecord(event)) {
        continue;
      }

      const name = event.name;
      const values = Array.isArray(event.values) ? event.values : [];

      if (typeof name !== 'string') {
        continue;
      }

      switch (name) {
        case 'joined':
        case 'left':
          break;

        case 'mic_status':
          user.mic_status = this.countStatusStartTypeEvent(values);
          user.mic_muted = this.countStatusStartTypeEvent(
            values,
            'ANALYTICS_STATUS_MUTED',
          );
          user.mic_duration = this.getDurationFromEvents(
            values,
            'ANALYTICS_STATUS_STARTED',
            'ANALYTICS_STATUS_ENDED',
            leaveEvents,
          );
          break;

        case 'webcam_status':
          user.webcam_status = this.countStatusStartTypeEvent(values);
          user.webcam_duration = this.getDurationFromEvents(
            values,
            'ANALYTICS_STATUS_STARTED',
            'ANALYTICS_STATUS_ENDED',
            leaveEvents,
          );
          break;

        case 'screen_share_status':
          user.screen_share_status = this.countStatusStartTypeEvent(values);
          break;

        case 'whiteboard_files':
        case 'whiteboard_annotated':
        case 'raise_hand':
        case 'chat_files':
        case 'private_chat':
        case 'public_chat':
        case 'talked':
          user[name] = Math.max(0, toInt(event.total ?? 0));
          break;

        case 'talked_duration':
          user.talked_duration = this.clampDuration(
            Math.ceil(Math.max(0, toFloat(event.total ?? 0)) / 1000),
          );
          break;

        case 'interface_visibility':
          user.interface_invisible = this.countStatusStartTypeEvent(
            values,
            'hidden',
          );
          break;

        case 'connection_quality':
          user.connection_quality = {
            excellent: this.countStatusStartTypeEvent(values, 'excellent'),
            good: this.countStatusStartTypeEvent(values, 'good'),
            poor: this.countStatusStartTypeEvent(values, 'poor'),
          };
          break;

        case 'voted_poll':
          user.voted_poll = this.formatUserPollVoted(values);
          break;
      }
    }
  }

  // Substring matching is deliberate here while getDurationFromEvents matches
  // prefixes: the original server analytics pipeline behaves this way, and
  // callers depend on both counts and durations coming out the same.
  private countStatusStartTypeEvent(
    data: unknown[],
    type = 'ANALYTICS_STATUS_STARTED',
  ): number {
    const needle = type.toLowerCase();
    let total = 0;

    for (const value of data) {
      if (!isRecord(value)) {
        continue;
      }

      const eventValue = value.value;
      if (
        typeof eventValue === 'string' &&
        eventValue.toLowerCase().includes(needle)
      ) {
        total++;
      }
    }

    return total;
  }

  private formatRoomPolls(data: unknown[]): PollsMap {
    const polls: PollsMap = {};

    for (const value of data) {
      if (
        !isRecord(value) ||
        typeof value.value !== 'string' ||
        value.value === ''
      ) {
        continue;
      }

      const pollData = parseJsonRecord(value.value);
      if (!pollData || !pollData.poll_id) {
        continue;
      }

      const poll: PollEntry = {
        created: isNumeric(value.time) ? this.formatTimestamp(value.time) : '',
        question: pollData.question ?? '',
        options: {},
      };

      const options = Array.isArray(pollData.options) ? pollData.options : [];
      for (const option of options) {
        if (!isRecord(option) || !isSet(option, 'id')) {
          continue;
        }

        poll.options[String(option.id)] = {
          text: option.text ?? '',
          responses: 0,
        };
      }

      polls[String(pollData.poll_id)] = poll;
    }

    return polls;
  }

  private formatUserPollVoted(values: unknown[]): number {
    let total = 0;

    for (const value of values) {
      if (
        !isRecord(value) ||
        typeof value.value !== 'string' ||
        value.value === ''
      ) {
        continue;
      }

      const vote = parseJsonRecord(value.value);
      if (
        !vote ||
        !isSet(vote, 'poll_id') ||
        !isSet(vote, 'selected_options')
      ) {
        continue;
      }

      total++;
      this.incrementPollOptionResponses(
        String(vote.poll_id),
        String(vote.selected_options),
      );
    }

    return total;
  }

  private incrementPollOptionResponses(pollId: string, optionId: string): void {
    const polls = this.roomData.polls;
    if (!isRecord(polls)) {
      return;
    }

    const poll = polls[pollId];
    if (!isRecord(poll)) {
      return;
    }

    const options = poll.options;
    if (!isRecord(options)) {
      return;
    }

    const option = options[optionId];
    if (!isRecord(option) || !isSet(option, 'responses')) {
      return;
    }

    option.responses = toInt(option.responses) + 1;
  }

  private formatUserJoinDuration(user: Record<string, unknown>): void {
    const timeline: { time: number; type: 'join' | 'left' }[] = [];

    for (const time of Array.isArray(user.joined) ? user.joined : []) {
      if (isNumeric(time)) {
        timeline.push({ time: toInt(time), type: 'join' });
      }
    }

    for (const time of Array.isArray(user.left) ? user.left : []) {
      if (isNumeric(time)) {
        timeline.push({ time: toInt(time), type: 'left' });
      }
    }

    const priority: Record<string, number> = { left: 0, join: 1 };
    timeline.sort(
      (a, b) => a.time - b.time || priority[a.type] - priority[b.type],
    );

    const roomStartMs = this.getRoomStartMilliseconds();
    const roomEndMs = this.getRoomEndMilliseconds();
    let activeSince: number | null = null;
    let totalMilliseconds = 0;

    for (const event of timeline) {
      if (roomStartMs !== null && event.time < roomStartMs) {
        continue;
      }
      if (roomEndMs !== null && event.time > roomEndMs) {
        continue;
      }

      if (event.type === 'join') {
        if (activeSince === null) {
          activeSince = event.time;
        }
        continue;
      }

      if (activeSince === null) {
        continue;
      }

      if (event.time > activeSince) {
        totalMilliseconds += event.time - activeSince;
      }
      activeSince = null;
    }

    if (activeSince !== null && roomEndMs !== null && roomEndMs > activeSince) {
      totalMilliseconds += roomEndMs - activeSince;
    }

    user.duration = this.clampDuration(Math.ceil(totalMilliseconds / 1000));
  }

  private capDurationsAtRoomDuration(user: Record<string, unknown>): void {
    const fields = [
      'duration',
      'talked_duration',
      'mic_duration',
      'webcam_duration',
    ];

    for (const field of fields) {
      if (isSet(user, field) && isNumeric(user[field])) {
        user[field] = this.clampDuration(user[field]);
      }
    }
  }

  private getRoomStartMilliseconds(): number | null {
    const timestamp = this.rawData.room?.room_creation;
    const seconds = isNumeric(timestamp) ? toInt(timestamp) : 0;

    return seconds > 0 ? seconds * 1000 : null;
  }

  private getRoomEndMilliseconds(): number | null {
    const timestamp = this.rawData.room?.room_ended;
    const seconds = isNumeric(timestamp) ? toInt(timestamp) : 0;

    return seconds > 0 ? seconds * 1000 : null;
  }

  private getRoomDurationLimit(): number {
    const limits: number[] = [];
    const roomDuration = this.rawData.room?.room_duration;

    if (isNumeric(roomDuration) && toInt(roomDuration) > 0) {
      limits.push(toInt(roomDuration));
    }

    const roomStartMs = this.getRoomStartMilliseconds();
    const roomEndMs = this.getRoomEndMilliseconds();

    if (roomStartMs !== null && roomEndMs !== null && roomEndMs > roomStartMs) {
      const timestampDuration = Math.floor((roomEndMs - roomStartMs) / 1000);
      if (timestampDuration > 0) {
        limits.push(timestampDuration);
      }
    }

    return limits.length === 0 ? 0 : Math.min(...limits);
  }

  private clampDuration(duration: unknown): number {
    const value = Math.max(0, toInt(duration));
    const limit = this.getRoomDurationLimit();

    return limit > 0 ? Math.min(value, limit) : value;
  }

  private getDurationFromEvents(
    events: unknown[],
    startStatus = 'ANALYTICS_STATUS_STARTED',
    endStatus = 'ANALYTICS_STATUS_ENDED',
    leaveEvents: unknown[] = [],
  ): number {
    const timeline: { time: number; type: 'start' | 'end' | 'leave' }[] = [];
    const start = startStatus.toLowerCase();
    const end = endStatus.toLowerCase();

    for (const event of events) {
      if (
        !isRecord(event) ||
        !isSet(event, 'time') ||
        !isSet(event, 'value') ||
        !isNumeric(event.time)
      ) {
        continue;
      }

      const value = String(event.value).toLowerCase();
      if (value.startsWith(start)) {
        timeline.push({ time: toInt(event.time), type: 'start' });
      } else if (value.startsWith(end)) {
        timeline.push({ time: toInt(event.time), type: 'end' });
      }
    }

    for (const time of leaveEvents) {
      if (isNumeric(time)) {
        timeline.push({ time: toInt(time), type: 'leave' });
      }
    }

    const priority: Record<string, number> = { end: 0, leave: 0, start: 1 };
    timeline.sort(
      (a, b) => a.time - b.time || priority[a.type] - priority[b.type],
    );

    const roomStartMs = this.getRoomStartMilliseconds();
    const roomEndMs = this.getRoomEndMilliseconds();
    let pendingStart: number | null = null;
    let totalMilliseconds = 0;

    for (const event of timeline) {
      if (roomStartMs !== null && event.time < roomStartMs) {
        continue;
      }
      if (roomEndMs !== null && event.time > roomEndMs) {
        continue;
      }

      if (event.type === 'start') {
        if (pendingStart === null) {
          pendingStart = event.time;
        }
        continue;
      }

      if (pendingStart === null) {
        continue;
      }

      if (event.time > pendingStart) {
        totalMilliseconds += event.time - pendingStart;
      }
      pendingStart = null;
    }

    if (
      pendingStart !== null &&
      roomEndMs !== null &&
      roomEndMs > pendingStart
    ) {
      totalMilliseconds += roomEndMs - pendingStart;
    }

    return this.clampDuration(Math.ceil(totalMilliseconds / 1000));
  }
}
