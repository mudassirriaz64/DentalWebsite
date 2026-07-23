'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reorder } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Star, 
  Loader, 
  AlertCircle, 
  User, 
  Tag, 
  Bookmark, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Review, ReviewStatus } from '@/types/reviews';

interface ReviewsAdminContentProps {
  initialReviews: Review[];
}

export const ReviewsAdminContent: React.FC<ReviewsAdminContentProps> = ({ initialReviews }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Drawer edit state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Form states inside drawer
  const [patientName, setPatientName] = useState('');
  const [patientAvatarUrl, setPatientAvatarUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Cosmetic');
  const [treatmentType, setTreatmentType] = useState('');
  const [isVerifiedPatient, setIsVerifiedPatient] = useState(true);
  const [status, setStatus] = useState<ReviewStatus>('approved');
  const [featured, setFeatured] = useState(false);

  // Process indicators
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const categories = ['Implants', 'Cosmetic', 'General Care'];

  // Filter list
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch = 
      rev.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : rev.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' ? true : rev.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Re-order sorting constraint: drag reordering only makes sense when not filtering
  const canReorder = searchQuery === '' && statusFilter === 'all' && categoryFilter === 'all';

  // Handle Drag Reorder
  const handleReorder = async (newOrder: Review[]) => {
    // Optimistic state update
    setReviews(newOrder);

    try {
      await fetch('/api/admin/reviews/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newOrder.map((x) => x.id) }),
      });
    } catch (err) {
      console.error('Failed to save displayOrder:', err);
    }
  };

  // Open drawer for create
  const handleOpenCreate = () => {
    setEditingReview(null);
    setPatientName('');
    setPatientAvatarUrl('');
    setRating(5);
    setTitle('');
    setBody('');
    setCategory('Cosmetic');
    setTreatmentType('');
    setIsVerifiedPatient(true);
    setStatus('approved');
    setFeatured(false);
    setIsDrawerOpen(true);
  };

  // Open drawer for edit
  const handleOpenEdit = (rev: Review) => {
    setEditingReview(rev);
    setPatientName(rev.patientName);
    setPatientAvatarUrl(rev.patientAvatarUrl || '');
    setRating(rev.rating);
    setTitle(rev.title);
    setBody(rev.body);
    setCategory(rev.category);
    setTreatmentType(rev.treatmentType || '');
    setIsVerifiedPatient(rev.isVerifiedPatient);
    setStatus(rev.status);
    setFeatured(rev.featured);
    setIsDrawerOpen(true);
  };

  // Save drawer details (Create / Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return alert('Patient Name is required.');
    if (!title.trim()) return alert('Review Title is required.');
    if (body.trim().length < 10) return alert('Review text must be at least 10 characters.');

    setLoading(true);

    const payload = {
      patientName,
      patientAvatarUrl: patientAvatarUrl.trim() || null,
      rating,
      title,
      body,
      category,
      treatmentType: treatmentType.trim() || null,
      isVerifiedPatient,
      status,
      featured,
      displayOrder: editingReview?.displayOrder,
    };

    try {
      if (editingReview) {
        // Update Action
        const res = await fetch(`/api/admin/reviews/${editingReview.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Update failed');
        const data = await res.json();
        
        setReviews(reviews.map((x) => (x.id === editingReview.id ? {
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } : x)));
      } else {
        // Create Action
        const res = await fetch('/api/admin/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Create failed');
        const data = await res.json();
        setReviews([
          {
            ...data,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          },
          ...reviews,
        ]);
      }
      setIsDrawerOpen(false);
    } catch (err) {
      alert('Failed to save review details.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Approval (✓)
  const handleApprove = async (id: string) => {
    setActionId(id);
    const previous = [...reviews];
    setReviews(reviews.map((x) => (x.id === id ? { ...x, status: 'approved' } : x)));

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!res.ok) throw new Error('Status patch failed');
    } catch (err) {
      setReviews(previous);
      alert('Failed to approve review.');
    } finally {
      setActionId(null);
    }
  };

  // Quick Rejection (✗)
  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this patient review?')) return;
    
    setActionId(id);
    const previous = [...reviews];
    setReviews(reviews.map((x) => (x.id === id ? { ...x, status: 'rejected' } : x)));

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!res.ok) throw new Error('Status patch failed');
    } catch (err) {
      setReviews(previous);
      alert('Failed to reject review.');
    } finally {
      setActionId(null);
    }
  };

  // Quick Featured Toggle
  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    setActionId(id);
    const previous = [...reviews];
    setReviews(reviews.map((x) => (x.id === id ? { ...x, featured: !currentFeatured } : x)));

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (!res.ok) throw new Error('Featured toggle failed');
    } catch (err) {
      setReviews(previous);
      alert('Failed to update featured setting.');
    } finally {
      setActionId(null);
    }
  };

  // Delete Individual review
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');
      setReviews(reviews.filter((x) => x.id !== id));
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    const badges = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200/50',
      approved: 'bg-green-50 text-green-700 border-green-200/50',
      rejected: 'bg-red-50 text-red-700 border-red-200/50',
    };
    return `px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${badges[status]}`;
  };

  const renderRatingStars = (val: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < val ? 'text-[#FFB020] fill-[#FFB020]' : 'text-slate-200'
        }`}
      />
    ));
  };

  return (
    <div className="flex-1 flex flex-col font-sans p-6 text-sm text-slate-800">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">
            Reviews Moderation Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Approve or reject patient feedback, assign featured highlights, and edit reviews.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Add Review
        </button>
      </header>

      {/* Filter Options */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name/title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-xs text-slate-600 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-xs text-slate-600 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {canReorder && (
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none shrink-0">
            ⇅ Drag handle to sort approved reviews
          </span>
        )}
      </div>

      {/* Main Table view */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1 w-full">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[960px]">
            {/* Table headings */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/75 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider select-none text-left">
              <div className="col-span-1 text-center">Reorder</div>
              <div className="col-span-2">Patient</div>
              <div className="col-span-3">Review Detail</div>
              <div className="col-span-2 text-center">Category</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Featured</div>
              <div className="col-span-2 text-right">Moderation</div>
            </div>

            {/* Dynamic Drag Reorder List */}
            {canReorder ? (
              <Reorder.Group
                values={filteredReviews}
                onReorder={handleReorder}
                className="divide-y divide-slate-50 overflow-y-auto max-h-[60vh] flex flex-col text-left"
              >
                {filteredReviews.map((rev) => (
                  <Reorder.Item
                    key={rev.id}
                    value={rev}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white hover:bg-slate-50/50 transition-colors select-none"
                  >
                    {/* Drag handle */}
                    <div className="col-span-1 flex items-center justify-center cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 font-semibold">
                      ☰
                    </div>

                    {/* Patient Profile */}
                    <div className="col-span-2 flex flex-col">
                      <span className="font-bold text-slate-900 leading-tight">
                        {rev.patientName}
                      </span>
                      {rev.treatmentType && (
                        <span className="text-[10px] text-slate-400 font-sans mt-0.5 leading-none">
                          {rev.treatmentType}
                        </span>
                      )}
                    </div>

                    {/* Title & Body review content */}
                    <div className="col-span-3 flex flex-col cursor-pointer" onClick={() => handleOpenEdit(rev)}>
                      <div className="flex gap-1 mb-1">
                        {renderRatingStars(rev.rating)}
                      </div>
                      <span className="font-bold text-slate-800 text-xs truncate">
                        {rev.title}
                      </span>
                      <p className="text-[10px] text-slate-500 line-clamp-1 font-sans mt-0.5">
                        {rev.body}
                      </p>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-bold text-[10px]">
                        {rev.category}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 text-center">
                      <span className={getStatusBadge(rev.status)}>
                        {rev.status}
                      </span>
                    </div>

                    {/* Featured indicator */}
                    <div className="col-span-1 flex justify-center">
                      {rev.status === 'approved' ? (
                        <button
                          onClick={() => handleToggleFeatured(rev.id, rev.featured)}
                          className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                            rev.featured
                              ? 'text-[#FFB020] hover:text-yellow-500'
                              : 'text-slate-200 hover:text-slate-400'
                          }`}
                          title={rev.featured ? 'Featured case' : 'Mark featured'}
                        >
                          <Star className={`w-4 h-4 ${rev.featured ? 'fill-[#FFB020]' : ''}`} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 select-none">-</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end items-center gap-1.5 text-right">
                      {rev.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(rev.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg cursor-pointer"
                            title="Approve Review"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(rev.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Reject Review"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-slate-400 hover:text-accent hover:bg-slate-50 rounded-lg cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              /* Normal static list (when filters are active) */
              <div className="divide-y divide-slate-50 overflow-y-auto max-h-[60vh] flex flex-col text-left">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="col-span-1 text-center text-slate-300 font-sans text-xs font-semibold select-none">
                      -
                    </div>

                    <div className="col-span-2 flex flex-col">
                      <span className="font-bold text-slate-900 leading-tight">
                        {rev.patientName}
                      </span>
                      {rev.treatmentType && (
                        <span className="text-[10px] text-slate-400 font-sans mt-0.5 leading-none">
                          {rev.treatmentType}
                        </span>
                      )}
                    </div>

                    <div className="col-span-3 flex flex-col cursor-pointer" onClick={() => handleOpenEdit(rev)}>
                      <div className="flex gap-1 mb-1">
                        {renderRatingStars(rev.rating)}
                      </div>
                      <span className="font-bold text-slate-800 text-xs truncate">
                        {rev.title}
                      </span>
                      <p className="text-[10px] text-slate-500 line-clamp-1 font-sans mt-0.5">
                        {rev.body}
                      </p>
                    </div>

                    <div className="col-span-2 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-bold text-[10px]">
                        {rev.category}
                      </span>
                    </div>

                    <div className="col-span-1 text-center">
                      <span className={getStatusBadge(rev.status)}>
                        {rev.status}
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      {rev.status === 'approved' ? (
                        <button
                          onClick={() => handleToggleFeatured(rev.id, rev.featured)}
                          className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                            rev.featured
                              ? 'text-[#FFB020] hover:text-yellow-500'
                              : 'text-slate-200 hover:text-slate-400'
                          }`}
                          title={rev.featured ? 'Featured case' : 'Mark featured'}
                        >
                          <Star className={`w-4 h-4 ${rev.featured ? 'fill-[#FFB020]' : ''}`} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 select-none">-</span>
                      )}
                    </div>

                    <div className="col-span-2 flex justify-end items-center gap-1.5 text-right">
                      {rev.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(rev.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg cursor-pointer"
                            title="Approve Review"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(rev.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Reject Review"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-slate-400 hover:text-accent hover:bg-slate-50 rounded-lg cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredReviews.length === 0 && (
              <div className="py-24 text-center text-slate-400 font-sans font-semibold">
                No reviews found matching filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT/ADD SLIDE-OVER DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end text-slate-800">
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />

          <form
            onSubmit={handleSave}
            className="relative w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl overflow-hidden animate-slide-in-right z-10 text-left"
          >
            {/* Header */}
            <header className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Reviews Workspace
                </span>
                <h3 className="font-bold text-lg font-sans text-slate-900 leading-tight">
                  {editingReview ? 'Edit Patient Review' : 'Create New Review'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Content panel */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333333] uppercase">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>

                {/* Avatar Url */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333333] uppercase">Avatar Image Path</label>
                  <input
                    type="text"
                    value={patientAvatarUrl}
                    onChange={(e) => setPatientAvatarUrl(e.target.value)}
                    placeholder="/images/reviews/avatar.png"
                    className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333333] uppercase">Category *</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Treatment Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333333] uppercase">Treatment Details</label>
                  <input
                    type="text"
                    value={treatmentType}
                    onChange={(e) => setTreatmentType(e.target.value)}
                    placeholder="Porcelain Veneers"
                    className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Rating picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333333] uppercase">Star Rating *</label>
                  <div className="flex gap-1.5 items-center py-1 select-none">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRating(val)}
                        className="text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            val <= rating ? 'text-[#FFB020] fill-[#FFB020]' : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status select dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333333] uppercase">Moderation Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                    className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
                  >
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Approved / Public</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#333333] uppercase">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brighter teeth in one visit"
                  className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#333333] uppercase">Review Text Content *</label>
                <textarea
                  rows={5}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Review text description..."
                  className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-3 mt-1 pl-1">
                <label className="flex items-center gap-2 select-none text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerifiedPatient}
                    onChange={(e) => setIsVerifiedPatient(e.target.checked)}
                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                  Verified Patient
                </label>

                {status === 'approved' && (
                  <label className="flex items-center gap-2 select-none text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    Featured (Pink Card layout)
                  </label>
                )}
              </div>
            </div>

            {/* Footer action */}
            <footer className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2 border rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-bold transition shadow cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Review'
                )}
              </button>
            </footer>
          </form>
        </div>
      )}

    </div>
  );
};

export default ReviewsAdminContent;
