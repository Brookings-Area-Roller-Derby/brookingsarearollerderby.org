import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const roster = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/roster' }),
  schema: ({ image }) => z.object({
    derbyName: z.string(),
    legalName: z.string().optional(),
    number: z.string(),
    positions: z.array(z.enum(['Jammer', 'Blocker', 'Pivot', 'Ref', 'NSO'])),
    bio: z.string(),
    photo: image().optional(),
    active: z.boolean().default(true),
  }),
});

const bouts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bouts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    opponent: z.string(),
    location: z.string(),
    homeOrAway: z.enum(['home', 'away']),
    details: z.string().optional(),
    ticketLink: z.string().url().optional(),
    time: z.string().default('Doors 5:30 PM | Whistle 6:30 PM'),
    highlight: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    description: z.string(),
    category: z.enum(['community', 'fundraiser']),
    time: z.string().optional(),
  }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sponsors' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    tier: z.enum(['grand-slam', 'apex-jump', 'rookie', 'exclusive']),
    logo: image().optional(),
    url: z.string().url().optional(),
    active: z.boolean().default(true),
    blurb: z.string().optional(),
  }),
});

export const collections = {
  roster,
  bouts,
  events,
  sponsors,
};
