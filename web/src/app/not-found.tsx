import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 text-8xl font-bold text-[#d4af37]">404</div>
        <h1 className="mb-4 text-2xl font-bold text-white">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mb-8 text-white/60">
          요청하신 페이지가 존재하지 않거나
          <br />
          이동되었을 수 있습니다.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] px-8 py-3 font-semibold text-[#0a0e27] transition-all hover:scale-105"
          >
            홈으로 이동
          </Link>
          <Link
            href="/profile"
            className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition-all hover:border-[#d4af37] hover:bg-[#d4af37]/10"
          >
            프로 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}
