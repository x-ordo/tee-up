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
}

export function StatsSection({ stats, className }: StatsSectionProps) {
  return (
    <section className={cn('relative -mt-24 px-6 pb-16', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <Card
              key={stat.label}
              className="group p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
