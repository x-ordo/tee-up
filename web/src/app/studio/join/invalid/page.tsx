import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function InvalidInvitePage() {
  return (
    <div className="min-h-screen bg-tee-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-tee-surface rounded-2xl border border-tee-stone p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-tee-ink-strong mb-2">
          유효하지 않은 초대
        </h1>
        <p className="text-tee-ink-light mb-6">
          이 초대 링크는 만료되었거나 이미 사용되었습니다.
          <br />
          스튜디오 원장님에게 새 초대 링크를 요청해주세요.
        </p>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
