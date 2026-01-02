'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface StatItem {
  label: string;
  value: string;
  detail?: string;
}

interface StatsSectionProps {
  stats: StatItem[];
  className?: string;
  variant?: 'cards' | 'pills' | 'minimal';
}

export function StatsSection({ stats, className, variant = 'cards' }: StatsSectionProps) {
  if (variant === 'pills') {
    return (
      <section className={cn('relative -mt-16 px-6 pb-12', className)}>
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-full border border-tee-stone bg-tee-surface px-5 py-3 shadow-card transition-all duration-300 hover:border-tee-accent-primary/40 hover:shadow-lg motion-reduce:transition-none"
              >
                <div className="text-lg font-semibold text-tee-accent-primary">
                  {stat.value}
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-tee-ink-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'minimal') {
    return (
      <section className={cn('relative -mt-16 px-6 pb-12', className)}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-tee-accent-primary/20 pl-4">
                <div className="text-3xl font-bold text-tee-accent-primary">
                  {stat.value}
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-tee-ink-light">
                  {stat.label}
                </p>
                {stat.detail && (
                  <p className="mt-1 text-xs text-tee-ink-light/70">{stat.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('relative -mt-24 px-6 pb-16', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <Card
              key={stat.label}
              className="group p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none motion-reduce:hover:scale-100"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-4xl font-bold text-tee-accent-primary">
                {stat.value}
              </div>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-tee-ink-light">
                {stat.label}
              </p>
              {stat.detail && (
                <p className="mt-1 text-xs text-tee-ink-light/70">{stat.detail}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
