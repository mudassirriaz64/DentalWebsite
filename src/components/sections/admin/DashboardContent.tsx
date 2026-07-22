'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Trash2, 
  X, 
  Plus, 
  Edit3,
  Search
} from 'lucide-react';

import ServiceForm from './ServiceForm';
import FounderSpotlightForm from './FounderSpotlightForm';
import ImageUploadField from '@/components/admin/ImageUploadField';

interface DashboardContentProps {
  username: string;
}

export default function DashboardContent({ username: _username }: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const viewParam = searchParams.get('view');
  const [activeTab, setActiveTab] = useState<'services' | 'doctors'>('services');
  const [doctorView, setDoctorView] = useState<'list' | 'spotlight'>('list');

  useEffect(() => {
    if (tabParam === 'doctors') {
      setActiveTab('doctors');
      setDoctorView(viewParam === 'spotlight' ? 'spotlight' : 'list');
    } else {
      setActiveTab('services');
      setDoctorView('list');
    }
  }, [tabParam, viewParam]);
  const [loading, setLoading] = useState(true);

  // Data states
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');

  // Editing / creation states
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields (Generic Container)
  const [formFields, setFormFields] = useState<any>({});

  // Load active tab data
  const fetchData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/admin/${activeTab}`);
      if (!res.ok) throw new Error(`Failed to fetch ${activeTab}`);
      const data = await res.json();
      if (activeTab === 'services') setServices(data);
      else if (activeTab === 'doctors') setDoctors(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Form open helpers
  const openCreateForm = () => {
    setEditingItem(null);
    setErrorMessage('');
    if (activeTab === 'services') {
      setFormFields({ title: '', shortDescription: '', description: '', slug: '', iconName: 'Sparkles', imagePath: '', bullets: [''], featured: false });
    } else if (activeTab === 'doctors') {
      setFormFields({ name: 'Dr. ', role: 'core-team', title: '', bio: '', imagePath: '/images/home/doctor-elena.png', specialties: [''], education: [''], featured: false });
    }
    setIsFormOpen(true);
  };

  const openEditForm = (item: any) => {
    setEditingItem(item);
    setErrorMessage('');
    if (activeTab === 'services') {
      setFormFields({ ...item });
    } else if (activeTab === 'doctors') {
      setFormFields({ ...item });
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const method = editingItem ? 'PATCH' : 'POST';
    const url = editingItem ? `/api/admin/${activeTab}/${editingItem.id}` : `/api/admin/${activeTab}`;

    let payload = { ...formFields };
    if (activeTab === 'services') {
      if (!payload.description || !payload.description.trim()) {
        payload.description = payload.shortDescription;
      }
      if (!payload.slug || !payload.slug.trim()) {
        payload.slug = payload.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
      }
      payload.bullets = (payload.bullets || []).map((b: string) => b.trim()).filter(Boolean);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit form');
      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting form');
    }
  };

  // Client-side filter for services
  const filteredServices = services.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.shortDescription || '').toLowerCase().includes(q)
    );
  });

  // Client-side filter for doctors
  const filteredDoctors = doctors.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.title || '').toLowerCase().includes(q) ||
      (d.specialties || []).some((s: string) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 overflow-hidden h-full">
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col font-sans p-6 text-sm">
          {/* Page Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">
                {activeTab === 'services'
                  ? 'Services Management'
                  : doctorView === 'spotlight'
                    ? 'Founder Spotlight'
                    : 'Doctors Management'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'services'
                  ? 'Manage treatment offerings, procedure highlights, and homepage featured services.'
                  : doctorView === 'spotlight'
                    ? 'The featured doctor displayed in the Team page hero section. Only one record exists.'
                    : 'Manage specialist profiles, display order, and professional credentials.'}
              </p>
            </div>
            {activeTab === 'services' || doctorView === 'list' ? (
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover transition shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New
              </button>
            ) : null}
          </header>

          {/* Doctor sub-tabs */}
          {activeTab === 'doctors' && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setDoctorView('list')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  doctorView === 'list'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Doctors
              </button>
              <button
                onClick={() => setDoctorView('spotlight')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  doctorView === 'spotlight'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Founder Spotlight
              </button>
            </div>
          )}

          {/* Filter Panel — hidden when spotlight sub-tab is active */}
          {!(activeTab === 'doctors' && doctorView === 'spotlight') && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={activeTab === 'services' ? 'Search services...' : 'Search doctors...'}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && doctorView === 'spotlight' ? (
            <FounderSpotlightForm />
          ) : loading ? (
            <div className="flex items-center justify-center h-64 text-sm text-slate-500">
              Loading administration records...
            </div>
          ) : errorMessage ? (
            <div className="p-6 rounded-2xl bg-accent-soft text-accent-dark border border-accent/10">
              {errorMessage}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">

              {/* SERVICES TABLE (CSS Grid) */}
              {activeTab === 'services' && (
                <>
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/75 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider select-none text-left">
                    <div className="col-span-4">Service Title</div>
                    <div className="col-span-2 text-center">Homepage Featured</div>
                    <div className="col-span-4">Procedure Highlights</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  <div className="divide-y divide-slate-50 overflow-y-auto max-h-[60vh] flex flex-col text-left">
                    {filteredServices.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No services found.
                      </div>
                    ) : (
                      filteredServices.map((s) => (
                        <div key={s.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white hover:bg-slate-50/50 transition-colors">
                          <div className="col-span-4">
                            <div className="font-bold text-slate-900">{s.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate" title={s.shortDescription}>
                              {s.shortDescription}
                            </div>
                          </div>
                          <div className="col-span-2 text-center text-xs">
                            {s.featured ? (
                              <span className="inline-flex items-center gap-1 font-bold text-accent bg-accent-soft px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                ★ Featured
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">Standard</span>
                            )}
                          </div>
                          <div className="col-span-4 text-xs">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(s.bullets || []).map((b: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-600">
                                  {b}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => openEditForm(s)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteItem(s.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-accent cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {activeTab === 'doctors' && doctorView === 'list' && (
                <>
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/75 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider select-none text-left">
                    <div className="col-span-3">Doctor Name</div>
                    <div className="col-span-1 text-center">Order</div>
                    <div className="col-span-4">Title / Specialties</div>
                    <div className="col-span-2">Photo Path</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  <div className="divide-y divide-slate-50 overflow-y-auto max-h-[60vh] flex flex-col text-left">
                    {filteredDoctors.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No doctor profiles found.
                      </div>
                    ) : (
                      filteredDoctors.map((d) => (
                        <div key={d.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white hover:bg-slate-50/50 transition-colors">
                          <div className="col-span-3">
                            <div className="font-bold text-slate-900">{d.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{d.bio}</div>
                          </div>
                          <div className="col-span-1 text-center text-xs font-semibold text-primary font-mono">#{d.displayOrder || 0}</div>
                          <div className="col-span-4 text-xs">
                            <div className="font-semibold text-slate-900">{d.title}</div>
                            <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                              {(d.specialties || []).map((s: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-600">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-2 text-xs text-slate-500 font-mono truncate max-w-[150px]">{d.imagePath}</div>
                          <div className="col-span-2 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => openEditForm(d)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteItem(d.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-accent cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

            </div>
          )}
        </div>
      </main>

      {/* FORM SLIDE-OVER DRAWER */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end text-slate-800">
          <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />

          <form
            onSubmit={handleFormSubmit}
            className="relative w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl overflow-hidden animate-slide-in-right z-10 text-left"
          >
            <header className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  {activeTab === 'services' ? 'Services Editor' : 'Doctors Editor'}
                </span>
                <h3 className="font-bold text-lg font-sans text-slate-900 leading-tight">
                  {editingItem ? 'Edit Existing Record' : 'Create New Record'}
                </h3>
              </div>
              <button type="button" onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-sm flex-1">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-accent-soft text-accent-dark font-semibold border border-accent/10">
                  {errorMessage}
                </div>
              )}

              {/* SERVICES FORM */}
              {activeTab === 'services' && (
                <ServiceForm fields={formFields} onChange={setFormFields} />
              )}

              {/* DOCTORS FORM */}
              {activeTab === 'doctors' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#333333] uppercase tracking-wide">Doctor Name</label>
                    <input
                      type="text"
                      required
                      value={formFields.name}
                      onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                      className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#333333] uppercase tracking-wide">Display Order Number</label>
                      <input
                        type="number"
                        value={formFields.displayOrder ?? 0}
                        onChange={(e) => setFormFields({ ...formFields, displayOrder: parseInt(e.target.value, 10) || 0 })}
                        className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                        placeholder="1"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#333333] uppercase tracking-wide">Professional Title</label>
                      <input
                        type="text"
                        required
                        value={formFields.title}
                        onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
                        className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                        placeholder="Implantology Specialist"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#333333] uppercase tracking-wide">Profile Bio Statement</label>
                    <textarea
                      required
                      rows={3}
                      value={formFields.bio}
                      onChange={(e) => setFormFields({ ...formFields, bio: e.target.value })}
                      className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs resize-none"
                    />
                  </div>
                  <ImageUploadField
                    label="Doctor Headshot / Photo Asset"
                    folder="doctors"
                    value={formFields.imagePath || ''}
                    onChange={(val) => setFormFields({ ...formFields, imagePath: val?.url || '' })}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#333333] uppercase tracking-wide">Specialties list (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(formFields.specialties) ? formFields.specialties.join(', ') : ''}
                      onChange={(e) => setFormFields({ ...formFields, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#333333] uppercase tracking-wide">Education list (comma separated, Optional)</label>
                    <input
                      type="text"
                      value={Array.isArray(formFields.education) ? formFields.education.join(', ') : ''}
                      onChange={(e) => setFormFields({ ...formFields, education: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="doctor-featured"
                      checked={formFields.featured || false}
                      onChange={(e) => setFormFields({ ...formFields, featured: e.target.checked })}
                      className="w-4 h-4 text-primary bg-slate-50 border-slate-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="doctor-featured" className="text-sm font-bold text-[#333333]">
                      Featured on About Page preview
                    </label>
                  </div>
                </>
              )}
            </div>

            <footer className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2 border rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-bold transition shadow cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Save Record
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}
