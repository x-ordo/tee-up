import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-calm-white px-6">
      <div className="max-w-md text-center">
        {/* 404 아이콘 */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent-light">
          <span className="text-display-lg font-bold text-accent">404</span>
        </div>

        <h1 className="mb-4 text-display-sm font-semibold text-calm-obsidian">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mb-8 text-body-md text-calm-charcoal">
          요청하신 페이지가 존재하지 않거나
          <br />
          이동되었을 수 있습니다.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-primary">
            홈으로 이동
          </Link>
          <Link href="/profile" className="btn-secondary">
            프로 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}
