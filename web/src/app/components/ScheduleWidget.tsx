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
                ? 'border-accent bg-accent-light text-accent-dark'
                : 'border-calm-stone bg-white text-calm-charcoal hover:border-accent hover:bg-calm-cloud')
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
                ? 'border-accent bg-accent text-white'
                : 'border-calm-stone bg-white text-calm-charcoal hover:border-accent hover:text-accent')
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* 선택된 날짜/시간 표시 */}
      <div className="rounded-lg bg-calm-cloud px-4 py-3 text-body-sm text-calm-charcoal">
        선택: <span className="font-semibold text-calm-obsidian">{dateISO}</span>{' '}
        <span className="font-semibold text-accent">{time || '—'}</span>
      </div>
    </div>
  )
}

