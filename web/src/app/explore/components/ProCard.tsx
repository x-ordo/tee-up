import Link from 'next/link';
import type { ExploreProfile } from '@/actions/profiles';

type ProCardProps = {
  profile: ExploreProfile;
};

const REGION_LABELS: Record<string, string> = {
  seoul: '서울',
  gyeonggi: '경기',
  incheon: '인천',
  busan: '부산',
  daegu: '대구',
  gwangju: '광주',
  daejeon: '대전',
  ulsan: '울산',
  sejong: '세종',
  gangwon: '강원',
  chungbuk: '충북',
  chungnam: '충남',
  jeonbuk: '전북',
  jeonnam: '전남',
  gyeongbuk: '경북',
  gyeongnam: '경남',
  jeju: '제주',
  overseas: '해외',
};

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${
            i < fullStars
              ? 'text-tee-accent-secondary'
              : i === fullStars && hasHalfStar
                ? 'text-tee-accent-secondary/50'
                : 'text-tee-stone'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProCard({ profile }: ProCardProps) {
  const regionLabel = profile.primaryRegion
    ? REGION_LABELS[profile.primaryRegion] || profile.primaryRegion
    : null;

  const locationDisplay =
    regionLabel && profile.primaryCity
      ? `${regionLabel} ${profile.primaryCity}`
      : profile.location || '활동 지역 확인 중';

  const primarySpecialty = profile.specialties[0] || '맞춤 레슨';
  const displayTags = profile.specialties.slice(0, 2);

  return (
    <Link
      href={`/${profile.slug}`}
      className="group block overflow-hidden rounded-2xl border border-tee-stone/60 bg-white shadow-card transition-all hover:border-tee-accent-primary/30 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-tee-stone/30">
        {profile.profileImageUrl || profile.heroImageUrl ? (
          <img
            src={profile.profileImageUrl || profile.heroImageUrl || ''}
            alt={profile.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-tee-background to-white">
            <svg
              className="h-16 w-16 text-tee-stone"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}

        {/* Featured Badge */}
        {profile.isFeatured && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-tee-accent-secondary px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            추천
          </div>
        )}

        {/* Verified Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-white/30 bg-tee-accent-primary/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          인증
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-tee-ink-strong group-hover:text-tee-accent-primary">
              {profile.title}
            </h3>
            <p className="mt-0.5 text-sm text-tee-ink-muted">{locationDisplay}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <StarRating rating={profile.rating} />
          <span className="text-sm font-medium text-tee-accent-secondary">
            {profile.rating.toFixed(1)}
          </span>
          <span className="text-xs text-tee-ink-muted">
            ({profile.profileViews.toLocaleString()} 조회)
          </span>
        </div>

        {/* Focus */}
        <p className="mt-3 text-sm font-medium text-tee-ink-strong">
          {primarySpecialty}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-2 line-clamp-2 text-sm text-tee-ink-light">
            {profile.bio}
          </p>
        )}

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-tee-stone/40 px-3 py-1 text-xs text-tee-ink-muted"
            >
              {tag}
            </span>
          ))}
          {profile.certifications.length > 0 && (
            <span className="rounded-full bg-tee-accent-primary/10 px-3 py-1 text-xs text-tee-accent-primary">
              {profile.certifications[0]}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-tee-stone/40 pt-4">
          <span className="text-xs font-semibold text-tee-accent-primary group-hover:underline">
            프로필 보기
          </span>
          <svg
            className="h-4 w-4 text-tee-accent-primary transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
