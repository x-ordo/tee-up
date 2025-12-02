"use client"

import { useEffect, useMemo, useState, useRef } from 'react'
import { useFocusTrap } from '@/hooks/useFocusTrap'

type Service = { name: string; duration: string; price: string }

export default function BookingModal({
  open,
  onClose,
  proName,
  services,
  selectedDateTime,
  type = 'reservation',
}: {
  open: boolean
  onClose: () => void
  proName: string
  services?: Service[]
  selectedDateTime?: string
  type?: 'reservation' | 'waitlist'
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [people, setPeople] = useState(1)
  const [location, setLocation] = useState('청담 Studio')
  const [service, setService] = useState(services?.[0]?.name ?? '')
  const [note, setNote] = useState('')
  const [agree, setAgree] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Focus management
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Store trigger element when modal opens
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement
      setSubmitted(false)
    }
  }, [open])

  // Restore focus when modal closes
  useEffect(() => {
    if (!open && triggerRef.current) {
      triggerRef.current.focus()
    }
  }, [open])

  // Focus trap and Escape key handling
  useFocusTrap({
    containerRef: modalRef,
    isActive: open,
    onClose,
  })

  const disabled = useMemo(() => !name || !phone || !agree, [name, phone, agree])

  if (!open) return null

  const handleSubmit = () => {
    // For MVP: just log and show confirmation
    console.log({ type, proName, selectedDateTime, name, phone, people, location, service, note })
    setSubmitted(true)
  }

  return (
    <div className="modal-overlay modal-overlay-animate" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="modal-container mx-4 max-w-lg modal-content-animate p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {!submitted ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h4 id="booking-modal-title" className="font-display text-display-sm font-semibold text-calm-obsidian">
                {type === 'reservation' ? '레슨 예약 정보' : '대기 신청'}
              </h4>
              <button
                onClick={onClose}
                className="btn-ghost"
              >
                닫기
              </button>
            </div>
            <p className="mb-6 text-body-sm text-calm-charcoal">
              담당 프로: <span className="font-semibold text-calm-obsidian">{proName}</span>
              {selectedDateTime ? (
                <>
                  {' '}· 예약 일시{' '}
                  <span className="font-semibold text-calm-obsidian">
                    {selectedDateTime.replace('T', ' ')}
                  </span>
                </>
              ) : null}
            </p>

            <div className="space-y-4">
              <input
                className="input"
                placeholder="성함"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="input"
                placeholder="연락처 (- 없이 입력)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="select"
                  value={people}
                  onChange={(e) => setPeople(parseInt(e.target.value || '1', 10))}
                >
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      레슨 인원 {n}
                    </option>
                  ))}
                </select>
                <select
                  className="select"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {(services?.length ? services : [{ name: 'Signature Lesson', duration: '90m', price: '₩180,000' }]).map(
                    (s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} · {s.duration} · {s.price}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <input
                className="input"
                placeholder="레슨 장소 (예: 청담 Studio)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <textarea
                className="input min-h-[100px] resize-none"
                placeholder="특별 요청사항"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <label className="flex items-center gap-2 text-body-xs text-calm-charcoal">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 rounded border-calm-stone text-accent focus:ring-accent"
                />
                예약 및 취소 규정에 동의합니다.
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={disabled}
              className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {type === 'reservation' ? '예약 신청하기' : '대기 신청하기'}
            </button>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
              <svg className="h-8 w-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-display text-display-sm font-semibold text-calm-obsidian">
              요청이 접수되었습니다
            </h4>
            <p className="mt-2 text-body-sm text-calm-charcoal">
              담당 컨시어지가 확인 후 신속히 안내해 드리겠습니다.
            </p>
            <button
              onClick={onClose}
              className="btn-secondary mt-6"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

