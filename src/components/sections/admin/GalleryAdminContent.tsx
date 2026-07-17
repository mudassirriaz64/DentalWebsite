'use client';

import React, { useState } from 'react';
import {
  GripVertical,
  Plus,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Copy,
  Trash,
  ChevronDown,
  Edit,
  Loader,
  MoreVertical,
} from 'lucide-react';
import { GalleryItem, GalleryCategory, GALLERY_CATEGORIES } from '@/types/gallery';
import { resolveImageUrl } from '@/lib/media';
import GalleryDrawer from './GalleryDrawer';
import { Reorder } from 'framer-motion';

interface GalleryAdminContentProps {
  initialItems: GalleryItem[];
}

export const GalleryAdminContent: React.FC<GalleryAdminContentProps> = ({ initialItems }) => {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Bulk selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action Menu dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Loading indicator for network updates
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' ? true : item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map((item) => item.id));
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

  // Drag-to-Reorder Handler with optimistic rollbacks
  const handleReorder = async (newOrder: GalleryItem[]) => {
    const previousItems = [...items];
    
    // Compute updated order values based on array index
    const updatedItems = newOrder.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));
    
    setItems(updatedItems);

    try {
      const res = await fetch('/api/admin/gallery/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedItems.map((x) => ({ id: x.id, displayOrder: x.displayOrder })),
        }),
      });

      if (!res.ok) {
        throw new Error('Sort order API failed');
      }
    } catch (err) {
      console.error(err);
      setItems(previousItems);
      alert('Failed to save sorting display orders. Reverting back to original layout...');
    }
  };

  // Inline Switch Visibility Toggle
  const handleToggleStatus = async (item: GalleryItem) => {
    setUpdatingId(item.id);
    const targetStatus = item.status === 'published' ? 'draft' : 'published';
    const previousItems = [...items];

    // Optimistic update
    setItems(
      items.map((x) => (x.id === item.id ? { ...x, status: targetStatus } : x))
    );

    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          status: targetStatus,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to toggle status');
      }
    } catch (err: any) {
      console.error(err);
      setItems(previousItems);
      alert(err.message || 'Failed to update visibility toggle. Please verify image requirements.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Form Save Actions
  const handleSaveItem = async (payload: any) => {
    try {
      if (editingItem) {
        // PATCH Edit
        const res = await fetch(`/api/admin/gallery/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update item');
        }

        const updated = await res.json();
        setItems(items.map((x) => (x.id === editingItem.id ? updated : x)));
      } else {
        // POST Add New
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create item');
        }

        const created = await res.json();
        setItems([...items, created]);
      }
      setIsDrawerOpen(false);
      setEditingItem(null);
    } catch (err) {
      throw err;
    }
  };

  // Single Item Deletes
  const handleDeleteOne = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this gallery case?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      setItems(items.filter((x) => x.id !== id));
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Duplicate case helper
  const handleDuplicate = async (item: GalleryItem) => {
    try {
      const payload = {
        variant: item.variant,
        title: `${item.title} (Copy)`,
        description: item.description,
        category: item.category,
        tags: item.tags || [],
        isVerifiedPatient: item.isVerifiedPatient,
        featured: false,
        status: 'draft', // duplicated items start as draft
        images: item.images,
      };

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to duplicate item');
      const duplicated = await res.json();
      setItems([...items, duplicated]);
    } catch (err) {
      alert('Failed to duplicate case profile.');
    }
  };

  // Bulk Publish / Unpublish Actions
  const handleBulkStatusChange = async (targetStatus: 'published' | 'draft') => {
    if (selectedIds.length === 0) return;
    setLoading(true);

    try {
      // Loop select actions sequentially
      for (const id of selectedIds) {
        const item = items.find((x) => x.id === id);
        if (!item || item.status === targetStatus) continue;

        await fetch(`/api/admin/gallery/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, status: targetStatus }),
        });
      }

      // Re-fetch all to ensure synchronization
      const res = await fetch('/api/admin/gallery');
      const refreshed = await res.json();
      setItems(refreshed);
      setSelectedIds([]);
      alert(`Successfully updated status for selected cases.`);
    } catch (err) {
      alert('Failed to process bulk status updates. Ensure images/alt-texts are fully valid.');
    } finally {
      setLoading(false);
    }
  };

  // Bulk deletes
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedIds.length} selected items?`)) return;

    setLoading(true);
    try {
      for (const id of selectedIds) {
        await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      }
      setItems(items.filter((x) => !selectedIds.includes(x.id)));
      setSelectedIds([]);
    } catch (err) {
      alert('Failed to delete some selected items.');
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex-1 flex flex-col font-sans p-6 text-sm">
      {/* Top action header bar */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">
            Gallery Case Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your patient transformations grid and before/after sliders.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsDrawerOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-teal-950 text-white font-bold transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Case
        </button>
      </header>

      {/* Filter panel options */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          {/* Title search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          {/* Category drop down */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-xs text-slate-600"
          >
            <option value="all">All Specialties</option>
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status drop down */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-xs text-slate-600"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        {/* Selected count bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex gap-2 items-center w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
            <span className="text-xs text-slate-500 font-semibold mr-2 shrink-0">
              {selectedIds.length} Selected
            </span>
            <button
              onClick={() => handleBulkStatusChange('published')}
              className="px-3 py-1.5 border bg-white hover:bg-slate-50 border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkStatusChange('draft')}
              className="px-3 py-1.5 border bg-white hover:bg-slate-50 border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Unpublish
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-accent-soft hover:bg-accent/15 text-accent rounded-lg text-xs font-bold cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Main Drag-Reorder Table container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
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
          <div className="col-span-1">Reorder</div>
          <div className="col-span-1">Thumbnail</div>
          <div className="col-span-4">Title / Description</div>
          <div className="col-span-2">Specialty</div>
          <div className="col-span-1 text-center">Shape</div>
          <div className="col-span-1 text-center">Visibility</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Dynamic Drag Reorder Rows */}
        <Reorder.Group
          axis="y"
          values={filteredItems}
          onReorder={handleReorder}
          className="divide-y divide-slate-50 overflow-y-auto max-h-[60vh] flex flex-col text-left"
        >
          {filteredItems.map((item) => {
            const isChecked = selectedIds.includes(item.id);
            const imageObj = item.images.main || item.images.after || item.images.before;
            const thumbUrl = imageObj ? resolveImageUrl(imageObj) : '';

            return (
              <Reorder.Item
                key={item.id}
                value={item}
                dragListener={true}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white hover:bg-slate-50/50 transition-colors ${
                  item.status === 'draft' ? 'opacity-85' : ''
                }`}
              >
                {/* Select Checkbox */}
                <div className="col-span-1 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                  />
                </div>

                {/* Drag Handle */}
                <div className="col-span-1 flex justify-start items-center pl-2">
                  <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="col-span-1">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border overflow-hidden relative">
                    {thumbUrl ? (
                      <img src={thumbUrl} className="object-cover w-full h-full" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                {/* Title / Description info */}
                <div className="col-span-4 flex flex-col gap-0.5">
                  <div className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                    {item.title}
                    {item.featured && (
                      <span className="text-[9px] uppercase bg-amber-50 text-amber-600 border border-amber-200/50 px-1.5 py-0.2 rounded font-bold">
                        PIN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-sans line-clamp-1">
                    {item.description}
                  </div>
                </div>

                {/* Category tag */}
                <div className="col-span-2">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    {item.category}
                  </span>
                </div>

                {/* Variant card variant style info */}
                <div className="col-span-1 text-center font-semibold text-[10px] text-slate-500">
                  {item.variant}
                </div>

                {/* Publish Toggle Button */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    disabled={updatingId === item.id}
                    className="cursor-pointer"
                  >
                    {updatingId === item.id ? (
                      <Loader className="w-4 h-4 animate-spin text-slate-400" />
                    ) : item.status === 'published' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-300 fill-slate-50" />
                    )}
                  </button>
                </div>

                {/* Inline Action Dropdown */}
                <div className="col-span-1 text-right flex justify-end gap-1.5 relative">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsDrawerOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-primary hover:bg-slate-100 rounded cursor-pointer"
                    title="Edit Case"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(item)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                    title="Duplicate Case"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOne(item.id)}
                    className="p-1 text-slate-400 hover:text-accent hover:bg-slate-100 rounded cursor-pointer"
                    title="Delete Case"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        {filteredItems.length === 0 && (
          <div className="py-24 text-center text-slate-400 font-sans">
            No gallery items found matching filters.
          </div>
        )}
      </div>

      {/* Editor Drawer */}
      <GalleryDrawer
        isOpen={isDrawerOpen}
        item={editingItem}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default GalleryAdminContent;
