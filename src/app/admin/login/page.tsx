'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-alt flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-slate-100 p-8 md:p-10 flex flex-col items-center">
        {/* Logo lockup */}
        <div className="flex flex-col items-center gap-2.5 mb-8">
          <Logo className="w-16 h-16" />
          <div className="text-center mt-2">
            <h1 className="font-serif font-bold text-2xl text-dark-text leading-tight">
              Clinic Administration
            </h1>
            <p className="text-xs text-body-text tracking-wide mt-1">
              Dental Cosmetics & Implant Centre
            </p>
          </div>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-accent-soft text-accent-dark text-sm font-semibold border border-accent/10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="flex flex-col items-start w-full">
            <label
              htmlFor="username"
              className="text-xs font-bold uppercase text-dark-text mb-2 tracking-wider"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-transparent text-sm text-dark-text font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              placeholder="Enter username"
            />
          </div>

          <div className="flex flex-col items-start w-full">
            <label
              htmlFor="password"
              className="text-xs font-bold uppercase text-dark-text mb-2 tracking-wider"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-transparent text-sm text-dark-text font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full text-sm px-8 py-3.5 bg-accent text-white hover:bg-accent-hover shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}
