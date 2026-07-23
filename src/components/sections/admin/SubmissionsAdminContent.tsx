'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Mail, 
  Trash2, 
  CheckSquare, 
  ChevronDown, 
  Download, 
  X, 
  Loader, 
  Phone, 
  Calendar,
  MessageSquare,
  Bookmark,
  Eye,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { ContactSubmission, SubmissionStatus } from '@/types/contact';
import PatientContactInfo from '@/components/shared/PatientContactInfo';

interface SubmissionsAdminContentProps {
  initialSubmissions: ContactSubmission[];
}

export const SubmissionsAdminContent: React.FC<SubmissionsAdminContentProps> = ({ initialSubmissions }) => {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);

  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, [initialSubmissions]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all');
  
  // Selected submissions for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Slide-over detail panel
  const [selectedSub, setSelectedSub] = useState<ContactSubmission | null>(null);
  
  // Note edit state
  const [internalNote, setInternalNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter list
  const filteredItems = submissions.filter((sub) => {
    const matchesSearch = 
      sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  // Open detail panel and auto-mark read
  const handleOpenDetail = async (sub: ContactSubmission) => {
    setSelectedSub(sub);
    setInternalNote(sub.internalNote || '');

    if (!sub.isRead) {
      // Optimistic update
      setSubmissions(submissions.map((x) => (x.id === sub.id ? { ...x, isRead: true } : x)));
      
      try {
        await fetch(`/api/admin/submissions/${sub.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        });
        router.refresh();
      } catch (err) {
        console.error('Failed to mark submission as read:', err);
      }
    }
  };

  // Update individual status
  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    setUpdatingId(id);
    const previous = [...submissions];
    setSubmissions(submissions.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
    if (selectedSub?.id === id) {
      setSelectedSub({ ...selectedSub, status: newStatus });
    }

    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Status update failed');
      router.refresh();
    } catch (err) {
      setSubmissions(previous);
      alert('Failed to update submission status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Save internal note
  const handleSaveNote = async () => {
    if (!selectedSub) return;
    setSavingNote(true);
    const previous = [...submissions];

    setSubmissions(submissions.map((x) => (x.id === selectedSub.id ? { ...x, internalNote } : x)));

    try {
      const res = await fetch(`/api/admin/submissions/${selectedSub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNote }),
      });

      if (!res.ok) throw new Error('Failed to save note');
      setSelectedSub({ ...selectedSub, internalNote });
      router.refresh();
      alert('Internal note updated successfully.');
    } catch (err) {
      setSubmissions(previous);
      alert('Failed to save internal note.');
    } finally {
      setSavingNote(false);
    }
  };

  // Delete individual submission
  const handleDeleteOne = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this submission record?')) return;
    
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      
      setSubmissions(submissions.filter((x) => x.id !== id));
      setSelectedIds(selectedIds.filter((x) => x !== id));
      if (selectedSub?.id === id) {
        setSelectedSub(null);
      }
      router.refresh();
    } catch (err) {
      alert('Failed to delete submission');
    }
  };

  // Bulk Actions
  const handleBulkStatusChange = async (newStatus: SubmissionStatus) => {
    if (selectedIds.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/submissions/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: newStatus }),
      });

      if (!res.ok) throw new Error('Bulk update failed');

      setSubmissions(
        submissions.map((x) => (selectedIds.includes(x.id) ? { ...x, status: newStatus } : x))
      );
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      alert('Failed to perform bulk status updates.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/submissions/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, isRead: true }),
      });

      if (!res.ok) throw new Error('Bulk read update failed');

      setSubmissions(
        submissions.map((x) => (selectedIds.includes(x.id) ? { ...x, isRead: true } : x))
      );
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      alert('Failed to mark submissions as read.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete the ${selectedIds.length} selected items?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/submissions/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) throw new Error('Bulk delete failed');

      setSubmissions(submissions.filter((x) => !selectedIds.includes(x.id)));
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      alert('Failed to delete selected submissions.');
    } finally {
      setLoading(false);
    }
  };

  // Export current filtered list as CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Service Interest', 'Email', 'Phone', 'Message', 'Status', 'Read Status', 'Internal Notes', 'Date Created'];
    const rows = filteredItems.map((item) => [
      item.fullName,
      item.serviceInterest,
      item.email,
      item.phone,
      item.message || '',
      item.status,
      item.isRead ? 'Read' : 'Unread',
      item.internalNote || '',
      new Date(item.createdAt).toLocaleString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      + [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contact_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: SubmissionStatus) => {
    const styles = {
      new: 'bg-green-50 text-green-700 border-green-200/50',
      contacted: 'bg-blue-50 text-blue-700 border-blue-200/50',
      scheduled: 'bg-purple-50 text-purple-700 border-purple-200/50',
      closed: 'bg-slate-100 text-slate-600 border-slate-200/30',
    };
    return `inline-flex px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${styles[status]}`;
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    }
    if (diffHrs < 24) {
      return `${diffHrs}h ago`;
    }
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex-1 flex flex-col font-sans p-6 text-sm">
      
      {/* Header Panel */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">
            Contact Submissions Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review patient information forms, assign scheduled dates, and log notes.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </header>

      {/* Filter panel options */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name/email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-xs text-slate-600 animate-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Selected count bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex gap-2 items-center w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
            <span className="text-xs text-slate-500 font-semibold mr-2 shrink-0">
              {selectedIds.length} Selected
            </span>
            <button
              onClick={handleBulkMarkRead}
              disabled={loading}
              className="px-3 py-1.5 border bg-white hover:bg-slate-50 border-slate-200 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {loading && <Loader className="w-3 h-3 animate-spin" />} Mark Read
            </button>
            
            <div className="relative inline-block text-left group">
              <button disabled={loading} className="px-3 py-1.5 border bg-white hover:bg-slate-50 border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {loading && <Loader className="w-3 h-3 animate-spin" />} Status <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 mt-1.5 w-32 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none hidden group-hover:block z-30 font-semibold text-xs border">
                <div className="p-1 flex flex-col">
                  {['new', 'contacted', 'scheduled', 'closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleBulkStatusChange(st as SubmissionStatus)}
                      disabled={loading}
                      className="text-left w-full px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 capitalize rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleBulkDelete}
              disabled={loading}
              className="px-3 py-1.5 bg-accent-soft hover:bg-accent/15 text-accent rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Main Table view */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1 w-full">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[960px]">
            {/* Table Headings */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/75 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider select-none text-left">
              <div className="col-span-1 flex items-center justify-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                />
              </div>
              <div className="col-span-1 text-center">Read</div>
              <div className="col-span-3">Patient Name / Email</div>
              <div className="col-span-3">Requested Treatment</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right">Age</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Dynamic Table Body */}
            <div className="divide-y divide-slate-50 overflow-y-auto max-h-[60vh] flex flex-col text-left font-sans">
              {filteredItems.map((sub) => {
                const isChecked = selectedIds.includes(sub.id);

                return (
                  <div
                    key={sub.id}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all ${
                      sub.isRead ? 'bg-white' : 'bg-primary-light/10 hover:bg-primary-light/20'
                    }`}
                  >
                    {/* Select Checkbox */}
                    <div className="col-span-1 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleSelectOne(sub.id, e.target.checked)}
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                      />
                    </div>

                    {/* Read status dot */}
                    <div className="col-span-1 flex justify-center">
                      {!sub.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" title="Unread query log" />
                      )}
                    </div>

                    {/* Patient Name / Email details */}
                    <div 
                      onClick={() => handleOpenDetail(sub)}
                      className="col-span-3 flex flex-col cursor-pointer"
                    >
                      <PatientContactInfo
                        name={sub.fullName}
                        email={sub.email}
                        phone={sub.phone}
                        whatsapp={sub.whatsapp}
                      />
                    </div>

                    {/* Treatment category choice */}
                    <div className="col-span-3">
                      <span className="font-semibold text-slate-700 text-xs">
                        {sub.serviceInterest}
                      </span>
                    </div>

                    {/* Status selector pill */}
                    <div className="col-span-2 text-center">
                      {updatingId === sub.id ? (
                        <Loader className="w-4 h-4 animate-spin text-slate-400 mx-auto" />
                      ) : (
                        <div className="relative inline-block group">
                          <button className={getStatusBadgeClass(sub.status)}>
                            {sub.status}
                          </button>
                          {/* Inline Status update triggers on hover */}
                          <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-28 rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none hidden group-hover:block z-30 font-semibold text-[10px] border">
                            <div className="p-1 flex flex-col">
                              {['new', 'contacted', 'scheduled', 'closed'].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleStatusChange(sub.id, st as SubmissionStatus)}
                                  className="text-left w-full px-2 py-1 hover:bg-slate-50 text-slate-600 rounded font-bold capitalize"
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Relative age */}
                    <div className="col-span-1 text-right text-xs text-slate-400 font-sans font-semibold">
                      {formatRelativeTime(sub.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 text-right flex justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenDetail(sub)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="View Full details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOne(sub.id)}
                        className="p-1.5 text-slate-400 hover:text-accent hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="py-24 text-center text-slate-400 font-sans">
                No submissions found matching criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SLIDE-OVER DETAIL DRAWER */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end text-slate-800">
          <div className="absolute inset-0" onClick={() => setSelectedSub(null)} />
          
          <div className="relative w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl overflow-hidden animate-slide-in-right z-10 text-left">
            
            {/* Header */}
            <header className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Submission Logs Detail
                </span>
                <h3 className="font-bold text-lg font-sans text-slate-900 leading-tight">
                  {selectedSub.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Panel details */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-sm">
              {/* Core Contact metadata */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Email Address</span>
                    <a href={`mailto:${selectedSub.email}`} className="text-xs font-semibold text-primary hover:underline line-clamp-1">
                      {selectedSub.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Phone Number</span>
                    <a href={`tel:${selectedSub.phone.replace(/\D/g, '')}`} className="text-xs font-semibold text-primary hover:underline">
                      {selectedSub.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mt-2">
                  <Bookmark className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Treatment Specialty</span>
                    <span className="text-xs font-bold text-slate-700">
                      {selectedSub.serviceInterest}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mt-2">
                  <MessageSquare className="w-4 h-4 text-green-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase text-slate-400">WhatsApp Contact</span>
                    {selectedSub.whatsapp ? (
                      <a
                        href={`https://wa.me/${selectedSub.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1"
                      >
                        {selectedSub.whatsapp} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No WhatsApp provided</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mt-2 col-span-2 border-t pt-2 border-slate-100">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Submitted Date</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {new Date(selectedSub.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Manager */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-500 text-[10px] uppercase tracking-wide">
                  Lead Status Pipeline
                </label>
                <div className="flex gap-2">
                  {['new', 'contacted', 'scheduled', 'closed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedSub.id, st as SubmissionStatus)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold capitalize transition-all cursor-pointer ${
                        selectedSub.status === st
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message text */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-500 text-[10px] uppercase tracking-wide">
                  Message details
                </label>
                <div className="p-4 bg-slate-50/75 rounded-2xl border text-xs leading-relaxed text-slate-700 font-sans whitespace-pre-line max-h-36 overflow-y-auto">
                  {selectedSub.message || <span className="text-slate-400 italic">No message text provided.</span>}
                </div>
              </div>

              {/* Admin note textarea */}
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-500 text-[10px] uppercase tracking-wide flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" /> Internal Note (Admin Only)
                  </label>
                  {selectedSub.internalNote && (
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">
                      Saved
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Record call logs, scheduling dates, or doctor details..."
                  className="px-4 py-3 bg-[#F0F0F0] border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs resize-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNote}
                  disabled={savingNote || internalNote === (selectedSub.internalNote || '')}
                  className="w-fit self-end flex items-center justify-center gap-1 px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-full text-xs font-bold transition shadow-sm cursor-pointer disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  {savingNote ? 'Saving Note...' : 'Save Notes'}
                </button>
              </div>

            </div>

            {/* Actions footer */}
            <footer className="p-6 border-t border-slate-100 flex justify-between bg-slate-50">
              <button
                type="button"
                onClick={() => handleDeleteOne(selectedSub.id)}
                className="px-4 py-2 border border-accent/20 bg-accent-soft hover:bg-accent/15 text-accent rounded-full text-xs font-bold transition cursor-pointer"
              >
                Delete Log
              </button>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2 bg-white border hover:bg-slate-50 text-slate-700 rounded-full text-xs font-bold transition cursor-pointer"
              >
                Close View
              </button>
            </footer>

          </div>
        </div>
      )}

    </div>
  );
};

export default SubmissionsAdminContent;
