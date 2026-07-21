import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderParam = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided for upload' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only image files (PNG, JPG, WebP, SVG) are allowed.' }, { status: 400 });
    }

    // Validate max file size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 10MB limit.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize folder path
    const cleanSubFolder = folderParam.replace(/^dental-website\/?/, '').trim();
    const folder = `dental-website/${cleanSubFolder}`.replace(/\/+/g, '/');

    const result = await new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          use_filename: true,
          unique_filename: true,
        },
        (error, res) => {
          if (error || !res) {
            reject(error || new Error('Cloudinary upload streaming failed'));
          } else {
            resolve({ public_id: res.public_id, secure_url: res.secure_url });
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      publicId: result.public_id,
      secureUrl: result.secure_url,
    });
  } catch (error: any) {
    console.error('Cloudinary upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during image upload.' },
      { status: 500 }
    );
  }
}
