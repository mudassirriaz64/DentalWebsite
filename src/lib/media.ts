import { GalleryImage } from '@/types/gallery';

/**
 * Resolves a gallery image structure to a displayable URL string.
 * This is the single source of truth for media delivery.
 * When Cloudinary is connected later, updating this function will instantly
 * redirect all public and admin elements to the cloud delivery optimization pipeline.
 */
export function resolveImageUrl(image: GalleryImage): string {
  if (!image) return '';

  // TODO: once Cloudinary credentials are set up:
  // 1. Install '@cloudinary/url-gen' or use the standard delivery path:
  //    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto,w_800/${image.publicId}`;
  // 2. Or use a helper SDK client:
  //    return cloudinaryClient.image(image.publicId).quality('auto').format('auto').toURL();

  return image.url; // default local folder asset resolution
}

export default resolveImageUrl;
