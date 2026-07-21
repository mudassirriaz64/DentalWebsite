/**
 * Universal media delivery seam.
 * Resolves local paths, Cloudinary URLs, or Cloudinary public IDs to displayable image URLs.
 */

export interface MediaResolvable {
  url?: string | null;
  publicId?: string | null;
  [key: string]: any;
}

export function resolveImageUrl(
  media?: string | MediaResolvable | null,
  fallback: string = ''
): string {
  if (!media) return fallback;

  let url = '';
  let publicId = '';

  if (typeof media === 'string') {
    url = media.trim();
  } else if (typeof media === 'object') {
    url = (media.url || media.beforeImageUrl || media.afterImageUrl || media.mainImageUrl || '').trim();
    publicId = (media.publicId || media.beforeImageId || media.afterImageId || media.mainImageId || '').trim();
  }

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    'uhlykkmf';

  if (publicId && cloudName) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/${publicId}`;
  }

  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }

  if (url) {
    return url;
  }

  return fallback;
}

export default resolveImageUrl;
