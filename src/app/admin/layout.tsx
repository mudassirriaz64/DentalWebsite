'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Image as ImageIcon, Calendar, Sparkles, Users, MessageSquare, LogOut, FileText, Settings as SettingsIcon, BarChart as BarChartIcon, LayoutDashboard, ChevronLeft, ChevronRight, Menu, X, User } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import GlobalAdminHeader from '@/components/layout/admin/GlobalAdminHeader';

function AdminSidebarNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const menuItems = [
    { label: 'Dashboard', href: '/admin', path: '/admin', icon: LayoutDashboard },
    { label: 'Appointments', href: '/admin/appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Submissions', href: '/admin/submissions', path: '/admin/submissions', icon: FileText },
    { label: 'Reviews', href: '/admin/reviews', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Gallery', href: '/admin/gallery', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Services', href: '/admin?tab=services', path: '/admin?tab=services', icon: Sparkles },
    { label: 'Doctors', href: '/admin?tab=doctors', path: '/admin?tab=doctors', icon: Users },
    { label: 'Stats', href: '/admin/settings/stats', path: '/admin/settings/stats', icon: BarChartIcon },
    { label: 'Settings', href: '/admin/settings/clinic', path: '/admin/settings/clinic', icon: SettingsIcon },
    { label: 'Account', href: '/admin/settings/account', path: '/admin/settings/account', icon: User },
  ];

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;
        
        let isActive = false;
        if (item.href.includes('?tab=')) {
          const targetTab = item.href.split('?tab=')[1];
          isActive = pathname === '/admin' && tab === targetTab;
        } else if (item.href === '/admin') {
          isActive = pathname === '/admin' && !tab;
        } else {
          isActive = pathname?.startsWith(item.path);
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all',
              isCollapsed ? 'justify-center px-0' : '',
              isActive
                ? 'bg-primary text-white font-extrabold shadow-sm'
                : 'hover:bg-[#3A3A3A] text-[#A0A0A0] hover:text-white'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem('admin_sidebar_collapsed', String(newVal));
  };

  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* Mobile Top Navbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#2E2E2E] text-[#A0A0A0] border-b border-[#222222] select-none shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <Logo variant="dark" className="h-6 w-auto" />
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-[#3A3A3A] text-[#A0A0A0] hover:text-white cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer backdrop overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'bg-[#2E2E2E] text-[#A0A0A0] flex flex-col flex-shrink-0 select-none transition-all duration-300 z-50',
          // Desktop collapsed/expanded width
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile responsive drawer positioning
          'fixed inset-y-0 left-0 w-64 transform lg:relative lg:translate-x-0 lg:flex',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {!isCollapsed ? (
              <Logo variant="dark" className="h-7 w-auto" />
            ) : (
              <Logo variant="icon" className="h-6 w-6" />
            )}
          </div>
          
          {/* Desktop Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-[#3A3A3A] text-[#A0A0A0] hover:text-white cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#3A3A3A] text-[#A0A0A0] hover:text-white cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Links */}
          <Suspense fallback={<div className="p-4 text-xs text-[#A0A0A0]">Loading nav...</div>}>
          <AdminSidebarNav isCollapsed={isCollapsed} />
        </Suspense>

        {/* Footer Log Out */}
        <div className="p-4 border-t border-[#222222] shrink-0">
          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer',
              isCollapsed ? 'justify-center px-0' : ''
            )}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel View Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
        <GlobalAdminHeader />
        {children}
      </main>
    </div>
  );
}
