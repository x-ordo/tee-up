import Link from 'next/link';
import { EmptyState } from '@/app/components/EmptyState';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-calm-white px-6">
      <EmptyState
        icon={
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light">
            <span className="text-display-sm font-bold text-accent">404</span>
          </div>
        }
        title="페이지를 찾을 수 없습니다"
        description="요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
        action={{ label: '홈으로 이동', href: '/' }}
      />
    </div>
  );
}
