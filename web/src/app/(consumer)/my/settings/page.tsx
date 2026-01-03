'use client';

import { useState } from 'react';
import { User, Bell, Shield, LogOut, ChevronRight, Phone, Mail, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-tee-ink-strong">설정</h1>
        <p className="mt-1 text-sm text-tee-ink-muted">
          계정 및 알림 설정을 관리하세요
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5 text-tee-accent-primary" />
            프로필 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          <SettingsItem
            icon={User}
            label="이름 변경"
            description="표시되는 이름을 변경합니다"
            href="/my/settings/profile"
          />
          <SettingsItem
            icon={Phone}
            label="연락처 변경"
            description="연락받을 전화번호를 변경합니다"
            href="/my/settings/phone"
          />
          <SettingsItem
            icon={Mail}
            label="이메일 변경"
            description="로그인 이메일을 변경합니다"
            href="/my/settings/email"
          />
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-5 w-5 text-tee-accent-primary" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          <SettingsItem
            icon={Bell}
            label="푸시 알림"
            description="상담/예약 알림을 받습니다"
            href="/my/settings/notifications"
          />
          <SettingsItem
            icon={Mail}
            label="이메일 알림"
            description="마케팅 및 프로모션 이메일"
            href="/my/settings/email-preferences"
          />
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-tee-accent-primary" />
            보안
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          <SettingsItem
            icon={Shield}
            label="비밀번호 변경"
            description="계정 비밀번호를 변경합니다"
            href="/my/settings/password"
          />
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-tee-error hover:bg-tee-error/10 hover:text-tee-error"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            로그아웃
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-tee-error/30">
        <CardHeader>
          <CardTitle className="text-base text-tee-error">위험 구역</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="mb-4 text-sm text-tee-ink-muted">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
            이 작업은 되돌릴 수 없습니다.
          </p>
          <Button variant="outline" className="border-tee-error text-tee-error hover:bg-tee-error/10">
            계정 삭제
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
}

function SettingsItem({ icon: Icon, label, description, href }: SettingsItemProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-tee-stone/30"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tee-stone/30">
        <Icon className="h-5 w-5 text-tee-ink-light" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-tee-ink-strong">{label}</p>
        <p className="text-sm text-tee-ink-muted">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-tee-ink-muted" />
    </a>
  );
}
