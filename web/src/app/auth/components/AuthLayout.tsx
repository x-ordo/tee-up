'use client';

import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-tee-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-tee-stone bg-tee-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-2xl font-bold text-tee-ink-strong">
            TEE<span className="text-accent">:</span>UP
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-20">
        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="border-b border-tee-stone bg-accent-light p-8 text-center">
              <h1 className="mb-2 font-display text-display-sm font-semibold text-tee-ink-strong">
                {title}
              </h1>
              <p className="text-body-md text-tee-ink-light">{subtitle}</p>
            </div>

            {/* Content */}
            <div className="p-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
