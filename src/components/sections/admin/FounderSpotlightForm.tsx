'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function FounderSpotlightForm() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/founder-spotlight')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setName(data.name);
          setTitle(data.title);
          setImagePath(data.imagePath);
        }
      })
      .catch(() => setMessage('Failed to load spotlight data'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/admin/founder-spotlight', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title, imagePath }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setMessage('Spotlight updated successfully');
      setIsError(false);
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {message && (
        <div
          className={`p-4 rounded-xl font-semibold text-xs border ${
            isError
              ? 'bg-rose-50 text-rose-700 border-rose-200/50'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="max-w-xl">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
              Doctor Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Sarah Jane"
              className="px-4 py-3 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#2A3738] uppercase tracking-wide">
              Title / Role *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chief Cosmetic Specialist"
              className="px-4 py-3 bg-[#F4F5FB] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
            />
          </div>

          <ImageUploadField
            label="Founder Spotlight Photo"
            folder="founder"
            value={imagePath}
            onChange={(val) => setImagePath(val?.url || '')}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
