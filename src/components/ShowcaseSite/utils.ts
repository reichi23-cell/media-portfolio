export function normalizeEmbedUrl(value: string) {
  if (!value) return '';

  try {
    const url = new URL(value);
    if (url.hostname.includes('youtube.com')) {
      const videoId = url.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (url.pathname.startsWith('/shorts/')) {
        return `https://www.youtube.com/embed/${url.pathname.split('/')[2]}`;
      }
    }
    if (url.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    }
    if (url.hostname.includes('vimeo.com')) {
      const videoId = url.pathname.split('/').filter(Boolean)[0];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
  } catch {
    return value;
  }

  return value;
}

export function isDirectVideo(source: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(source) || source.startsWith('blob:');
}

export function isImageSource(source: string) {
  return /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(source) || source.startsWith('blob:');
}

export async function hashPassword(value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}
