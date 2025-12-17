export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-tee-background">
      <div className="text-center">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-tee-stone border-t-accent" />
        <div
          className="absolute inset-2 animate-spin rounded-full border-4 border-tee-surface border-t-accent-light"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      <p className="text-body-sm font-medium text-tee-ink-muted">잠시만 기다려주세요</p>
    </div>
  </div>
);
}
