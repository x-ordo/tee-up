import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tee-ink-strong px-space-4 py-space-16 text-tee-background">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 gap-space-8 md:grid-cols-4">
          {/* Logo and About */}
          <div className="col-span-1">
            <Link href="/" className="mb-space-4 block text-h3 font-bold text-tee-surface">
              TEE:UP
            </Link>
            <p className="text-body text-tee-background/70">
              나만을 위한 프리미엄 골프 레슨 매칭 플랫폼
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="mb-space-4 text-h3 font-semibold">바로가기</h4>
            <ul>
              <li className="mb-space-2">
                <Link href="/profile" className="text-body text-tee-background/70 hover:text-tee-accent-secondary">
                  프로 찾기
                </Link>
              </li>
              <li className="mb-space-2">
                <Link href="/pricing" className="text-body text-tee-background/70 hover:text-tee-accent-secondary">
                  요금제
                </Link>
              </li>
              <li className="mb-space-2">
                <Link href="/onboarding/mood" className="text-body text-tee-background/70 hover:text-tee-accent-secondary">
                  AI 매칭 시작
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h4 className="mb-space-4 text-h3 font-semibold">법률</h4>
            <ul>
              <li className="mb-space-2">
                <Link href="/legal/terms" className="text-body text-tee-background/70 hover:text-tee-accent-secondary">
                  이용약관
                </Link>
              </li>
              <li className="mb-space-2">
                <Link href="/legal/privacy" className="text-body text-tee-background/70 hover:text-tee-accent-secondary">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="mb-space-4 text-h3 font-semibold">문의</h4>
            <ul>
              <li className="mb-space-2">
                <a href="mailto:contact@teeup.com" className="text-body text-tee-background/70 hover:text-tee-accent-secondary">
                  contact@teeup.com
                </a>
              </li>
              <li className="text-body text-tee-background/70">
                운영 시간: 09:00 - 18:00 (주말 및 공휴일 제외)
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-space-12 border-t border-tee-background/20 pt-space-8 text-center text-body text-tee-background/70">
          &copy; {currentYear} TEE:UP. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
