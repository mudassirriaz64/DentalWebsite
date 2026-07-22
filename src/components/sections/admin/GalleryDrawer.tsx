'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, AlertCircle, ShieldAlert } from 'lucide-react';
import { GalleryItem, GalleryCategory, GALLERY_CATEGORIES } from '@/types/gallery';
import ImageUploadField from '@/components/admin/ImageUploadField';

interface GalleryDrawerProps {
  isOpen: boolean;
  item: GalleryItem | null;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
}

const variantsList = [
  { value: 'comparison', label: 'Before/After Slider', desc: 'Double image comparison' },
  { value: 'vertical', label: 'Tall Overlay', desc: 'Tall card with dark text overlay' },
  { value: 'square', label: 'Square Card', desc: 'White block with text below' },
  { value: 'wideSplit', label: 'Wide Teal Split', desc: 'Teal card / Image side-by-side' },
  { value: 'small', label: 'Small Compact', desc: 'Small info card' },
];

export const GalleryDrawer: React.FC<GalleryDrawerProps> = ({ isOpen, item, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [variant, setVariant] = useState<string>('comparison');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('Veneers');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isVerifiedPatient, setIsVerifiedPatient] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('draft');

  // Images states
  const [beforeImage, setBeforeImage] = useState({ publicId: '', url: '', altText: '' });
  const [afterImage, setAfterImage] = useState({ publicId: '', url: '', altText: '' });
  const [mainImage, setMainImage] = useState({ publicId: '', url: '', altText: '' });

  // Initialize form with edit data
  useEffect(() => {
    if (item) {
      setVariant(item.variant);
      setTitle(item.title);
      setDescription(item.description);
      setCategory(item.category);
      setTags(item.tags || []);
      setIsVerifiedPatient(!!item.isVerifiedPatient);
      setFeatured(!!item.featured);
      setStatus(item.status);

      setBeforeImage(item.images.before || { publicId: '', url: '', altText: '' });
      setAfterImage(item.images.after || { publicId: '', url: '', altText: '' });
      setMainImage(item.images.main || { publicId: '', url: '', altText: '' });
    } else {
      setVariant('comparison');
      setTitle('');
      setDescription('');
      setCategory('Veneers');
      setTags([]);
      setTagInput('');
      setIsVerifiedPatient(false);
      setFeatured(false);
      setStatus('draft');

      setBeforeImage({ publicId: '', url: '', altText: '' });
      setAfterImage({ publicId: '', url: '', altText: '' });
      setMainImage({ publicId: '', url: '', altText: '' });
    }
    setErrorMsg('');
  }, [item, isOpen]);

  // Handle local mock image file uploading (storing path / mock asset)
  const handleLocalImageSelect = (slot: 'before' | 'after' | 'main', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local blob object URL for instant previewing
    const objectUrl = URL.createObjectURL(file);
    const mockPayload = {
      publicId: `gallery/${file.name}`,
      url: objectUrl,
      altText: '',
    };

    // TODO: When Cloudinary API key is set up:
    // const formData = new FormData();
    // formData.append('file', file);
    // const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    // const cloudData = await res.json();
    // setSlot({ publicId: cloudData.publicId, url: cloudData.secureUrl, altText: '' })

    if (slot === 'before') setBeforeImage({ ...beforeImage, ...mockPayload });
    if (slot === 'after') setAfterImage({ ...afterImage, ...mockPayload });
    if (slot === 'main') setMainImage({ ...mainImage, ...mockPayload });
  };

  // Alternative: manual path entry (if user places assets manually in /public/images/gallery)
  const handleManualPathInput = (slot: 'before' | 'after' | 'main', urlPath: string) => {
    const mockPayload = {
      publicId: urlPath.replace('/images/', ''),
      url: urlPath,
    };
    if (slot === 'before') setBeforeImage({ ...beforeImage, ...mockPayload });
    if (slot === 'after') setAfterImage({ ...afterImage, ...mockPayload });
    if (slot === 'main') setMainImage({ ...mainImage, ...mockPayload });
  };

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

    if (variant === 'comparison') {
      if (!beforeImage.url || beforeImage.altText.trim().length < 10) return false;
      if (!afterImage.url || afterImage.altText.trim().length < 10) return false;
    } else {
      if (!mainImage.url || mainImage.altText.trim().length < 10) return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, forceStatus?: 'published' | 'draft') => {
    e.preventDefault();
    setErrorMsg('');

    const targetStatus = forceStatus || status;

    // Strict validation check when publishing
    if (targetStatus === 'published' && !isFormValid()) {
      setErrorMsg('Please upload required image files and add descriptive alt texts (min 10 characters) before publishing.');
      return;
    }

    setLoading(true);

    const payload = {
      variant,
      title,
      description,
      category,
      tags,
      isVerifiedPatient: variant === 'square' ? isVerifiedPatient : false,
      featured,
      status: targetStatus,
      images:
        variant === 'comparison'
          ? { before: beforeImage, after: afterImage }
          : { main: mainImage },
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

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-sm"
        >
          {errorMsg && (
            <div className="p-4 rounded-xl bg-accent-soft text-accent-dark font-semibold border border-accent/15 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. VISUAL PICKER FOR CARD LAYOUT VARIANT */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-dark-text tracking-wide uppercase text-xs">
              Card shape layout
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {variantsList.map((v) => (
                <button
                  type="button"
                  key={v.value}
                  onClick={() => setVariant(v.value)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    variant === v.value
                      ? 'border-[#0B5E2F] bg-[#0B5E2F]/5 text-[#0B5E2F] font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-500'
                  }`}
                >
                  <span className="text-xs leading-tight">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. CONDITIONAL UPLOAD SLOTS */}
          <div className="flex flex-col gap-3">
            <label className="font-bold text-dark-text tracking-wide uppercase text-xs">
              Case Media Uploads
            </label>

            {/* A. BEFORE & AFTER IMAGE SLOTS FOR COMPARISON */}
            {variant === 'comparison' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Image Slot */}
                <div className="flex flex-col gap-2 p-4 bg-bg-alt border border-slate-200 rounded-2xl relative">
                  <ImageUploadField
                    label="Before Smile Profile"
                    folder="gallery"
                    value={beforeImage}
                    onChange={(val) =>
                      setBeforeImage({
                        publicId: val?.publicId || '',
                        url: val?.url || '',
                        altText: beforeImage.altText,
                      })
                    }
                  />
                  {/* Required alt text */}
                  <input
                    type="text"
                    required
                    value={beforeImage.altText}
                    onChange={(e) => setBeforeImage({ ...beforeImage, altText: e.target.value })}
                    placeholder="Required Alt text (min 10 chars)"
                    className="w-full px-3 py-2 rounded-xl border bg-white text-xs text-dark-text placeholder-slate-400 focus:outline-none"
                  />
                  {beforeImage.altText.trim().length < 10 && beforeImage.altText.trim().length > 0 && (
                    <span className="text-[9px] text-accent font-semibold">
                      Need {10 - beforeImage.altText.trim().length} more characters.
                    </span>
                  )}
                </div>

                {/* After Image Slot */}
                <div className="flex flex-col gap-2 p-4 bg-bg-alt border border-slate-200 rounded-2xl relative">
                  <ImageUploadField
                    label="After Smile Profile"
                    folder="gallery"
                    value={afterImage}
                    onChange={(val) =>
                      setAfterImage({
                        publicId: val?.publicId || '',
                        url: val?.url || '',
                        altText: afterImage.altText,
                      })
                    }
                  />
                  {/* Required alt text */}
                  <input
                    type="text"
                    required
                    value={afterImage.altText}
                    onChange={(e) => setAfterImage({ ...afterImage, altText: e.target.value })}
                    placeholder="Required Alt text (min 10 chars)"
                    className="w-full px-3 py-2 rounded-xl border bg-white text-xs text-dark-text placeholder-slate-400 focus:outline-none"
                  />
                  {afterImage.altText.trim().length < 10 && afterImage.altText.trim().length > 0 && (
                    <span className="text-[9px] text-accent font-semibold">
                      Need {10 - afterImage.altText.trim().length} more characters.
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* B. SINGLE IMAGE SLOT FOR OTHERS */
              <div className="flex flex-col gap-2 p-4 bg-bg-alt border border-slate-200 rounded-2xl relative">
                <ImageUploadField
                  label="Main Case Photo"
                  folder="gallery"
                  value={mainImage}
                  onChange={(val) =>
                    setMainImage({
                      publicId: val?.publicId || '',
                      url: val?.url || '',
                      altText: mainImage.altText,
                    })
                  }
                />
                {/* Required alt text */}
                <input
                  type="text"
                  required
                  value={mainImage.altText}
                  onChange={(e) => setMainImage({ ...mainImage, altText: e.target.value })}
                  placeholder="Required Alt text (min 10 chars)"
                  className="w-full px-3 py-2 rounded-xl border bg-white text-xs text-dark-text placeholder-slate-400 focus:outline-none"
                />
                {mainImage.altText.trim().length < 10 && mainImage.altText.trim().length > 0 && (
                  <span className="text-[9px] text-accent font-semibold">
                    Need {10 - mainImage.altText.trim().length} more characters.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 3. CASE TITLE */}
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
              placeholder="e.g. Laser Bright Whitening"
            />
          </div>

          {/* 4. DESCRIPTION */}
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
              placeholder="Bespoke clinical details..."
            />
          </div>

          {/* 5. CATEGORY SELECT */}
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

            {/* 6. VERIFIED PATIENT (Only for Square variant) */}
            {variant === 'square' && (
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
                  Verified Patient
                </label>
              </div>
            )}
          </div>

          {/* 7. CHIP TAGS INPUT */}
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

          {/* 8. FEATURED CHECKBOX */}
          <div className="flex items-center gap-2.5 border-t border-slate-100 pt-5">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
            />
            <label
              htmlFor="featured-checkbox"
              className="font-semibold text-xs text-dark-text uppercase tracking-wide cursor-pointer"
            >
              Pin case as Featured item
            </label>
          </div>

          {/* 9. PUBLISH STATUS TOGGLE */}
          <div className="flex flex-col gap-1.5 mt-2 bg-slate-50 p-4 rounded-2xl border">
            <label className="font-bold text-dark-text tracking-wide uppercase text-xs">
              Document Visibility Status
            </label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="w-4 h-4 text-slate-500 focus:ring-slate-400 cursor-pointer"
                />
                Save as Draft
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-[#0B5E2F]">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="w-4 h-4 text-[#0B5E2F] focus:ring-primary cursor-pointer"
                />
                Publish Instantly
              </label>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>Draft items are hidden from patients but manageable in the admin panel.</span>
            </p>
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
            {status === 'draft' ? (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-900 transition cursor-pointer font-semibold shadow-sm"
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={loading || !isFormValid()}
                className="px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary-hover disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition cursor-pointer font-bold shadow-sm"
              >
                {loading ? 'Publishing...' : 'Save & Publish'}
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
};

export default GalleryDrawer;
