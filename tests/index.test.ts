import { describe, expect, it } from 'vitest';

import { AnalyticsFormatter, createRequest, PlugNmeet } from '../src/index';

describe('public entry point', () => {
  it('exposes PlugNmeet and createRequest', () => {
    expect(typeof PlugNmeet).toBe('function');
    expect(typeof createRequest).toBe('function');
  });

  it('exposes AnalyticsFormatter', () => {
    expect(typeof AnalyticsFormatter).toBe('function');
  });
});
