'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T | string
  header: string
  /** Custom render function for cell content */
  render?: (item: T, value: unknown) => React.ReactNode
  /** Whether to hide this column on mobile */
  hideOnMobile?: boolean
  /** Alignment */
  align?: 'left' | 'center' | 'right'
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  /** Key field for unique row identification */
  keyField: keyof T
  /** Render function for mobile card view */
  mobileCard?: (item: T) => React.ReactNode
  /** Empty state when no data */
  emptyState?: React.ReactNode
  /** Optional className */
  className?: string
  /** Callback when row is clicked */
  onRowClick?: (item: T) => void
}

/**
 * Responsive table component
 * Shows table on desktop, cards on mobile
 */
export function ResponsiveTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyField,
  mobileCard,
  emptyState,
  className,
  onRowClick,
}: ResponsiveTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  const getValue = (item: T, key: string): unknown => {
    const keys = key.split('.')
    let value: unknown = item
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return value
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-space-3">
        {data.map((item) => {
          const key = String(item[keyField])

          if (mobileCard) {
            return (
              <div
                key={key}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'rounded-lg border border-tee-stone bg-tee-surface p-space-4 transition-all',
                  onRowClick && 'cursor-pointer hover:bg-tee-background/80 hover:border-tee-accent-primary/30 active:scale-[0.99]'
                )}
              >
                {mobileCard(item)}
              </div>
            )
          }

          // Default mobile card
          return (
            <div
              key={key}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'rounded-lg border border-tee-stone bg-tee-surface p-space-4 space-y-space-2 transition-all',
                onRowClick && 'cursor-pointer hover:bg-tee-background/80 hover:border-tee-accent-primary/30 active:scale-[0.99]'
              )}
            >
              {columns
                .filter((col) => !col.hideOnMobile)
                .map((col) => {
                  const value = getValue(item, col.key as string)
                  return (
                    <div key={col.key as string} className="flex justify-between">
                      <span className="text-sm text-tee-ink-muted">{col.header}</span>
                      <span className="text-sm text-tee-ink-strong">
                        {col.render ? col.render(item, value) : String(value ?? '-')}
                      </span>
                    </div>
                  )
                })}
            </div>
          )
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-tee-stone">
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={cn(
                    'p-space-3 text-sm font-medium text-tee-ink-muted text-left',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right'
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const key = String(item[keyField])
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'border-b border-tee-stone last:border-b-0 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-tee-background/80 group'
                  )}
                >
                  {columns.map((col) => {
                    const value = getValue(item, col.key as string)
                    return (
                      <td
                        key={col.key as string}
                        className={cn(
                          'p-space-3 text-sm text-tee-ink-strong',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right'
                        )}
                      >
                        {col.render ? col.render(item, value) : String(value ?? '-')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
