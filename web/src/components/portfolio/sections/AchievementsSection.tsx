'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export type Achievement = {
  title: string;
  tourOrEvent?: string;
  year?: string;
  placement?: string;
  note?: string;
};

interface AchievementsSectionProps {
  achievements: Achievement[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AchievementsSection({
  achievements,
  title = '투어 · 수상',
  subtitle,
  className,
}: AchievementsSectionProps) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <section className={cn('bg-tee-background px-6 py-16', className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-tee-ink-muted">
            Achievements
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm font-medium tracking-[0.08em] text-tee-ink-light">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative pl-6">
          <div className="absolute left-2 top-0 h-full w-px bg-tee-stone/50" aria-hidden="true" />
          <div className="space-y-6">
            {achievements.map((item, index) => (
              <div key={`${item.title}-${index}`} className="relative">
                <span className="absolute left-0 top-6 h-3 w-3 rounded-full bg-tee-accent-primary" />
                <Card className="ml-6 border-tee-stone/60 bg-white/90 p-6 shadow-none">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-tee-ink-muted">
                    {item.year && <span>{item.year}</span>}
                    {item.tourOrEvent && <span>{item.tourOrEvent}</span>}
                    {item.placement && (
                      <span className="rounded-full border border-tee-accent-primary/30 bg-tee-accent-primary/10 px-3 py-1 text-tee-accent-primary">
                        {item.placement}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-tee-ink-strong">
                    {item.title}
                  </h3>
                  {item.note && (
                    <p className="mt-2 text-sm text-tee-ink-light">{item.note}</p>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
