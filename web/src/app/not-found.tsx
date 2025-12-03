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
        title="페이지를 찾지 못했어요"
        description="주소가 잘못되었거나 페이지가 이동했을 수 있어요."
        action={{ label: '홈으로 돌아가기', href: '/' }}
      />
    </div>
  );
}
