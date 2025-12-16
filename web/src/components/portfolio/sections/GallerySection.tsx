'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GallerySectionProps {
  images: string[];
  title?: string;
  className?: string;
}

export function GallerySection({
  images,
  title = '갤러리',
  className,
}: GallerySectionProps) {
  if (images.length === 0) return null;

  // Simple grid layout for gallery
  return (
    <section className={cn('px-6 py-16 bg-tee-background', className)}>
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center font-pretendard text-3xl font-bold text-tee-ink-strong">
          {title}
        </h2>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.slice(0, 8).map((image, idx) => (
            <div
              key={idx}
              className={cn(
                'group relative aspect-square overflow-hidden rounded-xl',
                // Make first image larger on larger screens
                idx === 0 && 'md:col-span-2 md:row-span-2'
              )}
            >
              <Image
                src={image}
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes={idx === 0 ? '(max-width: 768px) 50vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
