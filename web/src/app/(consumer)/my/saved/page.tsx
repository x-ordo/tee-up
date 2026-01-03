import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Star, ChevronRight } from 'lucide-react';
import { getSavedPros } from '@/actions/consumer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function SavedProsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 animate-pulse rounded-2xl bg-tee-stone/30" />
      ))}
    </div>
  );
}

async function SavedProsList() {
  const result = await getSavedPros();

  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-tee-ink-muted">저장한 프로를 불러오는데 실패했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  const savedPros = result.data;

  if (savedPros.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tee-stone/30">
            <Heart className="h-8 w-8 text-tee-ink-muted" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-tee-ink-strong">
              저장한 프로가 없습니다
            </h3>
            <p className="text-sm text-tee-ink-muted">
              마음에 드는 프로를 저장하고 나중에 쉽게 찾아보세요
            </p>
          </div>
          <Button asChild variant="primary" className="mt-2">
            <Link href="/explore">프로 찾아보기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {savedPros.map((saved) => (
        <Card
          key={saved.id}
          className="group overflow-hidden transition-shadow hover:shadow-md"
        >
          <CardContent className="p-0">
            {/* Pro Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-tee-stone/20">
              {saved.pro?.profile_image_url ? (
                <Image
                  src={saved.pro.profile_image_url}
                  alt={saved.pro.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-4xl font-bold text-tee-accent-primary/30">
                    {saved.pro?.title?.charAt(0) || 'P'}
                  </span>
                </div>
              )}
              {/* Saved badge */}
              <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm">
                <Heart className="h-4 w-4 fill-tee-error text-tee-error" />
              </div>
            </div>

            {/* Pro Info */}
            <div className="p-4">
              <Link
                href={`/${saved.pro?.slug}`}
                className="block font-semibold text-tee-ink-strong hover:text-tee-accent-primary"
              >
                {saved.pro?.title || '프로'}
              </Link>

              {saved.pro?.location && (
                <p className="mt-1 flex items-center gap-1 text-sm text-tee-ink-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  {saved.pro.location}
                </p>
              )}

              {saved.pro?.rating && (
                <p className="mt-2 flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-tee-warning text-tee-warning" />
                  <span className="font-medium text-tee-ink-strong">
                    {saved.pro.rating.toFixed(1)}
                  </span>
                </p>
              )}

              {saved.pro?.bio && (
                <p className="mt-2 line-clamp-2 text-sm text-tee-ink-light">
                  {saved.pro.bio}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <Button asChild variant="primary" size="sm" className="flex-1">
                  <Link href={`/${saved.pro?.slug}`}>
                    프로필 보기
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function SavedProsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-tee-ink-strong">저장한 프로</h1>
        <p className="mt-1 text-sm text-tee-ink-muted">
          관심있는 프로를 저장하고 한눈에 확인하세요
        </p>
      </div>

      {/* Saved Pros List */}
      <Suspense fallback={<SavedProsSkeleton />}>
        <SavedProsList />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: '저장한 프로 - TEE:UP',
  description: '저장한 골프 프로를 확인하세요',
};
