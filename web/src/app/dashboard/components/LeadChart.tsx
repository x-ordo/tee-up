'use client';

import { useMemo } from 'react';
import type { ITimeSeriesData } from '@/types';

interface LeadChartProps {
  data: ITimeSeriesData[];
  title?: string;
  height?: number;
}

export function LeadChart({
  data,
  title = '리드 추이',
  height = 200,
}: LeadChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return { points: '', max: 0, labels: [] };

    const max = Math.max(...data.map((d) => d.value), 1);
    const padding = 40;
    const chartWidth = 100;
    const chartHeight = height - padding * 2;

    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * chartWidth;
        const y = chartHeight - (d.value / max) * chartHeight + padding;
        return `${x},${y}`;
      })
      .join(' ');

    const areaPoints = `0,${height - padding} ${points} ${chartWidth},${height - padding}`;

    // 레이블용 날짜 (7일 간격)
    const labels = data
      .filter((_, i) => i % 7 === 0 || i === data.length - 1)
      .map((d) => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

    return { points, areaPoints, max, labels };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div
        className="card flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-calm-ash">데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="mb-4 text-lg font-semibold text-calm-obsidian">{title}</h3>

      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={40 + (height - 80) * ratio}
              x2="100"
              y2={40 + (height - 80) * ratio}
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Area */}
          <polygon
            points={chartData.areaPoints}
            fill="url(#areaGradient)"
            opacity="0.3"
          />

          {/* Line */}
          <polyline
            points={chartData.points}
            fill="none"
            stroke="var(--calm-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--calm-accent)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--calm-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Y-axis Labels */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-10 text-xs text-calm-ash">
          <span>{chartData.max}</span>
          <span>{Math.round(chartData.max / 2)}</span>
          <span>0</span>
        </div>

        {/* X-axis Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-calm-ash">
          {chartData.labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 전환 퍼널 차트
interface ConversionFunnelProps {
  data: {
    views: number;
    leads: number;
    responded: number;
    matched: number;
  };
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const stages = [
    { label: '프로필 조회', value: data.views },
    { label: '채팅 문의', value: data.leads },
    { label: '응답', value: data.responded },
    { label: '매칭 완료', value: data.matched },
  ];

  const maxValue = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="card p-6">
      <h3 className="mb-6 text-lg font-semibold text-calm-obsidian">전환 퍼널</h3>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const percentage = Math.round((stage.value / maxValue) * 100);
          const conversionRate =
            index > 0 && stages[index - 1].value > 0
              ? Math.round((stage.value / stages[index - 1].value) * 100)
              : null;

          return (
            <div key={stage.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-calm-charcoal">{stage.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-calm-obsidian">
                    {stage.value.toLocaleString()}
                  </span>
                  {conversionRate !== null && (
                    <span className="text-xs text-calm-ash">
                      ({conversionRate}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-calm-stone">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 전체 전환율 */}
      <div className="mt-6 rounded-lg bg-accent-light p-4 text-center">
        <p className="text-sm text-calm-charcoal">전체 전환율</p>
        <p className="text-3xl font-bold text-accent">
          {data.views > 0
            ? ((data.matched / data.views) * 100).toFixed(1)
            : 0}
          %
        </p>
        <p className="text-xs text-calm-ash">프로필 조회 → 매칭 완료</p>
      </div>
    </div>
  );
}
