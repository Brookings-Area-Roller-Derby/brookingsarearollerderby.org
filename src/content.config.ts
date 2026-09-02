import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parseCentralDateTime } from './lib/events';

const roster = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/roster' }),
  schema: ({ image }) =>
    z.object({
      derbyName: z.string(),
      number: z.string(),
      positions: z.array(z.enum(['Jammer', 'Blocker', 'Pivot', 'Ref', 'NSO'])),
      photo: z.union([image(), z.string()]).optional(),
      active: z.boolean().default(true),
    }),
});

const bouts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bouts' }),
  schema: z
    .object({
      title: z.string(),
      date: z.union([z.string(), z.date()]),
      opponent: z.string(),
      location: z.string(),
      homeOrAway: z.enum(['home', 'away']),
      facebookEventUrl: z.url().optional(),
      ticketLink: z.url().optional(),
      time: z.string().default('Doors 5:30 PM | Whistle 6:30 PM'),
      highlight: z.boolean().default(false),
    })
    .transform((data) => ({
      ...data,
      date: parseCentralDateTime(data.date, data.time),
    })),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z
    .object({
      title: z.string(),
      date: z.union([z.string(), z.date()]),
      location: z.string(),
      category: z.enum(['community', 'fundraiser']),
      time: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      date: parseCentralDateTime(data.date, data.time),
    })),
});

const sponsors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sponsors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tier: z.enum(['grand-slam', 'apex-jump', 'rookie', 'exclusive']),
      logo: z.union([image(), z.string()]).optional(),
      url: z.url().optional(),
      active: z.boolean().default(true),
    }),
});

export const collections = {
  roster,
  bouts,
  events,
  sponsors,
};
