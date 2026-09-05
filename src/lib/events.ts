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

export function parseCentralDateTime(
  dateInput: string | Date,
  timeInput?: string,
  timeZone: string = siteConfig.timeZone,
): Date {
  let year: number;
  let month: number;
  let day: number;

  if (dateInput instanceof Date) {
    year = dateInput.getUTCFullYear();
    month = dateInput.getUTCMonth() + 1;
    day = dateInput.getUTCDate();
  } else if (typeof dateInput === 'string') {
    const isoMatch = dateInput.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    const usMatch = dateInput.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (isoMatch) {
      year = parseInt(isoMatch[1], 10);
      month = parseInt(isoMatch[2], 10);
      day = parseInt(isoMatch[3], 10);
    } else if (usMatch) {
      month = parseInt(usMatch[1], 10);
      day = parseInt(usMatch[2], 10);
      year = parseInt(usMatch[3], 10);
    } else {
      const d = new Date(dateInput);
      year = d.getUTCFullYear();
      month = d.getUTCMonth() + 1;
      day = d.getUTCDate();
    }
  } else {
    return new Date();
  }

  let hours = 12;
  let minutes = 0;

  if (timeInput && typeof timeInput === 'string') {
    const match12 = timeInput.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    const match24 = timeInput.match(/(\d{1,2}):(\d{2})/);
    if (match12) {
      let h = parseInt(match12[1], 10);
      const m = parseInt(match12[2], 10);
      const ampm = match12[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      hours = h;
      minutes = m;
    } else if (match24) {
      hours = parseInt(match24[1], 10);
      minutes = parseInt(match24[2], 10);
    }
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const isoLike = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`;
  const approxUtc = new Date(`${isoLike}Z`);

  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = dtf.formatToParts(approxUtc);
  const partMap: Record<string, string> = {};
  for (const p of parts) partMap[p.type] = p.value;

  const inTzDate = new Date(
    Date.UTC(
      parseInt(partMap.year, 10),
      parseInt(partMap.month, 10) - 1,
      parseInt(partMap.day, 10),
      parseInt(partMap.hour === '24' ? '00' : partMap.hour, 10),
      parseInt(partMap.minute, 10),
      parseInt(partMap.second, 10),
    ),
  );

  const diff = approxUtc.getTime() - inTzDate.getTime();
  return new Date(approxUtc.getTime() + diff);
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

export function formatEventDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (options && Object.keys(options).length > 0) {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: siteConfig.timeZone,
      ...options,
    }).format(d);
  }
  return new Intl.DateTimeFormat('en-US', {
    timeZone: siteConfig.timeZone,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}
