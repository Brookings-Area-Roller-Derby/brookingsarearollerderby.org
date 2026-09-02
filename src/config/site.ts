export const siteConfig = {
  name: 'Brookings Area Roller Derby',
  shortName: 'BARD',
  url: 'https://brookingsarearollerderby.org',
  description:
    "Brookings Area Roller Derby (BARD) - South Dakota's skater-owned full-contact flat-track roller derby league.",
  season: 2026,
  timeZone: 'America/Chicago',
  demoMode: true,
  socialImage: '/favicon.jpg',
  email: 'midwestmaidensrollerderby@gmail.com',
  facebookUrl: 'https://www.facebook.com/midwestmaidens',
  instagramUrl: 'https://www.instagram.com/bard_rollerderby/',
  youtubeUrl: 'https://www.youtube.com/@bardrollerderby',
  tiktokUrl: 'https://www.tiktok.com/@brookingsarearollerderby',
  merchUrl: 'https://www.bonfire.com/new-bard-merch/',
  donationUrl: 'https://www.venmo.com/u/BrookingsAreaRollerDerby',
  homeVenue: {
    name: 'Brookings County Outdoor Adventure Center',
    address: '2810 22nd Ave S, Brookings, SD 57006',
  },
} as const;

export type SiteConfig = typeof siteConfig;
