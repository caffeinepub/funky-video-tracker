export function extractVideoId(url: string): string | null {
  if (!url) return null;

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  // Instagram Reel pattern
  const instagramPattern = /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/;
  const instagramMatch = url.match(instagramPattern);
  if (instagramMatch) return instagramMatch[1];

  return null;
}

export function generateThumbnailUrl(url: string, videoId: string): string | null {
  if (!url || !videoId) return null;

  // YouTube thumbnail
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  // Instagram - cannot auto-generate, return null
  if (url.includes('instagram.com')) {
    return null;
  }

  return null;
}

export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com/reel');
}
