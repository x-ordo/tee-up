import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | TEE:UP',
  description: 'TEE:UP 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-tee-background px-space-4 py-space-16">
      <div className="mx-auto max-w-screen-md">
        <h1 className="mb-space-8 text-h1 font-bold text-tee-ink-strong">개인정보처리방침</h1>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              TEE:UP(이하 &quot;회사&quot;)은 다음의 목적을 위하여 개인정보를 처리합니다.
            </p>
            <ul className="mt-space-4 list-disc pl-space-6 text-body text-tee-ink-light">
              <li>회원 가입 및 관리</li>
              <li>골프 레슨 매칭 서비스 제공</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>고객 문의 응대</li>
            </ul>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">2. 수집하는 개인정보 항목</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
            </p>
            <ul className="mt-space-4 list-disc pl-space-6 text-body text-tee-ink-light">
              <li>필수항목: 이메일, 이름, 연락처</li>
              <li>선택항목: 프로필 사진, 골프 실력 정보</li>
            </ul>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              회원 탈퇴 시 또는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관계법령에 의해 보존할 필요가 있는 경우 일정 기간 보관합니다.
            </p>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">4. 개인정보의 제3자 제공</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              다만, 이용자가 사전에 동의한 경우나 법령에 의해 요구되는 경우에는 예외로 합니다.
            </p>
          </section>

          <section className="mb-space-8">
            <h2 className="mb-space-4 text-h2 font-semibold text-tee-ink-strong">5. 개인정보 보호책임자</h2>
            <p className="text-body text-tee-ink-light leading-relaxed">
              개인정보 보호에 관한 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
            </p>
            <ul className="mt-space-4 list-none text-body text-tee-ink-light">
              <li>이메일: privacy@teeup.com</li>
              <li>전화: 02-000-0000</li>
            </ul>
          </section>

          <div className="mt-space-12 rounded-lg bg-tee-surface p-space-6">
            <p className="text-caption text-tee-ink-light">
              본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.<br />
              정책 변경 시 웹사이트를 통해 공지합니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
