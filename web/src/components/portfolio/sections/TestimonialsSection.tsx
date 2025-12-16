'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Marquee } from '@/components/magicui/marquee';

interface Testimonial {
  name: string;
  quote: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  useMarquee?: boolean;
  className?: string;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="w-80 flex-shrink-0 p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 text-2xl text-tee-accent-primary">&ldquo;</div>
      <p className="mb-6 text-base leading-relaxed text-tee-ink-strong">
        {testimonial.quote.replace(/(^"|"$)/g, '')}
      </p>

      <div className="flex items-center gap-3">
        {testimonial.avatar ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tee-accent-primary/10 text-tee-accent-primary">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium text-tee-ink-strong">{testimonial.name}</p>
          {testimonial.rating && (
            <div className="flex gap-0.5 text-sm text-tee-accent-secondary">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function TestimonialsSection({
  testimonials,
  title = '수강 후기',
  subtitle = '실제 수강생들의 생생한 후기',
  useMarquee = false,
  className,
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-pretendard text-3xl font-bold text-tee-ink-strong">
            {title}
          </h2>
          <p className="text-lg text-tee-ink-light">{subtitle}</p>
        </div>
      </div>

      {useMarquee ? (
        <Marquee pauseOnHover className="[--duration:40s]" gap="1.5rem">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </Marquee>
      ) : (
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
