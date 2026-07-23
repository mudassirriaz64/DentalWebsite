'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, User, LogOut, Settings as SettingsIcon, MessageSquare, Calendar, FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GlobalAdminHeader() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    unreadAppointments: 0,
    unreadSubmissions: 0,
    pendingReviews: 0,
  });
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalNotifications = 
    notifications.unreadAppointments + 
    notifications.unreadSubmissions + 
    notifications.pendingReviews;

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-end px-6 shrink-0 relative z-40">
      <div className="flex items-center gap-4">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors relative cursor-pointer text-slate-500 hover:text-slate-700"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {totalNotifications === 0 ? (
                  <p className="p-4 text-center text-sm text-slate-500">No new notifications</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {notifications.unreadAppointments > 0 && (
                      <Link 
                        href="/admin/appointments"
                        onClick={() => setIsNotifOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">New Appointments</p>
                          <p className="text-xs text-slate-500">{notifications.unreadAppointments} unread requests</p>
                        </div>
                      </Link>
                    )}
                    {notifications.pendingReviews > 0 && (
                      <Link 
                        href="/admin/reviews"
                        onClick={() => setIsNotifOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Pending Reviews</p>
                          <p className="text-xs text-slate-500">{notifications.pendingReviews} waiting for approval</p>
                        </div>
                      </Link>
                    )}
                    {notifications.unreadSubmissions > 0 && (
                      <Link 
                        href="/admin/submissions"
                        onClick={() => setIsNotifOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">New Submissions</p>
                          <p className="text-xs text-slate-500">{notifications.unreadSubmissions} unread contacts</p>
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button 
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {isUserOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 py-2">
              <div className="px-4 py-2 border-b border-slate-100 mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Account</p>
              </div>
              <Link
                href="/admin/settings/account"
                onClick={() => setIsUserOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                Account Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Sign Out
              </button>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}
