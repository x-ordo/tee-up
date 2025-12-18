'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch';
import { Shield, Crown, Check } from 'lucide-react';

export default function ConciergePage() {
  const [noShowProtection, setNoShowProtection] = useState(false);
  const [depositAmount, setDepositAmount] = useState('30000');
  const [currentTier, setCurrentTier] = useState<'free' | 'prestige'>('free');

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setDepositAmount(raw);
  };

  const handlePrestigeUpgrade = () => {
    // TODO: Toss Payments 카드 등록 연동
    window.open('https://tosspayments.com', '_blank');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-tee-ink-strong">
          컨시어지
        </h1>
        <p className="mt-2 text-tee-ink-light">
          나만의 매니지먼트
        </p>
      </div>

      {/* No-Show Protection Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <CardContent className="p-0">
          {/* Card Header with Icon */}
          <div className="flex items-center gap-4 border-b border-tee-stone/50 bg-gradient-to-r from-[#1A4D2E] to-[#2D6A4F] px-6 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              노쇼 방지 가드
            </h2>
          </div>

          {/* Card Body */}
          <div className="space-y-6 p-6">
            {/* Toggle Row */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-tee-ink-strong">
                진상 고객을 막아드릴까요?
              </span>
              <Switch
                checked={noShowProtection}
                onCheckedChange={setNoShowProtection}
              />
            </div>

            {/* Deposit Amount */}
            {noShowProtection && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="mb-3 block text-base font-medium text-tee-ink-light">
                  예약금 얼마 받을까요?
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatCurrency(depositAmount)}
                    onChange={handleDepositChange}
                    className="w-full max-w-[200px] border-0 border-b-2 border-[#1A4D2E] bg-transparent pb-2 text-4xl font-bold text-[#1A4D2E] outline-none transition-colors focus:border-[#D4AF37]"
                  />
                  <span className="text-2xl font-medium text-tee-ink-light">원</span>
                </div>
                <p className="mt-4 text-sm text-tee-ink-muted">
                  결제한 고객만 예약할 수 있습니다
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prestige Membership Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <CardContent className="p-0">
          {/* Card Header with Icon */}
          <div
            className="flex items-center gap-4 border-b border-[#D4AF37]/30 px-6 py-5"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)',
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
              <Crown className="h-6 w-6 text-[#1A4D2E]" />
            </div>
            <h2 className="text-xl font-bold text-[#1A4D2E]">
              프레스티지 멤버십
            </h2>
          </div>

          {/* Card Body */}
          <div className="space-y-4 p-6">
            {/* Tier Options */}
            <div className="grid gap-4">
              {/* Free Tier */}
              <button
                onClick={() => setCurrentTier('free')}
                className={`group relative flex items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${
                  currentTier === 'free'
                    ? 'border-tee-ink-light/30 bg-tee-background'
                    : 'border-transparent bg-tee-stone/30 hover:border-tee-ink-light/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    currentTier === 'free' ? 'bg-tee-ink-light/20' : 'bg-tee-stone'
                  }`}>
                    {currentTier === 'free' && <Check className="h-5 w-5 text-tee-ink-strong" />}
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-tee-ink-strong">Free</span>
                    <p className="text-sm text-tee-ink-light">일반 프로필</p>
                  </div>
                </div>
                <span className="rounded-full bg-tee-stone px-4 py-1.5 text-sm font-medium text-tee-ink-light">
                  현재
                </span>
              </button>

              {/* Prestige Tier */}
              <button
                onClick={() => setCurrentTier('prestige')}
                className={`group relative flex items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${
                  currentTier === 'prestige'
                    ? 'border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-[#F5E6A3]/10'
                    : 'border-transparent bg-tee-stone/30 hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      currentTier === 'prestige'
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#F5E6A3]'
                        : 'bg-gradient-to-br from-[#D4AF37]/50 to-[#F5E6A3]/50'
                    }`}
                  >
                    {currentTier === 'prestige' && <Check className="h-5 w-5 text-[#1A4D2E]" />}
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-tee-ink-strong">Prestige</span>
                    <p className="text-sm text-tee-ink-light">프리미엄 비서 + 골드 뱃지</p>
                  </div>
                </div>
                <span
                  className="rounded-full px-4 py-1.5 text-sm font-semibold text-[#1A4D2E]"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 100%)',
                  }}
                >
                  추천
                </span>
              </button>
            </div>

            {/* Upgrade Button */}
            {currentTier === 'prestige' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 mt-6 duration-300">
                <Button
                  onClick={handlePrestigeUpgrade}
                  className="h-14 w-full rounded-2xl border-0 text-lg font-bold text-[#1A4D2E] shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)',
                  }}
                >
                  월 19,900원에 내 비서를 고용하세요
                </Button>
                <p className="mt-3 text-center text-xs text-tee-ink-muted">
                  토스페이먼츠로 안전하게 결제됩니다
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
