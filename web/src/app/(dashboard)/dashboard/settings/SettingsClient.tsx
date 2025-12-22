'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import ProfileSection from './components/ProfileSection';
import ContactSection from './components/ContactSection';
import SubscriptionSection from './components/SubscriptionSection';
import DangerZone from './components/DangerZone';
import { ThemeCustomizer } from '@/components/portfolio';
import { getDefaultTheme, type ThemeConfig } from '@/lib/theme-config';

export type SettingsProfile = {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  location: string | null;
  specialties: string[];
  certifications: string[];
  open_chat_url: string | null;
  payment_link: string | null;
  instagram_username: string | null;
  youtube_channel_id: string | null;
  kakao_talk_id: string | null;
  subscription_tier: 'free' | 'basic' | 'pro';
  theme_config: ThemeConfig | null;
};

interface SettingsClientProps {
  profile: SettingsProfile;
}

export default function SettingsClient({ profile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentProfile, setCurrentProfile] = useState(profile);

  const handleProfileUpdate = (updates: Partial<SettingsProfile>) => {
    setCurrentProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-5 bg-tee-stone/30">
        <TabsTrigger
          value="profile"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          프로필
        </TabsTrigger>
        <TabsTrigger
          value="theme"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          테마
        </TabsTrigger>
        <TabsTrigger
          value="contact"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          연락처
        </TabsTrigger>
        <TabsTrigger
          value="subscription"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          구독
        </TabsTrigger>
        <TabsTrigger
          value="danger"
          className="data-[state=active]:bg-tee-surface data-[state=active]:text-tee-ink-strong"
        >
          계정
        </TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>
              포트폴리오에 표시되는 기본 정보를 수정하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSection
              profile={currentProfile}
              onUpdate={handleProfileUpdate}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Theme Tab */}
      <TabsContent value="theme">
        <ThemeCustomizer
          profileId={currentProfile.id}
          initialConfig={currentProfile.theme_config || getDefaultTheme()}
        />
      </TabsContent>

      {/* Contact Tab */}
      <TabsContent value="contact">
        <Card>
          <CardHeader>
            <CardTitle>연락처 및 링크</CardTitle>
            <CardDescription>
              고객이 연락할 수 있는 정보를 설정하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactSection
              profile={currentProfile}
              onUpdate={handleProfileUpdate}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Subscription Tab */}
      <TabsContent value="subscription">
        <Card>
          <CardHeader>
            <CardTitle>구독 관리</CardTitle>
            <CardDescription>
              현재 요금제와 사용량을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionSection profile={currentProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Danger Zone Tab */}
      <TabsContent value="danger">
        <Card className="border-tee-error/20">
          <CardHeader>
            <CardTitle className="text-tee-error">위험 영역</CardTitle>
            <CardDescription>
              주의: 이 작업은 되돌릴 수 없습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DangerZone profileId={currentProfile.id} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
