export function normalizeImageUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== 'string') return undefined;

  const trimmed = url.trim();

  // Google Drive share link: https://drive.google.com/file/d/FILE_ID/view...
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Google Drive open/uc link: https://drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const driveIdMatch = trimmed.match(
    /drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
  );
  if (driveIdMatch) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // Dropbox share link: convert ?dl=0 to ?raw=1 for direct image embed
  if (trimmed.includes('dropbox.com') && trimmed.includes('dl=0')) {
    return trimmed.replace('dl=0', 'raw=1');
  }

  return trimmed;
}
