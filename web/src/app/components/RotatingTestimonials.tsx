'use client';

import { useEffect, useState } from 'react';

type Testimonial = { quote: string; name?: string; rating?: number };

interface RotatingTestimonialsProps {
  testimonials: Testimonial[];
  intervalMs?: number;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" aria-label={`평점 ${rating}점`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg
          key={`full-${i}`}
          className="h-3.5 w-3.5 text-tee-accent-secondary"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {/* Half star */}
      {hasHalfStar && (
        <svg
          className="h-3.5 w-3.5 text-tee-accent-secondary"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#E8E8E5" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGradient)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      )}
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="h-3.5 w-3.5 text-tee-stone"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function RotatingTestimonials({
  testimonials,
  intervalMs = 4000,
}: RotatingTestimonialsProps) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const id = window.setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [testimonials.length, intervalMs]);

  const current = testimonials[index] ?? testimonials[0];

  if (!current) return null;

  const cleaned = current.quote.replace(/(^"|"$)/g, '');

  return (
    <div className="mt-4">
      {/* Quote Card */}
      <div className="relative rounded-xl border border-tee-stone/60 bg-tee-background/50 p-4">
        {/* Quote Icon */}
        <svg
          className="absolute -top-2 left-3 h-5 w-5 text-tee-accent-secondary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        {/* Testimonial Content */}
        <div
          className={`transition-all duration-300 ${
            isAnimating ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Rating */}
          {typeof current.rating === 'number' && (
            <div className="mb-2 flex items-center gap-2">
              <StarRating rating={current.rating} />
              <span className="text-xs font-medium text-tee-accent-secondary">
                {current.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Quote Text */}
          <p className="text-sm leading-relaxed text-tee-ink-strong">
            &ldquo;{cleaned}&rdquo;
          </p>

          {/* Author */}
          {current.name && (
            <p className="mt-2 text-xs font-medium text-tee-ink-muted">
              — {current.name}
            </p>
          )}
        </div>
      </div>

      {/* Progress Dots */}
      {testimonials.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-4 bg-tee-accent-secondary'
                  : 'w-1.5 bg-tee-stone hover:bg-tee-ink-muted'
              }`}
              aria-label={`후기 ${i + 1} 보기`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
