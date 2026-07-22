'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, FileText, MessageSquare, Sparkles, Users, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface AdminOverviewDashboardProps {
  username: string;
  unreadAppointments: number;
  unreadSubmissions: number;
  pendingReviews: number;
  totalServices: number;
  totalDoctors: number;
  totalGallery: number;
}

export const AdminOverviewDashboard: React.FC<AdminOverviewDashboardProps> = ({
  username,
  unreadAppointments,
  unreadSubmissions,
  pendingReviews,
  totalServices,
  totalDoctors,
  totalGallery,
}) => {
  return (
    <div className="flex-1 p-6 font-sans text-sm text-slate-800 bg-slate-50 overflow-y-auto">
      {/* Welcome Banner */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">
          Welcome back, {username}!
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Here is a quick overview of what needs your attention at the clinic today.
        </p>
      </header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Appointments Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              {unreadAppointments > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 animate-pulse">
                  {unreadAppointments} New
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                  No pending
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-800">
              Appointments
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Review and schedule preferred date/time requests from prospective patients.
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary transition-colors w-fit group"
          >
            Manage Appointments <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Submissions Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              {unreadSubmissions > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {unreadSubmissions} New
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                  All read
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-800">
              Inquiries & Submissions
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Read questions submitted through contact channels and treatment interest forms.
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary transition-colors w-fit group"
          >
            Review Submissions <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Testimonials Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              {pendingReviews > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 animate-pulse">
                  {pendingReviews} Pending
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                  No queue
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-800">
              Reviews & Stories
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Moderate patient-submitted feedback and select featured items for the Home page.
            </p>
          </div>
          <Link
            href="/admin/reviews"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary transition-colors w-fit group"
          >
            Moderate Reviews <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Inventory Snapshots Heading */}
      <h2 className="font-serif font-bold text-xl text-slate-900 mb-5">
        Clinic Library & Inventories
      </h2>

      {/* Secondary Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Services Count */}
        <Link
          href="/admin?tab=services"
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:border-slate-200 cursor-pointer"
        >
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold font-sans text-slate-950 leading-none">
              {totalServices}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Clinic Services Offered
            </p>
          </div>
        </Link>

        {/* Doctors Count */}
        <Link
          href="/admin?tab=doctors"
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:border-slate-200 cursor-pointer"
        >
          <div className="p-3 bg-red-50 rounded-xl text-red-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold font-sans text-slate-950 leading-none">
              {totalDoctors}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Active Medical Specialists
            </p>
          </div>
        </Link>

        {/* Gallery Items Count */}
        <Link
          href="/admin/gallery"
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md hover:border-slate-200 cursor-pointer"
        >
          <div className="p-3 bg-green-50 rounded-xl text-green-600 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold font-sans text-slate-950 leading-none">
              {totalGallery}
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Before & After Cases
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default AdminOverviewDashboard;
