'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import SimpleRequestForm from '@/components/booking/SimpleRequestForm';

interface ContactSectionProps {
  proId?: string;
  proName: string;
  openChatUrl?: string;
  paymentLink?: string;
  bookingUrl?: string;
  onContactClick?: () => void;
  showRequestForm?: boolean;
  className?: string;
}

export function ContactSection({
  proId,
  proName,
  openChatUrl,
  paymentLink,
  bookingUrl,
  onContactClick,
  showRequestForm = true,
  className,
}: ContactSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const hasExternalLinks = openChatUrl || paymentLink || bookingUrl;

  return (
    <section className={cn('px-6 py-24', className)}>
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden border-2 border-tee-accent-primary/20 bg-gradient-to-br from-tee-surface to-tee-background p-12 text-center">
          <h2 className="mb-4 font-pretendard text-4xl font-bold text-tee-ink-strong">
            {proName}님과
            <br />
            레슨 시작하기
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-tee-ink-light">
            지금 문의하시면 빠른 시간 내에 답변 드리겠습니다
          </p>

          {/* Show form when requested or no external links */}
          {showForm || (!hasExternalLinks && proId && showRequestForm) ? (
            <div className="mx-auto max-w-md">
              <SimpleRequestForm
                proId={proId || ''}
                proName={proName}
                onSuccess={() => setShowForm(false)}
              />
              {hasExternalLinks && (
                <button
                  onClick={() => setShowForm(false)}
                  className="mt-4 text-sm text-tee-ink-light hover:text-tee-ink-strong"
                >
                  다른 방법으로 연락하기
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                {/* KakaoTalk Open Chat */}
                {openChatUrl && (
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 bg-tee-kakao text-tee-kakao-text hover:bg-tee-kakao/90"
                  >
                    <a href={openChatUrl} target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.61 1.72 4.89 4.29 6.17-.19.69-.69 2.52-.79 2.91-.12.5.18.5.38.36.16-.1 2.47-1.66 3.47-2.34.53.07 1.08.1 1.65.1 5.52 0 10-3.48 10-7.5S17.52 3 12 3z" />
                      </svg>
                      카카오톡 문의
                    </a>
                  </Button>
                )}

                {/* Payment Link */}
                {paymentLink && (
                  <Button asChild size="lg" variant="outline">
                    <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                      결제하기
                    </a>
                  </Button>
                )}

                {/* Booking URL */}
                {bookingUrl && (
                  <Button asChild size="lg">
                    <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                      예약하기
                    </a>
                  </Button>
                )}

                {/* Fallback contact button */}
                {!hasExternalLinks && onContactClick && (
                  <Button size="lg" onClick={onContactClick}>
                    레슨 문의하기
                  </Button>
                )}
              </div>

              {/* Option to show form even with external links */}
              {proId && showRequestForm && hasExternalLinks && (
                <div className="mt-6 border-t border-tee-stone pt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-sm text-tee-ink-light hover:text-tee-accent-primary"
                  >
                    또는 문의 폼 작성하기
                  </button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </section>
  );
}
