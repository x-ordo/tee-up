'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateProProfile } from '@/actions/profiles';
import { updateOpenChatUrl, updatePaymentLink } from '@/actions/portfolios';
import type { SettingsProfile } from '../SettingsClient';

interface ContactSectionProps {
  profile: SettingsProfile;
  onUpdate: (updates: Partial<SettingsProfile>) => void;
}

export default function ContactSection({ profile, onUpdate }: ContactSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [openChatUrl, setOpenChatUrl] = useState(profile.open_chat_url || '');
  const [paymentLink, setPaymentLink] = useState(profile.payment_link || '');
  const [instagramUsername, setInstagramUsername] = useState(profile.instagram_username || '');
  const [youtubeChannelId, setYoutubeChannelId] = useState(profile.youtube_channel_id || '');
  const [kakaoTalkId, setKakaoTalkId] = useState(profile.kakao_talk_id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      // Update open chat URL if changed
      if (openChatUrl !== (profile.open_chat_url || '')) {
        if (openChatUrl && !openChatUrl.includes('open.kakao.com')) {
          setError('카카오톡 오픈채팅 URL은 open.kakao.com을 포함해야 합니다');
          return;
        }
        const chatResult = await updateOpenChatUrl(profile.id, openChatUrl);
        if (!chatResult.success) {
          setError(chatResult.error);
          return;
        }
      }

      // Update payment link if changed
      if (paymentLink !== (profile.payment_link || '')) {
        if (paymentLink) {
          try {
            new URL(paymentLink);
          } catch {
            setError('유효한 URL을 입력해주세요');
            return;
          }
        }
        const paymentResult = await updatePaymentLink(profile.id, paymentLink);
        if (!paymentResult.success) {
          setError(paymentResult.error);
          return;
        }
      }

      // Update other profile fields
      const result = await updateProProfile(profile.id, {
        instagram_username: instagramUsername || null,
        youtube_channel_id: youtubeChannelId || null,
        kakao_talk_id: kakaoTalkId || null,
      });

      if (result.success) {
        onUpdate({
          open_chat_url: openChatUrl || null,
          payment_link: paymentLink || null,
          instagram_username: instagramUsername || null,
          youtube_channel_id: youtubeChannelId || null,
          kakao_talk_id: kakaoTalkId || null,
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
      {/* KakaoTalk Open Chat */}
      <div>
        <label htmlFor="openChatUrl" className="block text-sm font-medium text-tee-ink-strong">
          카카오톡 오픈채팅 URL
        </label>
        <Input
          id="openChatUrl"
          type="url"
          value={openChatUrl}
          onChange={(e) => setOpenChatUrl(e.target.value)}
          placeholder="https://open.kakao.com/o/..."
          className="mt-1"
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-tee-ink-muted">
          고객이 카카오톡으로 바로 문의할 수 있습니다
        </p>
      </div>

      {/* KakaoTalk ID */}
      <div>
        <label htmlFor="kakaoTalkId" className="block text-sm font-medium text-tee-ink-strong">
          카카오톡 ID
        </label>
        <Input
          id="kakaoTalkId"
          value={kakaoTalkId}
          onChange={(e) => setKakaoTalkId(e.target.value)}
          placeholder="golf_pro_kim"
          className="mt-1"
          disabled={isPending}
        />
      </div>

      {/* Payment Link */}
      <div>
        <label htmlFor="paymentLink" className="block text-sm font-medium text-tee-ink-strong">
          결제 링크
        </label>
        <Input
          id="paymentLink"
          type="url"
          value={paymentLink}
          onChange={(e) => setPaymentLink(e.target.value)}
          placeholder="https://pay.toss.im/..."
          className="mt-1"
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-tee-ink-muted">
          토스페이, 카카오페이 등 결제 페이지 링크
        </p>
      </div>

      {/* Instagram */}
      <div>
        <label htmlFor="instagramUsername" className="block text-sm font-medium text-tee-ink-strong">
          인스타그램 사용자명
        </label>
        <div className="mt-1 flex">
          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-tee-stone bg-tee-stone/30 px-3 text-sm text-tee-ink-muted">
            @
          </span>
          <Input
            id="instagramUsername"
            value={instagramUsername}
            onChange={(e) => setInstagramUsername(e.target.value)}
            placeholder="golf_pro_kim"
            className="rounded-l-none"
            disabled={isPending}
          />
        </div>
      </div>

      {/* YouTube */}
      <div>
        <label htmlFor="youtubeChannelId" className="block text-sm font-medium text-tee-ink-strong">
          유튜브 채널 ID
        </label>
        <Input
          id="youtubeChannelId"
          value={youtubeChannelId}
          onChange={(e) => setYoutubeChannelId(e.target.value)}
          placeholder="UC..."
          className="mt-1"
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-tee-ink-muted">
          채널 URL에서 확인할 수 있습니다 (youtube.com/channel/UC...)
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
