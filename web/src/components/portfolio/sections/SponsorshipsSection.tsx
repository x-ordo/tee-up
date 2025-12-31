'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export type Sponsorship = {
  brand: string;
  role?: string;
  period?: string;
  link?: string;
  logoUrl?: string;
};

interface SponsorshipsSectionProps {
  sponsorships: Sponsorship[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function SponsorshipsSection({
  sponsorships,
  title = '스폰서 & 파트너',
  subtitle,
  className,
}: SponsorshipsSectionProps) {
  if (!sponsorships || sponsorships.length === 0) return null;

  return (
    <section className={cn('px-6 py-16', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-tee-ink-muted">
            Partnerships
          </p>
          <h2 className="text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm font-medium tracking-[0.08em] text-tee-ink-light">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sponsorships.map((item, index) => (
            <Card
              key={`${item.brand}-${index}`}
              className="flex items-center gap-4 border-tee-stone/60 bg-tee-surface/80 p-6 shadow-none"
            >
              {item.logoUrl ? (
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-tee-stone/60 bg-white">
                  <img src={item.logoUrl} alt={item.brand} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-tee-stone/60 bg-tee-background text-xs font-semibold text-tee-ink-muted">
                  LOGO
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-tee-ink-strong">{item.brand}</h3>
                  {item.role && (
                    <span className="rounded-full border border-tee-stone px-3 py-1 text-xs text-tee-ink-muted">
                      {item.role}
                    </span>
                  )}
                </div>
                {item.period && (
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-tee-ink-muted">
                    {item.period}
                  </p>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-xs font-semibold text-tee-accent-primary hover:underline"
                  >
                    파트너 보기
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
