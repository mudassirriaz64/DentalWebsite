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

interface DashboardContentProps {
  username: string;
}

export default function DashboardContent({ username }: DashboardContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'appointments' | 'contacts' | 'services' | 'doctors' | 'reviews'>('appointments');

  useEffect(() => {
    if (tabParam === 'contacts') setActiveTab('contacts');
    else if (tabParam === 'services') setActiveTab('services');
    else if (tabParam === 'doctors') setActiveTab('doctors');
    else if (tabParam === 'reviews') setActiveTab('reviews');
    else setActiveTab('appointments');
  }, [tabParam]);
  const [loading, setLoading] = useState(true);

  // Data states
  const [appointments, setAppointments] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

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
      if (activeTab === 'appointments') setAppointments(data);
      else if (activeTab === 'contacts') setContacts(data);
      else if (activeTab === 'services') setServices(data);
      else if (activeTab === 'doctors') setDoctors(data);
      else if (activeTab === 'reviews') setReviews(data);
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

  // Appointments actions
  const updateAppointmentStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    } catch (err: any) {
      alert(err.message);
    }
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
      setFormFields({ title: '', shortDescription: '', description: '', slug: '', iconName: 'Sparkles', variant: 'white-card', bullets: [''] });
    } else if (activeTab === 'doctors') {
      setFormFields({ name: '', role: 'core-team', title: '', bio: '', imagePath: '/images/home/doctor-elena.png', specialties: [''], education: [''] });
    } else if (activeTab === 'reviews') {
      setFormFields({ author: '', role: '', rating: 5, text: '', date: new Date().toISOString().split('T')[0] });
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
    } else if (activeTab === 'reviews') {
      setFormFields({ ...item });
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const method = editingItem ? 'PATCH' : 'POST';
    const url = editingItem ? `/api/admin/${activeTab}/${editingItem.id}` : `/api/admin/${activeTab}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields),
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
            {activeTab === 'contacts' ? 'Contact Submissions' : `${activeTab} Management`}
          </h2>
          {['services', 'doctors', 'reviews'].includes(activeTab) && (
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

              {/* 1. APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-bg-alt text-body-text font-bold text-xs uppercase border-b border-slate-100">
                        <th className="p-4 pl-6">Client</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-body-text">No appointments found.</td>
                        </tr>
                      ) : (
                        appointments.map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6 font-bold text-dark-text">{a.name}</td>
                            <td className="p-4 text-xs text-body-text">
                              <div>{a.email}</div>
                              <div className="mt-0.5">{a.phone}</div>
                            </td>
                            <td className="p-4 text-xs font-semibold text-primary">{a.service?.title || 'Unknown'}</td>
                            <td className="p-4 text-xs text-dark-text">
                              <div className="font-bold">{new Date(a.preferredDate).toLocaleDateString()}</div>
                              <div className="text-body-text mt-0.5">{a.preferredTime}</div>
                            </td>
                            <td className="p-4 text-xs text-body-text max-w-xs truncate" title={a.message}>{a.message || '—'}</td>
                            <td className="p-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                a.status === 'confirmed' ? 'bg-primary-light text-[#002020]' :
                                a.status === 'cancelled' ? 'bg-accent-soft text-accent-dark' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {a.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right flex justify-end gap-1.5 mt-1.5">
                              {a.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateAppointmentStatus(a.id, 'confirmed')}
                                    className="p-1.5 rounded-lg bg-primary-light text-primary hover:bg-primary-light/80 cursor-pointer"
                                    title="Confirm"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => updateAppointmentStatus(a.id, 'cancelled')}
                                    className="p-1.5 rounded-lg bg-accent-soft text-accent hover:bg-accent-soft/80 cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => deleteItem(a.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-accent cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 2. SUBMISSIONS */}
              {activeTab === 'contacts' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-bg-alt text-body-text font-bold text-xs uppercase border-b border-slate-100">
                        <th className="p-4 pl-6">Sender</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Date Submitted</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-body-text">No submissions found.</td>
                        </tr>
                      ) : (
                        contacts.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6 font-bold text-dark-text">{c.name}</td>
                            <td className="p-4 text-xs text-body-text">
                              <div>{c.email}</div>
                              <div className="mt-0.5">{c.phone || '—'}</div>
                            </td>
                            <td className="p-4 text-xs text-body-text whitespace-pre-wrap max-w-md">{c.message}</td>
                            <td className="p-4 text-xs text-dark-text">{new Date(c.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() => deleteItem(c.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-accent cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3. SERVICES */}
              {activeTab === 'services' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-bg-alt text-body-text font-bold text-xs uppercase border-b border-slate-100">
                        <th className="p-4 pl-6">Service Title</th>
                        <th className="p-4">Slug</th>
                        <th className="p-4">Icon & Variant</th>
                        <th className="p-4">Bullets</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-body-text">No services found.</td>
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
                            <td className="p-4 text-xs font-mono text-slate-600">{s.slug}</td>
                            <td className="p-4 text-xs text-body-text">
                              <div>Icon: <span className="font-semibold text-primary">{s.iconName}</span></div>
                              <div className="mt-0.5">Card: <span className="font-semibold">{s.variant || 'Default'}</span></div>
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
                        <th className="p-4">App Role</th>
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
                            <td className="p-4 text-xs font-semibold text-primary capitalize">{d.role.replace('-', ' ')}</td>
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

              {/* 5. REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-bg-alt text-body-text font-bold text-xs uppercase border-b border-slate-100">
                        <th className="p-4 pl-6">Reviewer</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Review Text</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {reviews.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-body-text">No reviews found.</td>
                        </tr>
                      ) : (
                        reviews.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6">
                              <div className="font-bold text-dark-text">{r.author}</div>
                              <div className="text-xs text-body-text mt-0.5">{r.role || '—'}</div>
                            </td>
                            <td className="p-4 text-xs font-bold text-amber-500">{'★'.repeat(r.rating)}</td>
                            <td className="p-4 text-xs text-body-text max-w-sm truncate" title={r.text}>{r.text}</td>
                            <td className="p-4 text-xs text-dark-text">{r.date || '—'}</td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => openEditForm(r)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-primary cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteItem(r.id)}
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
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Title</label>
                    <input
                      type="text"
                      required
                      value={formFields.title}
                      onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Slug (lowercase, no spaces)</label>
                    <input
                      type="text"
                      required
                      value={formFields.slug}
                      onChange={(e) => setFormFields({ ...formFields, slug: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Short Description</label>
                    <textarea
                      required
                      rows={2}
                      value={formFields.shortDescription}
                      onChange={(e) => setFormFields({ ...formFields, shortDescription: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Full Description</label>
                    <textarea
                      required
                      rows={4}
                      value={formFields.description}
                      onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Icon Name</label>
                      <input
                        type="text"
                        required
                        value={formFields.iconName}
                        onChange={(e) => setFormFields({ ...formFields, iconName: e.target.value })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Variant Card Theme</label>
                      <select
                        value={formFields.variant}
                        onChange={(e) => setFormFields({ ...formFields, variant: e.target.value })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="white-card">White Card</option>
                        <option value="large-image-card">Large Image Card</option>
                        <option value="dark-teal-card">Dark Teal Card</option>
                        <option value="accent-pink-card">Accent Pink Card</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Image Path (Optional)</label>
                    <input
                      type="text"
                      value={formFields.imagePath || ''}
                      onChange={(e) => setFormFields({ ...formFields, imagePath: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Cta Label (Optional)</label>
                    <input
                      type="text"
                      value={formFields.ctaLabel || ''}
                      onChange={(e) => setFormFields({ ...formFields, ctaLabel: e.target.value })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Bullets list (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(formFields.bullets) ? formFields.bullets.join(', ') : ''}
                      onChange={(e) => setFormFields({ ...formFields, bullets: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Fluoride, Veneers, Cleanings"
                    />
                  </div>
                </>
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
                      <label className="font-bold text-dark-text">Roster Role Category</label>
                      <select
                        value={formFields.role}
                        onChange={(e) => setFormFields({ ...formFields, role: e.target.value })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="visionary">Visionary (About Page)</option>
                        <option value="department-head">Department Head</option>
                        <option value="core-team">Core Team</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Professional Title</label>
                      <input
                        type="text"
                        required
                        value={formFields.title}
                        onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Head of Implantology"
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

              {/* REVIEWS FORM */}
              {activeTab === 'reviews' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Reviewer Name</label>
                      <input
                        type="text"
                        required
                        value={formFields.author}
                        onChange={(e) => setFormFields({ ...formFields, author: e.target.value })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Patient Description</label>
                      <input
                        type="text"
                        value={formFields.role || ''}
                        onChange={(e) => setFormFields({ ...formFields, role: e.target.value })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Invisalign Patient"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Star Rating (1 - 5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        required
                        value={formFields.rating}
                        onChange={(e) => setFormFields({ ...formFields, rating: parseInt(e.target.value) || 5 })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-dark-text">Date Posted</label>
                      <input
                        type="date"
                        required
                        value={formFields.date}
                        onChange={(e) => setFormFields({ ...formFields, date: e.target.value })}
                        className="px-4 py-2.5 bg-bg-alt border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-dark-text">Review Text Body</label>
                    <textarea
                      required
                      rows={4}
                      value={formFields.text}
                      onChange={(e) => setFormFields({ ...formFields, text: e.target.value })}
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
