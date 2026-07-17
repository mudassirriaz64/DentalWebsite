'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Image as ImageIcon, Calendar, Sparkles, Users, MessageSquare, LogOut, FileText } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { label: 'Appointments', href: '/admin', tab: 'appointments', icon: Calendar },
    { label: 'Submissions', href: '/admin?tab=contacts', tab: 'contacts', icon: FileText },
    { label: 'Gallery', href: '/admin/gallery', tab: 'gallery', icon: ImageIcon },
    { label: 'Services', href: '/admin?tab=services', tab: 'services', icon: Sparkles },
    { label: 'Doctors', href: '/admin?tab=doctors', tab: 'doctors', icon: Users },
    { label: 'Testimonials', href: '/admin?tab=reviews', tab: 'reviews', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-white rounded-lg p-1 flex-shrink-0">
            <Logo className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm tracking-wide">Dental Panel</h2>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Administrator</p>
          </div>
        </div>

        {/* Tab Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            // Check if active (exact match for gallery, or tab matching for index routes)
            let isActive = false;
            if (item.tab === 'gallery') {
              isActive = pathname === '/admin/gallery';
            } else {
              if (pathname === '/admin') {
                if (typeof window !== 'undefined') {
                  const urlParams = new URLSearchParams(window.location.search);
                  const activeTab = urlParams.get('tab') || 'appointments';
                  isActive = activeTab === item.tab;
                } else {
                  isActive = item.tab === 'appointments';
                }
              }
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white font-extrabold shadow-sm'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Log Out */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel View Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {children}
      </main>
    </div>
  );
}
