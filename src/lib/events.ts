import { siteConfig } from '../config/site';

export interface DatedEntry {
  data: {
    date: Date;
  };
}

export interface DatedPartition<T> {
  upcoming: T[];
  past: T[];
}

export function sortByDate<T extends DatedEntry>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
}

export function partitionByDate<T extends DatedEntry>(
  entries: readonly T[],
  now: Date = new Date(),
): DatedPartition<T> {
  const sorted = sortByDate(entries);
  const boundary = now.getTime();

  return {
    upcoming: sorted.filter((entry) => entry.data.date.getTime() > boundary),
    past: sorted.filter((entry) => entry.data.date.getTime() <= boundary).reverse(),
  };
}

export function findNextEntry<T extends DatedEntry>(
  entries: readonly T[],
  now: Date = new Date(),
): T | undefined {
  return sortByDate(entries).find((entry) => entry.data.date.getTime() > now.getTime());
}

export function formatEventDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: siteConfig.timeZone,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(typeof date === 'string' ? new Date(date) : date);
}
