const NUMERIC_PATTERN = /^\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\s*$/;
const LEADING_NUMERIC_PATTERN =
  /^\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/;

export function isNumeric(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }
  if (typeof value === 'string') {
    return NUMERIC_PATTERN.test(value);
  }
  return false;
}

export function toFloat(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (typeof value === 'string') {
    const match = LEADING_NUMERIC_PATTERN.exec(value);
    if (!match) {
      return 0;
    }
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function toInt(value: unknown): number {
  return Math.trunc(toFloat(value));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseJsonRecord(value: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(value);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function isSet(record: Record<string, unknown>, key: string): boolean {
  return record[key] !== undefined && record[key] !== null;
}

export function createFormatter(userTimezone: unknown): Intl.DateTimeFormat {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'longOffset',
  };

  if (typeof userTimezone === 'string' && userTimezone !== '') {
    try {
      return new Intl.DateTimeFormat('en-US', {
        ...options,
        timeZone: userTimezone,
      });
    } catch {
      // PHP throws on an invalid timezone; this port falls back to UTC instead.
    }
  }

  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' });
}
