'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateProProfile } from '@/actions/profiles';
import type { SettingsProfile } from '../SettingsClient';

interface ProfileSectionProps {
  profile: SettingsProfile;
  onUpdate: (updates: Partial<SettingsProfile>) => void;
}

export default function ProfileSection({ profile, onUpdate }: ProfileSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [specialties, setSpecialties] = useState(profile.specialties.join(', '));
  const [certifications, setCertifications] = useState(profile.certifications.join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const specialtiesArray = specialties
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const certificationsArray = certifications
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      const result = await updateProProfile(profile.id, {
        title,
        bio: bio || null,
        location: location || null,
        specialties: specialtiesArray,
        certifications: certificationsArray,
      });

      if (result.success) {
        onUpdate({
          title,
          bio: bio || null,
          location: location || null,
          specialties: specialtiesArray,
          certifications: certificationsArray,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-tee-ink-strong">
          프로 이름 *
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="김프로"
          className="mt-1"
          required
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-tee-ink-muted">
          포트폴리오에 표시되는 이름입니다
        </p>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-tee-ink-strong">
          소개
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="안녕하세요, 20년 경력의 골프 레슨 프로입니다."
          rows={4}
          disabled={isPending}
          className="mt-1 w-full rounded-lg border border-tee-stone bg-tee-surface px-3 py-2 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary disabled:opacity-50"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-tee-ink-strong">
          활동 지역
        </label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="서울 강남구"
          className="mt-1"
          disabled={isPending}
        />
      </div>

      {/* Specialties */}
      <div>
        <label htmlFor="specialties" className="block text-sm font-medium text-tee-ink-strong">
          전문 분야
        </label>
        <Input
          id="specialties"
          value={specialties}
          onChange={(e) => setSpecialties(e.target.value)}
          placeholder="스윙 교정, 숏게임, 퍼팅"
          className="mt-1"
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-tee-ink-muted">
          쉼표로 구분하여 입력하세요
        </p>
      </div>

      {/* Certifications */}
      <div>
        <label htmlFor="certifications" className="block text-sm font-medium text-tee-ink-strong">
          자격증
        </label>
        <Input
          id="certifications"
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          placeholder="KPGA 티칭프로, TPI Level 2"
          className="mt-1"
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-tee-ink-muted">
          쉼표로 구분하여 입력하세요
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-tee-error/20 bg-tee-error/5 p-4">
          <p className="text-sm text-tee-error">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-lg border border-tee-success/20 bg-tee-success/5 p-4">
          <p className="text-sm text-tee-success">저장되었습니다.</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : '변경사항 저장'}
        </Button>
      </div>
    </form>
  );
}
