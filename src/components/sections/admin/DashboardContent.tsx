'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { 
  Calendar, 
  Mail, 
  Sparkles, 
  Users, 
  MessageSquare, 
  LogOut, 
  Trash2, 
  Check, 
  X, 
  Plus, 
  Edit3,
  ExternalLink
} from 'lucide-react';

import ServiceForm from './ServiceForm';

interface DashboardContentProps {
  username: string;
}

export default function DashboardContent({ username }: DashboardContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'services' | 'doctors'>('services');

  useEffect(() => {
    if (tabParam === 'doctors') setActiveTab('doctors');
    else setActiveTab('services');
  }, [tabParam]);
  const [loading, setLoading] = useState(true);

  // Data states
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

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

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };


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
      setFormFields({ name: '', role: 'core-team', title: '', bio: '', imagePath: '/images/home/doctor-elena.png', specialties: [''], education: [''] });
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

  return (
    <div className="flex-grow flex flex-col bg-bg-alt text-dark-text overflow-hidden h-full">
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-100 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold font-sans text-dark-text capitalize">
            {activeTab} Management
          </h2>
          {['services', 'doctors'].includes(activeTab) && (
            <button
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#B51E47] text-white hover:bg-accent-hover transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          )}
        </header>

        <div className="p-8 flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-sm text-body-text">
              Loading administration records...
            </div>
          ) : errorMessage ? (
            <div className="p-6 rounded-2xl bg-accent-soft text-accent-dark border border-accent/10">
              {errorMessage}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {/* TABLE RENDERERS */}



              {/* 3. SERVICES */}
              {activeTab === 'services' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-bg-alt text-body-text font-bold text-xs uppercase border-b border-slate-100">
                        <th className="p-4 pl-6">Service Title</th>
                        <th className="p-4">Homepage Featured</th>
                        <th className="p-4">Procedure Highlights</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-body-text">No services found.</td>
                        </tr>
                      ) : (
                        services.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6">
                              <div className="font-bold text-dark-text">{s.title}</div>
                              <div className="text-xs text-body-text mt-0.5 max-w-xs truncate" title={s.shortDescription}>
                                {s.shortDescription}
                              </div>
                            </td>
                            <td className="p-4 text-xs">
                              {s.featured ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-accent bg-accent-soft px-2.5 py-1 rounded-full text-[11px]">
                                  ★ Featured
                                </span>
                              ) : (
                                <span className="text-slate-400 font-normal">Standard</span>
                              )}
                            </td>
                            <td className="p-4 text-xs">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {(s.bullets || []).map((b: string, idx: number) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-bg-alt border text-[10px] text-body-text">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 pr-6 text-right">
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
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 4. DOCTORS */}
              {activeTab === 'doctors' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-bg-alt text-body-text font-bold text-xs uppercase border-b border-slate-100">
                        <th className="p-4 pl-6">Doctor Name</th>
                        <th className="p-4">Display Order</th>
                        <th className="p-4">Title / Specialties</th>
                        <th className="p-4">Photo Path</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {doctors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-body-text">No doctor profiles found.</td>
                        </tr>
                      ) : (
                        doctors.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6">
                              <div className="font-bold text-dark-text">{d.name}</div>
                              <div className="text-xs text-body-text mt-0.5 max-w-xs truncate">{d.bio}</div>
                            </td>
                            <td className="p-4 text-xs font-semibold text-primary font-mono">#{d.displayOrder || 0}</td>
                            <td className="p-4 text-xs">
                              <div className="font-semibold text-dark-text">{d.title}</div>
                              <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                                {(d.specialties || []).map((s: string, idx: number) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-bg-alt border text-[9px] text-body-text">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-xs text-body-text font-mono truncate max-w-[150px]">{d.imagePath}</td>
                            <td className="p-4 pr-6 text-right">
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
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}


            </div>
          )}
        </div>
      </main>

      {/* FORM MODAL (CRUD Editor) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            <header className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg font-sans">
                {editingItem ? 'Edit Existing Record' : 'Create New Record'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-dark-text cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-sm">
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
                    <label className="font-bold text-dark-text">Doctor Name</label>
                    <input
                      type="text"
                      required
                      value={formFields.name}
                      onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Display Order Number</label>
                      <input
                        type="number"
                        value={formFields.displayOrder ?? 0}
                        onChange={(e) => setFormFields({ ...formFields, displayOrder: parseInt(e.target.value, 10) || 0 })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="1"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Professional Title</label>
                      <input
                        type="text"
                        required
                        value={formFields.title}
                        onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Implantology Specialist"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Profile Bio Statement</label>
                    <textarea
                      required
                      rows={3}
                      value={formFields.bio}
                      onChange={(e) => setFormFields({ ...formFields, bio: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Photo Asset Path</label>
                    <input
                      type="text"
                      required
                      value={formFields.imagePath}
                      onChange={(e) => setFormFields({ ...formFields, imagePath: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Specialties list (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(formFields.specialties) ? formFields.specialties.join(', ') : ''}
                      onChange={(e) => setFormFields({ ...formFields, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Education list (comma separated, Optional)</label>
                    <input
                      type="text"
                      value={Array.isArray(formFields.education) ? formFields.education.join(', ') : ''}
                      onChange={(e) => setFormFields({ ...formFields, education: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}



              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-white hover:bg-teal-900 transition cursor-pointer font-semibold shadow-sm"
                >
                  Save Record
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
