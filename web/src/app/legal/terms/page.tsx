import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | TEE:UP',
  description: 'TEE:UP 서비스 이용약관',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-tee-background px-space-4 py-space-16">
      <div className="mx-auto max-w-screen-md">
        <h1 className="mb-space-8 text-h1 font-bold text-tee-ink-strong">이용약관</h1>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">제1조 (목적)</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              이 약관은 TEE:UP(이하 &quot;회사&quot;)이 제공하는 골프 레슨 매칭 서비스(이하 &quot;서비스&quot;)의
              이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">제2조 (정의)</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              1. &quot;서비스&quot;란 회사가 제공하는 골프 프로와 골퍼 간의 레슨 매칭 플랫폼을 의미합니다.<br />
              2. &quot;회원&quot;이란 이 약관에 동의하고 서비스를 이용하는 자를 의미합니다.<br />
              3. &quot;프로&quot;란 골프 레슨을 제공하는 전문가로서 회사의 검증을 받은 회원을 의미합니다.
            </p>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">제3조 (약관의 효력)</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
            </p>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">제4조 (예약 및 취소 정책)</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              1. 회원은 레슨 예약 후 다음 기준에 따라 취소 및 환불을 요청할 수 있습니다.<br />
              <span className="ml-4 block">가. 레슨 시작 24시간 전 취소: 결제 금액의 100% 환불</span>
              <span className="ml-4 block">나. 레슨 시작 12시간 전 취소: 결제 금액의 50% 환불</span>
              <span className="ml-4 block">다. 레슨 시작 12시간 이내 취소: 환불 불가</span>
              2. 프로의 사유로 인한 레슨 취소 시 전액 환불됩니다.<br />
              3. 천재지변 등 불가항력적 사유로 인한 취소는 회사와 협의하여 처리합니다.
            </p>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">제5조 (예약금 정책)</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              1. 레슨 예약 시 레슨 비용의 전액 또는 일부를 예약금으로 결제할 수 있습니다.<br />
              2. 예약금은 레슨 완료 후 프로에게 정산됩니다.<br />
              3. 예약금 결제 후 취소 시 제4조의 환불 정책이 적용됩니다.
            </p>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">제6조 (노쇼 정책)</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              1. &quot;노쇼&quot;란 사전 연락 없이 예약된 레슨에 불참하는 행위를 의미합니다.<br />
              2. 회원의 노쇼 발생 시 환불이 불가하며, 예약금 전액이 프로에게 정산됩니다.<br />
              3. 프로의 노쇼 발생 시 회원에게 전액 환불되며, 프로에게 별도의 제재가 적용될 수 있습니다.<br />
              4. 반복적인 노쇼 발생 시 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">제7조 (분쟁 해결 절차)</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              1. 레슨 관련 분쟁 발생 시 다음 절차에 따라 처리합니다.<br />
              <span className="ml-4 block">가. 분쟁 접수: 회원 또는 프로가 서비스 내 분쟁 신청</span>
              <span className="ml-4 block">나. 상대방 응답: 48시간 이내 상대방의 소명 기회 부여</span>
              <span className="ml-4 block">다. 회사 중재: 양측 의견 검토 후 7일 이내 중재안 제시</span>
              <span className="ml-4 block">라. 최종 결정: 중재안 수락 또는 외부 분쟁 조정 기관 안내</span>
              2. 분쟁 해결 시까지 관련 결제 금액은 회사가 보관합니다.<br />
              3. 허위 또는 악의적인 분쟁 신청 시 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <div className="mt-space-12 rounded-lg bg-tee-surface p-space-6">
            <p className="text-caption text-tee-ink-light">
              본 약관은 2025년 1월 1일부터 시행됩니다.<br />
              문의사항: contact@teeup.com
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
