/**
 * Universal media delivery seam.
 * Resolves local paths, Cloudinary URLs, or Cloudinary public IDs to displayable image URLs.
 */

export interface MediaResolvable {
  url?: string | null;
  publicId?: string | null;
  [key: string]: any;
}

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  'uhlykkmf';

function isLocalPath(value: string): boolean {
  if (!value) return false;
  if (value.startsWith('http://') || value.startsWith('https://')) return false;
  if (value.startsWith('/')) return true;
  if (value.includes('.') && !value.includes('/upload/')) return true;
  return false;
}

function isCloudinaryPublicId(value: string): boolean {
  if (!value) return false;
  if (isLocalPath(value)) return false;
  if (value.startsWith('http://') || value.startsWith('https://')) return false;
  return true;
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

  // If url is already a full Cloudinary URL, apply optimizations if missing
  if (url.includes('res.cloudinary.com/')) {
    if (!url.includes('q_auto') && !url.includes('f_auto')) {
      const isVideo = url.includes('/video/upload/');
      const opts = isVideo ? 'q_auto:eco,f_auto,vc_auto,w_720' : 'q_auto,f_auto';
      return url.replace('/upload/', `/upload/${opts}/`);
    }
    return url;
  }

  // If url is already a full external URL, return it as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If publicId looks like a real Cloudinary public ID (not a local file path), build Cloudinary URL
  if (isCloudinaryPublicId(publicId) && CLOUDINARY_CLOUD_NAME) {
    const isVideo = url.includes('/video/upload/') || publicId.includes('/video/');
    const resourceType = isVideo ? 'video' : 'image';
    const optimizations = isVideo ? 'q_auto:eco,f_auto,vc_auto,w_720,c_limit' : 'q_auto,f_auto';
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${optimizations}/${publicId}`;
  }

  // If url is a local path (e.g. /images/gallery/...), return it directly
  if (url && url.startsWith('/')) {
    return url;
  }

  // Fallback
  return fallback;
}

export function resolveThumbnailUrl(
  media?: string | MediaResolvable | null,
  fallback: string = ''
): string {
  let resolved = resolveImageUrl(media, fallback);
  if (!resolved || resolved === fallback) return fallback;

  if (resolved.includes('res.cloudinary.com/') && resolved.includes('/video/upload/')) {
    // Strip video-specific transformations like vc_auto that cause errors on .jpg
    resolved = resolved.replace(/vc_[^,/]+,?/g, '').replace(/,(\/)/, '$1');
    
    if (/\.(mp4|mov|webm|avi|mkv)$/i.test(resolved)) {
      return resolved.replace(/\.(mp4|mov|webm|avi|mkv)$/i, '.jpg');
    }
    return `${resolved}.jpg`;
  }

  return resolved;
}

export function resolveVideoThumbnail(
  media?: string | MediaResolvable | null,
  fallback: string = ''
): string {
  return resolveThumbnailUrl(media, fallback);
}

export default resolveImageUrl;
