export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <div className="text-center">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#d4af37]" />
          <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-[#f4e5c2]" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-sm font-medium text-white/60">로딩 중...</p>
      </div>
    </div>
  );
}
