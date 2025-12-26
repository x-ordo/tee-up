"use client"

import { useMemo, useState } from 'react'

function addDays(d: Date, n: number) {
  const nd = new Date(d)
  nd.setDate(d.getDate() + n)
  return nd
}

function fmt(d: Date) {
  return d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'short' })
}

const defaultSlots = ['09:00', '10:30', '13:00', '15:00', '19:30']

export default function ScheduleWidget({ onSelect }: { onSelect?: (iso: string) => void }) {
  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i)), [])
  const [dayIndex, setDayIndex] = useState(0)
  const [time, setTime] = useState('')

  const dateISO = useMemo(() => days[dayIndex].toISOString().slice(0, 10), [days, dayIndex])

  const handleSelect = (t: string) => {
    setTime(t)
    onSelect?.(`${dateISO}T${t}:00`)
  }

  return (
    <div className="space-y-4">
      {/* 날짜 선택 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => setDayIndex(i)}
            className={
              'min-w-[110px] rounded-xl border-2 px-4 py-3 text-body-sm font-medium transition-all duration-200 ' +
              (i === dayIndex
                ? 'border-tee-accent-primary bg-tee-accent-primary/10 text-tee-accent-primary'
                : 'border-tee-stone bg-white text-tee-ink-light hover:border-tee-accent-primary hover:bg-tee-surface')
            }
          >
            {fmt(d)}
          </button>
        ))}
      </div>

      {/* 시간 선택 */}
      <div className="flex flex-wrap gap-2">
        {defaultSlots.map((t) => (
          <button
            key={t}
            onClick={() => handleSelect(t)}
            className={
              'rounded-full border-2 px-4 py-2 text-body-sm font-medium transition-all duration-200 ' +
              (time === t
                ? 'border-tee-accent-primary bg-tee-accent-primary text-white'
                : 'border-tee-stone bg-white text-tee-ink-light hover:border-tee-accent-primary hover:text-tee-accent-primary')
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* 선택된 날짜/시간 표시 */}
      <div className="rounded-lg bg-tee-surface px-4 py-3 text-body-sm text-tee-ink-light">
        선택: <span className="font-semibold text-tee-ink-strong">{dateISO}</span>{' '}
        <span className="font-semibold text-tee-accent-primary">{time || '—'}</span>
      </div>
    </div>
  )
}

