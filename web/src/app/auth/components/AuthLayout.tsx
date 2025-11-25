'use client';

import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-2xl font-bold text-white">
            TEE<span className="text-[#d4af37]">:</span>UP
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#d4af37]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-[#d4af37]/10 blur-3xl" style={{ animationDelay: '2s' }} />
        </div>

        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e27]/90 backdrop-blur-xl">
            {/* Header */}
            <div className="border-b border-white/10 bg-gradient-to-r from-[#d4af37]/10 to-transparent p-8 text-center">
              <h1 className="mb-2 font-display text-3xl font-bold text-white">
                {title}
              </h1>
              <p className="text-white/60">{subtitle}</p>
            </div>

            {/* Content */}
            <div className="p-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
