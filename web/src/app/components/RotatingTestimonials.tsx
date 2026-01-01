'use client';

import { useEffect, useState } from 'react';

type Testimonial = { quote: string; name?: string; rating?: number };

interface RotatingTestimonialsProps {
  testimonials: Testimonial[];
  intervalMs?: number;
}

export default function RotatingTestimonials({
  testimonials,
  intervalMs = 4000,
}: RotatingTestimonialsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [testimonials.length, intervalMs]);

  const current = testimonials[index] ?? testimonials[0];

  if (!current) return null;

  const cleaned = current.quote.replace(/(^\"|\"$)/g, '');

  return (
    <div className="mt-3 text-sm text-tee-ink-light">
      <p className="transition-opacity duration-500">“{cleaned}”</p>
      {current.name && (
        <p className="mt-1 text-xs text-tee-ink-muted">— {current.name}</p>
      )}
    </div>
  );
}
