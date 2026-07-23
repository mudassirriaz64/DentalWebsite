'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { GalleryItem, GalleryCategory, GALLERY_CATEGORIES } from '@/types/gallery';
import ImageUploadField from '@/components/admin/ImageUploadField';

interface GalleryDrawerProps {
  isOpen: boolean;
  item: GalleryItem | null;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
}

export const GalleryDrawer: React.FC<GalleryDrawerProps> = ({ isOpen, item, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('Veneers');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isVerifiedPatient, setIsVerifiedPatient] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [uploadType, setUploadType] = useState<'single' | 'comparison'>('single');

  // Images/Video states
  const [beforeImage, setBeforeImage] = useState({ publicId: '', url: '', altText: '' });
  const [afterImage, setAfterImage] = useState({ publicId: '', url: '', altText: '' });

  // Initialize form with edit data
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setCategory(item.category);
      setTags(item.tags || []);
      setIsVerifiedPatient(!!item.isVerifiedPatient);
      setFeatured(!!item.featured);
      setIsPublished(item.status === 'published');

      setBeforeImage(item.images.before || { publicId: '', url: '', altText: '' });
      // Map legacy "main" image format to "afterImage" for compatibility
      setAfterImage(item.images.after || item.images.main || { publicId: '', url: '', altText: '' });
      setUploadType(item.images.before?.url ? 'comparison' : 'single');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Veneers');
      setTags([]);
      setTagInput('');
      setIsVerifiedPatient(false);
      setFeatured(false);
      setIsPublished(true);

      setBeforeImage({ publicId: '', url: '', altText: '' });
      setAfterImage({ publicId: '', url: '', altText: '' });
      setUploadType('single');
    }
    setErrorMsg('');
  }, [item, isOpen]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/#/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  // Validate form properties
  const isFormValid = () => {
    if (!title.trim() || title.length > 60) return false;
    if (!description.trim() || description.length > 160) return false;
    if (!category) return false;
    // After/Final media is ALWAYS required
    if (!afterImage.url) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isFormValid()) {
      setErrorMsg('Please upload the required showcase photo or video before saving.');
      return;
    }

    setLoading(true);

    const finalBefore = (uploadType === 'comparison' && beforeImage.url)
      ? {
          publicId: beforeImage.publicId,
          url: beforeImage.url,
          altText: beforeImage.altText.trim() || `Before: ${title} smile transformation`,
        }
      : null;

    const finalAfter = {
      publicId: afterImage.publicId,
      url: afterImage.url,
      altText: afterImage.altText.trim() || `After: ${title} smile transformation`,
    };

    // Auto-calculate the variant layout based on type selection
    const computedVariant = (uploadType === 'comparison' && beforeImage.url) ? 'comparison' : 'square';

    const payload = {
      variant: computedVariant,
      title,
      description,
      category,
      tags,
      isVerifiedPatient,
      featured,
      status: isPublished ? 'published' : 'draft',
      images: (uploadType === 'comparison' && beforeImage.url)
        ? { before: finalBefore, after: finalAfter }
        : { main: finalAfter },
      displayOrder: item?.displayOrder,
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save case record');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end font-sans text-dark-text">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Card */}
      <div className="relative w-full max-w-xl bg-white h-screen flex flex-col shadow-2xl overflow-hidden animate-slide-in-right z-10">
        <header className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg font-sans">
              {item ? 'Modify Gallery Case' : 'Add Gallery Case'}
            </h3>
            <p className="text-xs text-body-text mt-0.5">Define patient transformations</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-50 hover:text-dark-text cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-sm">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-accent-soft text-accent-dark font-semibold border border-accent/15 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. CASE MEDIA UPLOADS WITH TYPE SWITCHER */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-dark-text tracking-wide uppercase text-xs">
                Case Media Uploads
              </label>

              {/* Upload Type Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUploadType('single')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    uploadType === 'single'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Single Media
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('comparison')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    uploadType === 'comparison'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Before & After
                </button>
              </div>
            </div>

            {uploadType === 'single' ? (
              /* A. SINGLE MEDIA SHOWCASE FIELD */
              <div className="flex flex-col gap-2 p-4 bg-bg-alt border border-slate-200 rounded-2xl relative w-full">
                <ImageUploadField
                  label="Showcase Photo / Video *"
                  folder="gallery"
                  accept="image/*,video/*"
                  value={afterImage}
                  required
                  onChange={(val) =>
                    setAfterImage({
                      publicId: val?.publicId || '',
                      url: val?.url || '',
                      altText: afterImage.altText,
                    })
                  }
                />
                {/* Optional alt text */}
                <input
                  type="text"
                  value={afterImage.altText}
                  onChange={(e) => setAfterImage({ ...afterImage, altText: e.target.value })}
                  placeholder="Alt text description (Optional)"
                  className="w-full px-3 py-2 rounded-xl border bg-white text-xs text-dark-text placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ) : (
              /* B. BEFORE & AFTER SLIDER COMPARISON FIELDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Media Slot */}
                <div className="flex flex-col gap-2 p-4 bg-bg-alt border border-slate-200 rounded-2xl relative">
                  <ImageUploadField
                    label="Before Photo / Video"
                    folder="gallery"
                    accept="image/*,video/*"
                    value={beforeImage}
                    onChange={(val) =>
                      setBeforeImage({
                        publicId: val?.publicId || '',
                        url: val?.url || '',
                        altText: beforeImage.altText,
                      })
                    }
                  />
                  {/* Optional alt text */}
                  <input
                    type="text"
                    value={beforeImage.altText}
                    onChange={(e) => setBeforeImage({ ...beforeImage, altText: e.target.value })}
                    placeholder="Alt text description (Optional)"
                    className="w-full px-3 py-2 rounded-xl border bg-white text-xs text-dark-text placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* After Media Slot */}
                <div className="flex flex-col gap-2 p-4 bg-bg-alt border border-slate-200 rounded-2xl relative">
                  <ImageUploadField
                    label="After Photo / Video *"
                    folder="gallery"
                    accept="image/*,video/*"
                    value={afterImage}
                    required
                    onChange={(val) =>
                      setAfterImage({
                        publicId: val?.publicId || '',
                        url: val?.url || '',
                        altText: afterImage.altText,
                      })
                    }
                  />
                  {/* Optional alt text */}
                  <input
                    type="text"
                    value={afterImage.altText}
                    onChange={(e) => setAfterImage({ ...afterImage, altText: e.target.value })}
                    placeholder="Alt text description (Optional)"
                    className="w-full px-3 py-2 rounded-xl border bg-white text-xs text-dark-text placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. CASE TITLE */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-dark-text tracking-wide uppercase">Title *</label>
              <span className={`font-semibold ${title.length > 60 ? 'text-accent' : 'text-slate-400'}`}>
                {title.length}/60
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={70}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Full Mouth Veneers makeover"
            />
          </div>

          {/* 3. DESCRIPTION */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-dark-text tracking-wide uppercase">
                Case Description *
              </label>
              <span
                className={`font-semibold ${description.length > 160 ? 'text-accent' : 'text-slate-400'}`}
              >
                {description.length}/160
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={180}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Bespoke clinical details of what was done..."
            />
          </div>

          {/* 4. CATEGORY SELECT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-dark-text tracking-wide uppercase text-xs">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
              >
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. VERIFIED PATIENT BADGE */}
            <div className="flex items-center gap-2.5 self-end py-3">
              <input
                type="checkbox"
                id="verified-checkbox"
                checked={isVerifiedPatient}
                onChange={(e) => setIsVerifiedPatient(e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
              />
              <label
                htmlFor="verified-checkbox"
                className="font-semibold text-xs text-dark-text uppercase tracking-wide cursor-pointer"
              >
                Patient Verified Case
              </label>
            </div>
          </div>

          {/* 6. CHIP TAGS INPUT */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-dark-text tracking-wide uppercase text-xs">
              Tags (optional)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Press Enter or Comma to add tag"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-slate-100 hover:bg-slate-200 border rounded-full text-xs font-semibold"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-400 hover:text-accent font-bold cursor-pointer text-[10px]"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 7. SETTINGS TOGGLES */}
          <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="published-checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
              />
              <label
                htmlFor="published-checkbox"
                className="font-semibold text-xs text-dark-text uppercase tracking-wide cursor-pointer"
              >
                Published (Visible to patients instantly)
              </label>
            </div>
          </div>

          {/* Actions */}
          <footer className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary-hover disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition cursor-pointer font-bold shadow-sm"
            >
              {loading ? 'Saving...' : item ? 'Update Case' : 'Create Case'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default GalleryDrawer;
