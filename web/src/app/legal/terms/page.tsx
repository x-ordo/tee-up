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
