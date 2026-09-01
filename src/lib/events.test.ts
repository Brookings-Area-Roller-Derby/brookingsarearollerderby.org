import { describe, expect, it } from 'vitest';
import { findNextEntry, formatEventDate, partitionByDate, sortByDate } from './events';

const entry = (date: string, id: string) => ({
  id,
  data: { date: new Date(date) },
});

describe('event date utilities', () => {
  it('sorts entries without mutating the input', () => {
    const later = entry('2026-08-01T12:00:00-05:00', 'later');
    const earlier = entry('2026-05-01T12:00:00-05:00', 'earlier');
    const input = [later, earlier];

    expect(sortByDate(input).map(({ id }) => id)).toEqual(['earlier', 'later']);
    expect(input.map(({ id }) => id)).toEqual(['later', 'earlier']);
  });

  it('treats an event exactly at the boundary as past', () => {
    const now = new Date('2026-06-01T12:00:00-05:00');
    const exact = entry(now.toISOString(), 'exact');
    const future = entry('2026-06-01T12:00:01-05:00', 'future');

    const result = partitionByDate([future, exact], now);

    expect(result.past.map(({ id }) => id)).toEqual(['exact']);
    expect(result.upcoming.map(({ id }) => id)).toEqual(['future']);
  });

  it('returns past entries newest-first and upcoming entries soonest-first', () => {
    const now = new Date('2026-06-01T12:00:00-05:00');
    const entries = [
      entry('2026-07-01T12:00:00-05:00', 'next'),
      entry('2026-05-01T12:00:00-05:00', 'oldest'),
      entry('2026-08-01T12:00:00-05:00', 'last'),
      entry('2026-05-15T12:00:00-05:00', 'recent'),
    ];

    const result = partitionByDate(entries, now);

    expect(result.upcoming.map(({ id }) => id)).toEqual(['next', 'last']);
    expect(result.past.map(({ id }) => id)).toEqual(['recent', 'oldest']);
    expect(findNextEntry(entries, now)?.id).toBe('next');
  });

  it('handles empty and fully expired schedules', () => {
    const now = new Date('2026-09-01T12:00:00-05:00');
    const expired = [entry('2026-05-01T12:00:00-05:00', 'expired')];

    expect(partitionByDate([], now)).toEqual({ upcoming: [], past: [] });
    expect(findNextEntry(expired, now)).toBeUndefined();
  });

  it('formats dates in the configured Central timezone', () => {
    expect(formatEventDate('2026-01-15T03:00:00.000Z')).toBe('January 14, 2026');
  });
});
