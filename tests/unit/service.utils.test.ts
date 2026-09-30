import { describe, expect, it } from 'vitest';
import { parseTimeToMintutes, validateSchedule } from '../../src/app/modules/service/service.utils';

describe('service schedule utilities', () => {
  it('converts a clock time to minutes', () => {
    expect(parseTimeToMintutes('09:30')).toBe(570);
  });

  it('accepts a schedule long enough for a session', () => {
    expect(validateSchedule('09:00', '10:00', 30)).toBe(true);
  });

  it('rejects a schedule shorter than the session duration', () => {
    expect(validateSchedule('09:00', '09:15', 30)).toBe(false);
  });
});
