'use client';

import React, { useState } from 'react';
import { Save, Plus, Trash2, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { SiteStat } from '@/types/reviews';

interface StatsAdminContentProps {
  initialStats: SiteStat[];
}

interface FormStatRow {
  id?: string;
  label: string;
  value: string;
}

export const StatsAdminContent: React.FC<StatsAdminContentProps> = ({ initialStats }) => {
  const [statsRows, setStatsRows] = useState<FormStatRow[]>(
    initialStats.map((s) => ({
      id: s.id,
      label: s.label,
      value: s.value,
    }))
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddRow = () => {
    setStatsRows([...statsRows, { label: '', value: '' }]);
  };

  const handleDeleteRow = (index: number) => {
    if (statsRows.length <= 1) {
      alert('You must have at least one site statistics row.');
      return;
    }
    setStatsRows(statsRows.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof FormStatRow, val: string) => {
    setStatsRows(
      statsRows.map((row, idx) => {
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
    for (let i = 0; i < statsRows.length; i++) {
      if (!statsRows[i].label.trim() || !statsRows[i].value.trim()) {
        return setErrorMsg(`Row ${i + 1} contains empty label names or value details.`);
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: statsRows.map((row) => ({
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
      const refetchRes = await fetch('/api/admin/stats');
      if (refetchRes.ok) {
        const refetched = await refetchRes.json();
        setStatsRows(
          refetched.map((s: SiteStat) => ({
            id: s.id,
            label: s.label,
            value: s.value,
          }))
        );
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
          Reviews Page Statistics Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure site metrics (e.g. Five Star Reviews, Happy Patients). These values load dynamically into the Reviews page Stats Bar.
        </p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl flex flex-col gap-6 text-left">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            Reviews statistics updated successfully! Public Stats Bar updated.
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
              Active Site Statistics
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
            {statsRows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-center p-3.5 bg-slate-50 rounded-xl border border-slate-150 relative animate-fade-in"
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
                    className="px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs font-bold text-slate-800"
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
                    className="px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
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
          className="w-fit flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-full text-xs px-8 py-3.5 bg-primary text-white hover:bg-teal-950 btn-diagonal-stripe shadow-md cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-4.5 h-4.5 animate-spin" /> Saving Configuration...
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
