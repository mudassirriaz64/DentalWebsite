'use client';

import React, { useRef } from 'react';
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
  Star,
} from 'lucide-react';

interface ServiceFormProps {
  fields: {
    title: string;
    shortDescription: string;
    description: string;
    slug?: string;
    iconName: string;
    imagePath?: string | null;
    bullets: string[];
    featured?: boolean;
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

export const ServiceForm: React.FC<ServiceFormProps> = ({ fields, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: auto-generate slug
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    onChange({
      ...fields,
      title: titleVal,
      slug: slugify(titleVal),
    });
  };

  const handleFieldChange = (key: string, value: any) => {
    onChange({
      ...fields,
      [key]: value,
    });
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
          Short Description *
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

      {/* 3. Full Description (Optional) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
          Full Detail Description (Optional)
        </label>
        <textarea
          rows={3}
          value={fields.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Deep detailed summary for potential procedures, detail views, and clinical guides..."
          className="px-4 py-3 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs resize-none"
        />
      </div>

      {/* 4. Icon Visual Picker */}
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
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-primary-soft border-primary text-primary shadow-sm font-semibold'
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

      {/* 5. Image (Optional Upload / Path) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
          Service Photo / Preview Image (Optional)
        </label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
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
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-dark-text font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Image File
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

      {/* 6. Bullets (Repeatable List UI) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide flex justify-between items-center">
          <span>Procedure Highlights & Key Benefits (Optional)</span>
          <span className="text-[10px] font-semibold text-slate-400 normal-case">
            {(fields.bullets || []).length} items added
          </span>
        </label>

        <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
          {(fields.bullets || []).map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={bullet}
                onChange={(e) => handleBulletChange(idx, e.target.value)}
                placeholder="e.g. Laser Teeth Whitening"
                className="flex-grow px-4 py-2 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
              />
              <button
                type="button"
                onClick={() => removeBulletRow(idx)}
                className="p-2 rounded-xl hover:bg-accent-soft text-slate-400 hover:text-accent transition duration-200 cursor-pointer"
                title="Remove bullet point"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {(fields.bullets || []).length === 0 && (
            <div className="py-3 text-center rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No procedure highlights specified. Click below to add key benefit tags.
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={addBulletRow}
          className="mt-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-slate-200 hover:border-primary/50 text-slate-500 hover:text-primary transition duration-200 font-semibold text-xs bg-white hover:bg-slate-50/50 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Highlight Point
        </button>
      </div>

      {/* 7. Featured for Homepage Carousel */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 fill-accent" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="featured-service-toggle" className="text-xs font-bold text-dark-text cursor-pointer">
              Feature on Homepage Carousel
            </label>
            <span className="text-[10px] text-slate-400">
              Shows this service card in the featured carousel on the home page.
            </span>
          </div>
        </div>

        <input
          id="featured-service-toggle"
          type="checkbox"
          checked={!!fields.featured}
          onChange={(e) => handleFieldChange('featured', e.target.checked)}
          className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ServiceForm;
