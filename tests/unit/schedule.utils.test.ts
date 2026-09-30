import { describe, expect, it } from 'vitest';
import { formatTime } from '../../src/app/modules/schedule/schedule.utils';

describe('formatTime', () => {
  it('formats hours and minutes with two digits', () => {
    const time = new Date(2026, 9, 5, 9, 5);

    expect(formatTime(time)).toBe('09:05');
  });
});
