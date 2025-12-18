import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/actions/profiles';
import { getPortfolioSections } from '@/actions/portfolios';
import PortfolioEditorClient from './PortfolioEditorClient';

export const metadata = {
  title: '포트폴리오 편집 | TEE:UP',
  description: '포트폴리오 템플릿과 섹션을 편집하세요',
};

export default async function PortfolioEditorPage() {
  const profileResult = await getCurrentUserProfile();

  if (!profileResult.success || !profileResult.data) {
    // User is authenticated but has no pro profile
    redirect('/dashboard');
  }

  const profile = profileResult.data;

  const sectionsResult = await getPortfolioSections(profile.id);
  const sections = sectionsResult.success ? sectionsResult.data : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tee-ink-strong">포트폴리오 편집</h1>
          <p className="mt-2 text-tee-ink-light">
            템플릿 선택, 섹션 편집, 미리보기
          </p>
        </div>
        <a
          href={`/${profile.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-tee-ink-light/20 bg-tee-surface px-4 py-2 text-sm font-medium text-tee-ink-strong transition-colors hover:bg-tee-ink-light/5"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          실제 페이지 보기
        </a>
      </div>

      {/* Editor Client Component */}
      <PortfolioEditorClient
        profile={{
          id: profile.id,
          slug: profile.slug,
          title: profile.title,
          theme_type: profile.theme_type,
          bio: profile.bio,
          profile_image_url: profile.profile_image_url,
          open_chat_url: profile.open_chat_url,
          payment_link: profile.payment_link,
          location: profile.location,
          specialties: profile.specialties,
          certifications: profile.certifications,
          instagram_username: profile.instagram_username,
          youtube_channel_id: profile.youtube_channel_id,
          kakao_talk_id: profile.kakao_talk_id,
        }}
        initialSections={sections}
      />
    </div>
  );
}
