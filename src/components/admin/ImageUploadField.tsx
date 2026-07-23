'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Loader, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { resolveImageUrl } from '@/lib/media';

export interface ImageFieldValue {
  publicId?: string;
  url: string;
}

interface ImageUploadFieldProps {
  value?: string | ImageFieldValue | null;
  onChange: (val: ImageFieldValue | null) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  accept?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  folder = 'general',
  label,
  placeholder = 'Paste hosted media URL e.g. https://...',
  required = false,
  className = '',
  accept = 'image/*',
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive preview URL & public ID from value
  const currentUrl = typeof value === 'string' ? value : value?.url || '';
  const currentPublicId = typeof value === 'object' ? value?.publicId : undefined;

  const displayPreviewUrl = resolveImageUrl(
    typeof value === 'object' && value ? value : { url: currentUrl, publicId: currentPublicId }
  );

  const isVideoFile = (url?: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return (
      lowerUrl.endsWith('.mp4') ||
      lowerUrl.endsWith('.mov') ||
      lowerUrl.endsWith('.webm') ||
      lowerUrl.includes('/video/upload/') ||
      lowerUrl.includes('/raw/upload/')
    );
  };

  // Compress image helper using HTML5 Canvas
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log(`[Compression] Image reduced from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.82
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleUploadFile = async (file: File) => {
    setErrorMsg('');

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP, SVG) or video file (MP4, MOV, WebM).');
      return;
    }

    const MAX_IMAGE_SIZE = 50 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
    const limit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > limit) {
      setErrorMsg(`Selected file exceeds the allowed limit of ${isVideo ? '500MB' : '50MB'}.`);
      return;
    }

    setIsUploading(true);

    try {
      let fileToUpload = file;

      if (isImage) {
        // Compress image before upload
        fileToUpload = await compressImage(file);
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload media to Cloudinary.');
      }

      if (!data.secureUrl) {
        throw new Error('Upload succeeded but no URL was returned. Please try again.');
      }

      onChange({
        publicId: data.publicId,
        url: data.secureUrl,
      });
    } catch (err: any) {
      console.error('[ImageUploadField] Upload failed:', err);
      setErrorMsg(err.message || 'Media upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urlVal = e.target.value;
    setErrorMsg('');
    if (!urlVal.trim()) {
      onChange(null);
    } else {
      onChange({ url: urlVal.trim() });
    }
  };

  const handleRemove = () => {
    setErrorMsg('');
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-2 font-sans text-left ${className}`}>
      {label && (
        <label className="text-xs font-bold text-[#333333] uppercase tracking-wide flex items-center justify-between">
          <span>{label} {required && <span className="text-accent">*</span>}</span>
          {displayPreviewUrl && (
            <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active Media Set
            </span>
          )}
        </label>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            mode === 'upload'
              ? 'bg-white text-primary shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>

        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            mode === 'url'
              ? 'bg-white text-primary shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Use Media URL
        </button>
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-accent-soft text-accent-dark border border-accent/15 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Mode 1: Device Upload (Drag & Drop + Browse) */}
      {mode === 'upload' && (
        <div className="flex flex-col gap-3">
          {displayPreviewUrl ? (
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
              {isVideoFile(displayPreviewUrl) ? (
                <video
                  src={displayPreviewUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={displayPreviewUrl}
                  alt="Media Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-md cursor-pointer transition"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-slate-500'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-primary py-2">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-bold">Compressing & Uploading...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mb-0.5">
                    Click to browse or drag & drop file
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Photos (up to 50MB) or Videos (up to 500MB)
                  </span>
                </>
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {mode === 'url' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentUrl}
              onChange={handleUrlInputChange}
              placeholder={placeholder}
              className="flex-1 px-4 py-2.5 bg-[#F0F0F0] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs font-mono"
            />
            {currentUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                title="Clear URL"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {displayPreviewUrl ? (
            <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              {isVideoFile(displayPreviewUrl) ? (
                <video
                  src={displayPreviewUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={displayPreviewUrl}
                  alt="URL Preview"
                  className="w-full h-full object-cover"
                  onError={() => setErrorMsg('Failed to load media preview from provided URL.')}
                />
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Paste a media URL above to preview</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
