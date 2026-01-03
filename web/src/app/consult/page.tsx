'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, Clock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';

type ConsultationType = 'kakao' | 'callback' | 'form';

export default function ConsultPage() {
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission (in production, this would call a server action)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-tee-background px-4 pb-20 pt-24">
          <div className="mx-auto max-w-lg">
            <Card>
              <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-tee-success/10">
                  <CheckCircle className="h-10 w-10 text-tee-success" />
                </div>
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-tee-ink-strong">
                    상담 신청이 완료되었습니다
                  </h2>
                  <p className="text-tee-ink-muted">
                    24시간 내에 담당자가 연락드릴 예정입니다.
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Button asChild variant="primary">
                    <Link href="/explore">
                      프로 둘러보기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">홈으로 돌아가기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-tee-background px-4 pb-20 pt-24">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-tee-ink-strong">
              맞춤 프로 상담 신청
            </h1>
            <p className="mt-2 text-tee-ink-muted">
              원하는 방식으로 상담을 신청하세요. 전문 상담사가 도와드립니다.
            </p>
          </div>

          {/* Consultation Options */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <ConsultationOption
              icon={MessageCircle}
              title="카카오톡 상담"
              description="실시간 채팅 상담"
              isSelected={selectedType === 'kakao'}
              onClick={() => setSelectedType('kakao')}
              highlight
            />
            <ConsultationOption
              icon={Phone}
              title="콜백 예약"
              description="전화 상담 예약"
              isSelected={selectedType === 'callback'}
              onClick={() => setSelectedType('callback')}
            />
            <ConsultationOption
              icon={Clock}
              title="온라인 상담"
              description="폼 작성 후 연락"
              isSelected={selectedType === 'form'}
              onClick={() => setSelectedType('form')}
            />
          </div>

          {/* Selected Option Content */}
          {selectedType === 'kakao' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-tee-ink-strong" />
                  카카오톡으로 바로 상담받기
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-tee-ink-muted">
                  카카오톡 오픈채팅으로 즉시 상담을 시작하세요.
                  평균 응답 시간 5분 이내입니다.
                </p>
                <a
                  href="https://open.kakao.com/o/sTEEUP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tee-kakao px-8 py-4 text-lg font-semibold text-tee-ink-strong transition-all hover:scale-105 hover:shadow-lg"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.627 1.697 4.934 4.256 6.264-.135.464-.87 2.983-.9 3.176 0 0-.019.154.082.213.1.06.218.027.218.027.288-.04 3.338-2.177 3.862-2.548.788.117 1.608.179 2.482.179 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
                  </svg>
                  카카오톡 상담 시작하기
                </a>
                <p className="text-center text-xs text-tee-ink-muted">
                  운영시간: 평일 09:00 - 18:00
                </p>
              </CardContent>
            </Card>
          )}

          {selectedType === 'callback' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-tee-accent-primary" />
                  전화 상담 예약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-tee-ink-strong">
                      이름 <span className="text-tee-error">*</span>
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-tee-ink-strong">
                      연락처 <span className="text-tee-error">*</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="010-1234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="interest" className="mb-1 block text-sm font-medium text-tee-ink-strong">
                      관심 분야
                    </label>
                    <select
                      id="interest"
                      className="w-full rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    >
                      <option value="">선택하세요</option>
                      <option value="beginner">입문/초보 레슨</option>
                      <option value="swing">스윙 교정</option>
                      <option value="driver">드라이버 레슨</option>
                      <option value="iron">아이언 레슨</option>
                      <option value="short">숏게임/퍼팅</option>
                      <option value="course">코스 전략</option>
                      <option value="mental">멘탈 코칭</option>
                    </select>
                  </div>
                  <p className="text-sm text-tee-ink-muted">
                    영업일 기준 24시간 내에 연락드립니다.
                  </p>
                  <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        신청 중...
                      </>
                    ) : (
                      '콜백 예약하기'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {selectedType === 'form' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-tee-accent-primary" />
                  온라인 상담 신청
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="form-name" className="mb-1 block text-sm font-medium text-tee-ink-strong">
                      이름 <span className="text-tee-error">*</span>
                    </label>
                    <Input
                      id="form-name"
                      type="text"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="form-phone" className="mb-1 block text-sm font-medium text-tee-ink-strong">
                      연락처 <span className="text-tee-error">*</span>
                    </label>
                    <Input
                      id="form-phone"
                      type="tel"
                      placeholder="010-1234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="form-interest" className="mb-1 block text-sm font-medium text-tee-ink-strong">
                      관심 분야
                    </label>
                    <select
                      id="form-interest"
                      className="w-full rounded-lg border border-tee-stone bg-white px-4 py-2.5 text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    >
                      <option value="">선택하세요</option>
                      <option value="beginner">입문/초보 레슨</option>
                      <option value="swing">스윙 교정</option>
                      <option value="driver">드라이버 레슨</option>
                      <option value="iron">아이언 레슨</option>
                      <option value="short">숏게임/퍼팅</option>
                      <option value="course">코스 전략</option>
                      <option value="mental">멘탈 코칭</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="form-message" className="mb-1 block text-sm font-medium text-tee-ink-strong">
                      상담 내용
                    </label>
                    <Textarea
                      id="form-message"
                      placeholder="궁금한 점이나 원하시는 레슨에 대해 자유롭게 적어주세요."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <p className="text-sm text-tee-ink-muted">
                    작성해주신 내용을 검토 후 맞춤 프로를 추천해 드립니다.
                  </p>
                  <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        신청 중...
                      </>
                    ) : (
                      '상담 신청하기'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* No selection state */}
          {!selectedType && (
            <Card className="bg-tee-stone/20">
              <CardContent className="p-8 text-center">
                <p className="text-tee-ink-muted">
                  위에서 원하시는 상담 방식을 선택해 주세요.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Trust Signals */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <TrustSignal
              number="150+"
              label="등록 프로"
              description="검증된 전문 골프 프로"
            />
            <TrustSignal
              number="5분"
              label="평균 응답"
              description="카카오톡 평균 응답 시간"
            />
            <TrustSignal
              number="98%"
              label="만족도"
              description="상담 고객 만족도"
            />
          </div>
        </div>
      </main>
    </>
  );
}

interface ConsultationOptionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  highlight?: boolean;
}

function ConsultationOption({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
  highlight,
}: ConsultationOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-6 text-center transition-all ${
        isSelected
          ? 'border-tee-accent-primary bg-tee-accent-primary/5'
          : 'border-tee-stone bg-white hover:border-tee-accent-primary/50'
      }`}
    >
      {highlight && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-tee-warning px-3 py-0.5 text-xs font-medium text-tee-ink-strong">
          추천
        </span>
      )}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isSelected ? 'bg-tee-accent-primary/10' : 'bg-tee-stone/30'
        }`}
      >
        <Icon
          className={`h-6 w-6 ${isSelected ? 'text-tee-accent-primary' : 'text-tee-ink-light'}`}
        />
      </div>
      <div>
        <p className="font-semibold text-tee-ink-strong">{title}</p>
        <p className="text-sm text-tee-ink-muted">{description}</p>
      </div>
    </button>
  );
}

interface TrustSignalProps {
  number: string;
  label: string;
  description: string;
}

function TrustSignal({ number, label, description }: TrustSignalProps) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-tee-accent-primary">{number}</p>
      <p className="font-semibold text-tee-ink-strong">{label}</p>
      <p className="text-sm text-tee-ink-muted">{description}</p>
    </div>
  );
}
