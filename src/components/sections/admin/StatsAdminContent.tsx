'use client';

import React, { useState } from 'react';
import { Save, Plus, Trash2, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { SiteStat } from '@/types/reviews';

interface StatsAdminContentProps {
  initialReviewsStats: SiteStat[];
  initialHomeStats: SiteStat[];
}

interface FormStatRow {
  id?: string;
  label: string;
  value: string;
}

export const StatsAdminContent: React.FC<StatsAdminContentProps> = ({
  initialReviewsStats,
  initialHomeStats,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'reviews'>('home');

  const [homeStats, setHomeStats] = useState<FormStatRow[]>(
    initialHomeStats.map((s) => ({
      id: s.id,
      label: s.label,
      value: s.value,
    }))
  );

  const [reviewsStats, setReviewsStats] = useState<FormStatRow[]>(
    initialReviewsStats.map((s) => ({
      id: s.id,
      label: s.label,
      value: s.value,
    }))
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentRows = activeTab === 'home' ? homeStats : reviewsStats;
  const setCurrentRows = activeTab === 'home' ? setHomeStats : setReviewsStats;

  const handleAddRow = () => {
    setCurrentRows([...currentRows, { label: '', value: '' }]);
  };

  const handleDeleteRow = (index: number) => {
    if (currentRows.length <= 1) {
      alert('You must have at least one site statistics row.');
      return;
    }
    setCurrentRows(currentRows.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof FormStatRow, val: string) => {
    setCurrentRows(
      currentRows.map((row, idx) => {
        if (idx === index) {
          return { ...row, [field]: val };
        }
        return row;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg('');

    // Validations
    const seenLabels = new Set<string>();
    for (let i = 0; i < currentRows.length; i++) {
      const label = currentRows[i].label.trim();
      const value = currentRows[i].value.trim();
      if (!label || !value) {
        return setErrorMsg(`Row ${i + 1} contains empty label names or value details.`);
      }
      const normLabel = label.toLowerCase();
      if (seenLabels.has(normLabel)) {
        return setErrorMsg(`Duplicate label "${label}" found. Each statistic must have a unique label.`);
      }
      seenLabels.add(normLabel);
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/stats?page=${activeTab}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: currentRows.map((row) => ({
            label: row.label,
            value: row.value,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update statistics.');
      }

      setSuccess(true);
      
      // Re-fetch current stats to reload IDs
      const refetchRes = await fetch(`/api/admin/stats?page=${activeTab}`);
      if (refetchRes.ok) {
        const refetched = await refetchRes.json();
        const updated = refetched.map((s: SiteStat) => ({
          id: s.id,
          label: s.label,
          value: s.value,
        }));
        if (activeTab === 'home') {
          setHomeStats(updated);
        } else {
          setReviewsStats(updated);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 font-sans text-sm text-slate-800">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">
          Site Statistics Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure site metrics that load dynamically across key pages (Home and Reviews).
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('home');
            setSuccess(false);
            setErrorMsg('');
          }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider relative -mb-px transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Home Page Stats
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('reviews');
            setSuccess(false);
            setErrorMsg('');
          }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider relative -mb-px transition-all cursor-pointer ${
            activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Reviews Page Stats
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl flex flex-col gap-6 text-left">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            Statistics updated successfully! Changes reflect on public pages immediately.
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-accent-soft text-accent border border-accent/10 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Stats Row list editor */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-serif font-bold text-lg text-primary">
              Active Site Statistics ({activeTab === 'home' ? 'Home Page' : 'Reviews Page'})
            </h2>
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stat Row
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {currentRows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-150 relative animate-fade-in"
              >
                {/* Stat value (e.g. 2,500+) */}
                <div className="col-span-4 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Stat Metric Value
                  </span>
                  <input
                    type="text"
                    required
                    value={row.value}
                    onChange={(e) => handleRowChange(index, 'value', e.target.value)}
                    placeholder="2,500+ or 99%"
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs font-bold text-slate-800"
                  />
                </div>

                {/* Stat label (e.g. Five Star Reviews) */}
                <div className="col-span-7 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Stat Metric Label
                  </span>
                  <input
                    type="text"
                    required
                    value={row.label}
                    onChange={(e) => handleRowChange(index, 'label', e.target.value)}
                    placeholder="Five Star Reviews"
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
                  />
                </div>

                {/* Delete button */}
                <div className="col-span-1 flex justify-center mt-3">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(index)}
                    className="p-1.5 text-slate-400 hover:text-accent hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Delete stat row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white disabled:opacity-50 transition shadow-sm cursor-pointer w-fit"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Saving Configuration...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Statistics
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default StatsAdminContent;
