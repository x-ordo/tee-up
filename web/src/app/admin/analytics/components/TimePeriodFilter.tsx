import { TimePeriod } from '@/hooks/useTimePeriod'

interface TimePeriodFilterProps {
  timePeriod: TimePeriod
  onPeriodChange: (period: TimePeriod) => void
}

export function TimePeriodFilter({ timePeriod, onPeriodChange }: TimePeriodFilterProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: '7', label: '7일' },
    { value: '30', label: '30일' },
    { value: '90', label: '90일' },
  ]

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={`rounded-lg px-4 py-2 text-body-sm font-medium transition-colors ${
            timePeriod === period.value
              ? 'bg-tee-accent-primary text-white'
              : 'bg-tee-surface text-tee-ink-light hover:bg-tee-stone'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
