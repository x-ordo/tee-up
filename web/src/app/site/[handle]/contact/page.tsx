'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { revealContactByHandle } from '@/actions/sites';

type ContactInfo = {
  phone: string | null;
  email: string | null;
  kakao_url: string | null;
  booking_url: string | null;
};

/**
 * Contact reveal page - 연락처 보기 (과금 이벤트)
 * 이 페이지에 접근하면 contact_reveal 이벤트가 로깅됨
 * URL: /site/{handle}/contact
 */
export default function ContactPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const handle = params.handle as string;
  const action = searchParams.get('action');

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 연락처 조회 (contact_reveal 이벤트 로깅)
  useEffect(() => {
    async function fetchContact() {
      setLoading(true);
      setError(null);

      try {
        const result = await revealContactByHandle(handle);

        if (!result.success) {
          if (result.error?.includes('Rate limited')) {
            setError('너무 많은 요청입니다. 잠시 후 다시 시도해주세요.');
          } else {
            setError(result.error || '연락처를 불러오지 못했습니다.');
          }
          return;
        }

        setContactInfo(result.data);

        // 특정 액션으로 바로 리다이렉트
        if (action === 'kakao' && result.data?.kakao_url) {
          window.location.href = result.data.kakao_url;
        } else if (action === 'booking' && result.data?.booking_url) {
          window.location.href = result.data.booking_url;
        }
      } catch (err) {
        console.error('Contact fetch error:', err);
        setError('오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchContact();
  }, [handle, action]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tee-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto" />
          <p className="text-tee-ink-light">연락처 확인 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tee-background px-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h1 className="mb-2 text-xl font-semibold text-tee-ink-strong">
            연락처를 불러올 수 없습니다
          </h1>
          <p className="mb-6 text-tee-ink-light">{error}</p>
          <Link
            href={`/site/${handle}`}
            className="btn-secondary inline-block px-6 py-3"
          >
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tee-background px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-tee-surface shadow-card p-8">
          <h1 className="mb-6 text-center text-2xl font-semibold text-tee-ink-strong">
            연락처 정보
          </h1>

          <div className="space-y-4">
            {/* Phone */}
            {contactInfo?.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-4 rounded-xl border border-tee-stone p-4 transition-colors hover:bg-tee-surface"
              >
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-sm text-tee-ink-light">전화번호</p>
                  <p className="font-semibold text-tee-ink-strong">
                    {formatPhoneNumber(contactInfo.phone)}
                  </p>
                </div>
              </a>
            )}

            {/* Email */}
            {contactInfo?.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-4 rounded-xl border border-tee-stone p-4 transition-colors hover:bg-tee-surface"
              >
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-sm text-tee-ink-light">이메일</p>
                  <p className="font-semibold text-tee-ink-strong">
                    {contactInfo.email}
                  </p>
                </div>
              </a>
            )}

            {/* KakaoTalk */}
            {contactInfo?.kakao_url && (
              <a
                href={contactInfo.kakao_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-tee-stone bg-tee-kakao p-4 transition-opacity hover:opacity-90"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-sm text-tee-ink-strong/70">카카오톡</p>
                  <p className="font-semibold text-tee-ink-strong">
                    오픈채팅 문의하기
                  </p>
                </div>
              </a>
            )}

            {/* Booking */}
            {contactInfo?.booking_url && (
              <a
                href={contactInfo.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-tee-stone p-4 transition-colors hover:bg-tee-surface"
              >
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-tee-ink-light">예약</p>
                  <p className="font-semibold text-tee-ink-strong">
                    예약 페이지로 이동
                  </p>
                </div>
              </a>
            )}
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href={`/site/${handle}`}
              className="text-sm text-tee-ink-light hover:text-accent"
            >
              ← 프로필로 돌아가기
            </Link>
          </div>
        </div>

        {/* Notice */}
        <p className="mt-6 text-center text-xs text-tee-ink-light/60">
          연락처 조회는 프로에게 알림으로 전달됩니다
        </p>
      </div>
    </div>
  );
}

/**
 * 전화번호 포맷팅
 */
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}
