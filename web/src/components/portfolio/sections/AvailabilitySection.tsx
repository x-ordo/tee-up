'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export type AvailabilitySlot = {
  region?: string;
  cadence?: string;
  preferredDays?: string;
  timeWindow?: string;
  seasonality?: string;
};

interface AvailabilitySectionProps {
  availability: AvailabilitySlot[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AvailabilitySection({
  availability,
  title = '가용 일정',
  subtitle,
  className,
}: AvailabilitySectionProps) {
  if (!availability || availability.length === 0) return null;

  return (
    <section className={cn('px-6 py-16', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-tee-ink-muted">
            Availability
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

        <div className="grid gap-4 md:grid-cols-3">
          {availability.map((item, index) => (
            <Card
              key={`${item.region || 'slot'}-${index}`}
              className="border-tee-stone/60 bg-tee-surface/80 p-6 shadow-none"
            >
              <div className="space-y-3 text-sm text-tee-ink-light">
                {item.region && (
                  <p className="text-base font-semibold text-tee-ink-strong">
                    {item.region}
                  </p>
                )}
                {item.cadence && (
                  <p>
                    <span className="text-xs uppercase tracking-[0.2em] text-tee-ink-muted">
                      빈도
                    </span>
                    <br />
                    {item.cadence}
                  </p>
                )}
                {item.preferredDays && (
                  <p>
                    <span className="text-xs uppercase tracking-[0.2em] text-tee-ink-muted">
                      선호 요일
                    </span>
                    <br />
                    {item.preferredDays}
                  </p>
                )}
                {item.timeWindow && (
                  <p>
                    <span className="text-xs uppercase tracking-[0.2em] text-tee-ink-muted">
                      시간대
                    </span>
                    <br />
                    {item.timeWindow}
                  </p>
                )}
                {item.seasonality && (
                  <p className="text-xs text-tee-ink-muted">{item.seasonality}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
