import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/actions/profiles';
import SettingsClient from './SettingsClient';

export const metadata = {
  title: '설정 | TEE:UP',
  description: '계정 및 프로필 설정을 관리하세요',
};

export default async function SettingsPage() {
  const profileResult = await getCurrentUserProfile();

  if (!profileResult.success || !profileResult.data) {
    redirect('/dashboard');
  }

  const profile = profileResult.data;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-tee-ink-strong">설정</h1>
        <p className="mt-2 text-tee-ink-light">계정 및 프로필 설정을 관리하세요</p>
      </div>

      {/* Settings Client Component */}
      <SettingsClient
        profile={{
          id: profile.id,
          slug: profile.slug,
          title: profile.title,
          bio: profile.bio,
          location: profile.location,
          specialties: profile.specialties,
          certifications: profile.certifications,
          open_chat_url: profile.open_chat_url,
          payment_link: profile.payment_link,
          instagram_username: profile.instagram_username,
          youtube_channel_id: profile.youtube_channel_id,
          kakao_talk_id: profile.kakao_talk_id,
          subscription_tier: profile.subscription_tier,
          theme_config: profile.theme_config,
        }}
      />
    </div>
  );
}
