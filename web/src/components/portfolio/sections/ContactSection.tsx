'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ContactSectionProps {
  proName: string;
  openChatUrl?: string;
  paymentLink?: string;
  bookingUrl?: string;
  onContactClick?: () => void;
  className?: string;
}

export function ContactSection({
  proName,
  openChatUrl,
  paymentLink,
  bookingUrl,
  onContactClick,
  className,
}: ContactSectionProps) {
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

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* KakaoTalk Open Chat */}
            {openChatUrl && (
              <Button
                asChild
                size="lg"
                className="gap-2 bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDD835]"
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
            {!openChatUrl && !paymentLink && !bookingUrl && onContactClick && (
              <Button size="lg" onClick={onContactClick}>
                레슨 문의하기
              </Button>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
