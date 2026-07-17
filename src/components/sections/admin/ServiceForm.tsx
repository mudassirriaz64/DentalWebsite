'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  CheckSquare,
  PhoneCall,
  Activity,
  Smile,
  HeartPulse,
  Stethoscope,
  Plus,
  Trash2,
  Upload,
  Check
} from 'lucide-react';

interface ServiceFormProps {
  fields: {
    title: string;
    shortDescription: string;
    description: string;
    slug?: string;
    iconName: string;
    variant: string;
    imagePath?: string | null;
    ctaLabel?: string | null;
    bullets: string[];
  };
  onChange: (updatedFields: any) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Sparkles', icon: Sparkles, label: 'Bespoke / Aesthetic' },
  { name: 'Shield', icon: Shield, label: 'Protection / Hygiene' },
  { name: 'CheckSquare', icon: CheckSquare, label: 'Preventive / Checkup' },
  { name: 'PhoneCall', icon: PhoneCall, label: 'Emergency / Direct' },
  { name: 'Activity', icon: Activity, label: 'Orthodontics / Alignment' },
  { name: 'Smile', icon: Smile, label: 'Cosmetic / General' },
  { name: 'HeartPulse', icon: HeartPulse, label: 'Anxiety-Free / Calm' },
  { name: 'Stethoscope', icon: Stethoscope, label: 'Clinical / Medical' },
];

const CARD_STYLES = [
  {
    value: 'white-card',
    label: 'Simple / Light',
    description: 'Clean white backdrop, standard text links.',
    preview: (
      <div className="w-full h-16 rounded-xl border border-slate-200 bg-white flex flex-col justify-between p-3">
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <CheckSquare className="w-3.5 h-3.5" />
        </div>
        <div className="h-2 w-16 bg-slate-200 rounded" />
      </div>
    )
  },
  {
    value: 'dark-teal-card',
    label: 'Bold / Dark',
    description: 'Teal backdrop with full-width primary button.',
    preview: (
      <div className="w-full h-16 rounded-xl bg-[#005252] flex flex-col justify-between p-3 text-white">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="h-4 w-full bg-white rounded-full flex items-center justify-center text-[7px] font-bold text-primary">
          Button
        </div>
      </div>
    )
  },
  {
    value: 'accent-pink-card',
    label: 'Highlight / Accent',
    description: 'Soft pink backdrop, styled text links.',
    preview: (
      <div className="w-full h-16 rounded-xl bg-[#FFF0F2] flex flex-col justify-between p-3">
        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white">
          <PhoneCall className="w-3.5 h-3.5" />
        </div>
        <div className="h-2 w-12 bg-accent/20 rounded" />
      </div>
    )
  },
  {
    value: 'large-image-card',
    label: 'Featured Image',
    description: 'Image background layout with overlay copy.',
    preview: (
      <div className="w-full h-16 rounded-xl bg-slate-200 relative overflow-hidden flex flex-col justify-end p-3">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent" />
        <div className="relative z-10 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>
    )
  }
];

export const ServiceForm: React.FC<ServiceFormProps> = ({ fields, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: auto-generate slug
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')          // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    onChange({
      ...fields,
      title: titleVal,
      slug: slugify(titleVal)
    });
  };

  const handleFieldChange = (key: string, value: any) => {
    onChange({
      ...fields,
      [key]: value
    });
  };

  const handleStyleSelect = (variant: string) => {
    const updated: any = { ...fields, variant };
    // Clear imagePath if we leave large-image-card
    if (variant !== 'large-image-card') {
      updated.imagePath = null;
    }
    // Set ctaLabel if we enter dark-teal-card
    if (variant === 'dark-teal-card' && !fields.ctaLabel) {
      updated.ctaLabel = 'Learn More';
    }
    onChange(updated);
  };

  // Bullet list helpers
  const handleBulletChange = (index: number, val: string) => {
    const updated = [...(fields.bullets || [])];
    updated[index] = val;
    handleFieldChange('bullets', updated);
  };

  const addBulletRow = () => {
    const updated = [...(fields.bullets || []), ''];
    handleFieldChange('bullets', updated);
  };

  const removeBulletRow = (index: number) => {
    const updated = (fields.bullets || []).filter((_, i) => i !== index);
    handleFieldChange('bullets', updated);
  };

  // Mock local image file selection
  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate resolveImageUrl placeholder path
      const simulatedUrl = `/images/home/${file.name}`;
      handleFieldChange('imagePath', simulatedUrl);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left font-sans">
      {/* 1. Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
          Service Title *
        </label>
        <input
          type="text"
          required
          value={fields.title}
          onChange={handleTitleChange}
          placeholder="e.g. Teeth Whitening (Bleaching Light)"
          className="px-4 py-3 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
        />
        {fields.slug && (
          <span className="text-[10px] text-slate-400 font-mono pl-1 mt-0.5">
            Auto-generated link: /services/{fields.slug}
          </span>
        )}
      </div>

      {/* 2. Short Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
          Short Description (Bento Summary) *
        </label>
        <textarea
          required
          rows={2}
          value={fields.shortDescription}
          onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
          placeholder="A quick 1-2 sentence overview shown directly on the grid card..."
          className="px-4 py-3 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs resize-none"
        />
      </div>

      {/* 3. Full Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
          Full Detail Description (Optional)
        </label>
        <textarea
          rows={4}
          value={fields.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Deep detailed summary for potential procedures, detail views, and clinical guides..."
          className="px-4 py-3 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs resize-none"
        />
      </div>

      {/* 4. Bullets (Repeatable List UI) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide flex justify-between items-center">
          <span>Procedure Highlights & Offerings</span>
          <span className="text-[10px] font-semibold text-slate-400 normal-case">
            {(fields.bullets || []).length} items added
          </span>
        </label>
        
        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
          {(fields.bullets || []).map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={bullet}
                onChange={(e) => handleBulletChange(idx, e.target.value)}
                placeholder="e.g. Professional Laser Session"
                className="flex-grow px-4 py-2.5 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
              />
              <button
                type="button"
                onClick={() => removeBulletRow(idx)}
                className="p-2.5 rounded-xl bg-slate-55 hover:bg-accent-soft text-slate-400 hover:text-accent transition duration-200 cursor-pointer"
                title="Remove bullet point"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {(fields.bullets || []).length === 0 && (
            <div className="py-4 text-center rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 text-xs">
              No procedure highlights specified. Add one to show key benefits.
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={addBulletRow}
          className="mt-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-slate-200 hover:border-primary/50 text-slate-500 hover:text-primary transition duration-200 font-semibold text-xs bg-white hover:bg-slate-50/50 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Highlight Point
        </button>
      </div>

      {/* 5. Icon Visual Picker */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
          Select Clinical Icon
        </label>
        <div className="grid grid-cols-4 gap-2">
          {AVAILABLE_ICONS.map(({ name, icon: Icon, label }) => {
            const isSelected = fields.iconName === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleFieldChange('iconName', name)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-205 cursor-pointer ${
                  isSelected
                    ? 'bg-primary-soft border-primary text-primary shadow-sm scale-102 font-semibold'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-500 hover:border-slate-200'
                }`}
                title={label}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-slate-500'}`} />
                <span className="text-[9px] truncate max-w-full tracking-tight">{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Card Style Visual Picker */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
          Bento Grid Layout Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {CARD_STYLES.map(({ value, label, description, preview }) => {
            const isSelected = fields.variant === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleStyleSelect(value)}
                className={`p-4 rounded-2xl border flex flex-col text-left justify-between gap-3 transition-all duration-250 cursor-pointer ${
                  isSelected
                    ? 'bg-primary-soft/30 border-primary shadow-sm ring-1 ring-primary/20 scale-101'
                    : 'bg-white border-slate-100 hover:bg-[#F9FAFB] hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-dark-text leading-tight">{label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight font-normal">{description}</span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                {preview}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditionally Rendered Field: Image Path (Only if Featured Image variant) */}
      {fields.variant === 'large-image-card' && (
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 animate-fade-in">
          <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
            Featured Background Image
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400">
              {fields.imagePath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fields.imagePath}
                  alt="Service preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="w-5 h-5 text-slate-300" />
              )}
            </div>
            <div className="flex flex-col gap-2 flex-grow">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-dark-text font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload Image File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUploadChange}
                  className="hidden"
                />
              </div>
              <input
                type="text"
                value={fields.imagePath || ''}
                onChange={(e) => handleFieldChange('imagePath', e.target.value)}
                placeholder="/images/home/service-photo.png (Optional manual path)"
                className="px-3 py-2 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-[10px] font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Conditionally Rendered Field: CTA Label (Only if Bold / Dark variant) */}
      {fields.variant === 'dark-teal-card' && (
        <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4 animate-fade-in">
          <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
            Button Text (CTA Label)
          </label>
          <input
            type="text"
            value={fields.ctaLabel || ''}
            onChange={(e) => handleFieldChange('ctaLabel', e.target.value)}
            placeholder="Learn More (Default)"
            className="px-4 py-3 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
          />
        </div>
      )}
    </div>
  );
};

export default ServiceForm;
