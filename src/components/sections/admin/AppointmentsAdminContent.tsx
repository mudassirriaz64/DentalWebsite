'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckSquare,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Service, Doctor } from '@/types';

interface AppointmentsAdminContentProps {
  services: Service[];
  doctors: Doctor[];
}

export const AppointmentsAdminContent: React.FC<AppointmentsAdminContentProps> = ({ services, doctors }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState('confirmed');

  // Detail Modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [detailStatus, setDetailStatus] = useState('pending');
  const [internalNote, setInternalNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();
      if (activeStatus !== 'all') params.set('status', activeStatus);
      if (selectedService !== 'all') params.set('serviceId', selectedService);
      if (selectedDoctor !== 'all') params.set('doctorId', selectedDoctor);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeStatus, selectedService, selectedDoctor]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handleOpenDetail = async (item: any) => {
    setSelectedItem(item);
    setDetailStatus(item.status);
    setInternalNote(item.internalNote || '');

    // Auto mark as read if unread
    if (!item.isRead) {
      try {
        await fetch(`/api/admin/appointments/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        });
        setAppointments((prev) =>
          prev.map((a) => (a.id === item.id ? { ...a, isRead: true } : a))
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSaveDetail = async () => {
    if (!selectedItem) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/appointments/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: detailStatus,
          internalNote,
        }),
      });
      if (!res.ok) throw new Error('Failed to update appointment');
      const updated = await res.json();

      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setSelectedItem(null);
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment request?')) return;
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(appointments.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: 'markRead' | 'updateStatus' | 'delete') => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !confirm(`Delete ${selectedIds.length} selected appointments?`)) return;

    try {
      const res = await fetch('/api/admin/appointments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          action,
          status: action === 'updateStatus' ? bulkStatus : undefined,
        }),
      });

      if (!res.ok) throw new Error('Bulk action failed');
      setSelectedIds([]);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px]">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'rescheduled':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[10px]">
            <RefreshCw className="w-3 h-3" /> Rescheduled
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full text-[10px]">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full text-[10px]">
            <CheckSquare className="w-3 h-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-[10px]">
            <AlertCircle className="w-3 h-3 text-amber-500" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 text-left font-sans max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-slate-900">
            Appointment Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage online patient consultation requests and schedule assignments.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Requests
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 flex flex-col gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          {['all', 'pending', 'confirmed', 'rescheduled', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                activeStatus === st
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Dropdowns & Search Input */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Specialists</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </form>
      </div>

      {/* Bulk Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 select-none">
          <span className="text-xs font-bold text-primary">
            {selectedIds.length} appointment(s) selected
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleBulkAction('markRead')}
              className="px-3.5 py-1.5 rounded-lg bg-white border text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Mark Read
            </button>

            <div className="flex items-center gap-2">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white border text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="confirmed">Confirmed</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => handleBulkAction('updateStatus')}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover cursor-pointer"
              >
                Apply Status
              </button>
            </div>

            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4 pl-6 w-10">
                  <input
                    type="checkbox"
                    checked={
                      appointments.length > 0 && selectedIds.length === appointments.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="p-4">Patient Info</th>
                <th className="p-4">Requested Service</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Date & Time Preference</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No appointment requests found matching filters.
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr
                    key={a.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      !a.isRead ? 'bg-amber-50/30 font-semibold' : ''
                    }`}
                  >
                    <td className="p-4 pl-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(a.id)}
                        onChange={() => handleSelectRow(a.id)}
                        className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {!a.isRead && (
                          <span className="w-2 h-2 rounded-full bg-accent shrink-0" title="Unread" />
                        )}
                        {a.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{a.email}</div>
                      <div className="text-[11px] text-slate-500">{a.phone}</div>
                    </td>

                    <td className="p-4 font-bold text-primary">
                      {a.service?.title || 'Unknown Service'}
                    </td>

                    <td className="p-4 text-slate-700">
                      {a.doctor ? (
                        <span className="font-semibold text-slate-900">{a.doctor.name}</span>
                      ) : (
                        <span className="text-slate-400 italic">No preference</span>
                      )}
                    </td>

                    <td className="p-4">
                      {a.preferredDate ? (
                        <div className="font-semibold text-slate-800">
                          {new Date(a.preferredDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-slate-400 italic">No date specified</div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                        {a.preferredTime || 'Any Time'}
                      </div>
                    </td>

                    <td className="p-4">{getStatusBadge(a.status)}</td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenDetail(a)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOne(a.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
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
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Appointment Details
                </span>
                <h3 className="font-bold text-lg font-sans text-slate-900">
                  {selectedItem.patientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Service</span>
                  <span className="font-bold text-primary text-sm mt-0.5 block">
                    {selectedItem.service?.title}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Doctor</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {selectedItem.doctor ? selectedItem.doctor.name : 'No Preference'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>{selectedItem.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{selectedItem.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {selectedItem.preferredDate
                      ? new Date(selectedItem.preferredDate).toLocaleDateString()
                      : 'No date requested'}{' '}
                    ({selectedItem.preferredTime || 'Any Time'})
                  </span>
                </div>
              </div>

              {selectedItem.notes && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Patient Notes:</span>
                  <div className="p-3 bg-slate-50 border rounded-xl text-slate-700 leading-relaxed">
                    {selectedItem.notes}
                  </div>
                </div>
              )}

              {/* Status Selector */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-800">Update Status</label>
                <select
                  value={detailStatus}
                  onChange={(e) => setDetailStatus(e.target.value)}
                  className="px-4 py-2.5 bg-slate-50 border rounded-xl font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Internal Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Internal Clinic Notes (Private)</label>
                <textarea
                  rows={3}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add private staff notes, appointment confirmation details..."
                  className="px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 resize-none"
                />
              </div>
            </div>

            <footer className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDetail}
                disabled={updating}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover cursor-pointer disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsAdminContent;
