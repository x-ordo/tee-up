"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { NoSearchResults } from './EmptyState'

export type ProItem = {
  slug: string
  name: string
  role: string
  image: string
  city: string
  specialties: string[]
  desc?: string
  rate?: string
}

export default function ProsDirectory({ pros }: { pros: ProItem[] }) {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [spec, setSpec] = useState('')

  const cities = useMemo(
    () => Array.from(new Set(pros.map((p) => p.city))).sort(),
    [pros]
  )
  const specs = useMemo(
    () => Array.from(new Set(pros.flatMap((p) => p.specialties))).sort(),
    [pros]
  )

  const filtered = useMemo(() => {
    return pros.filter((p) => {
      const matchesQ = q
        ? [p.name, p.role, p.city, ...p.specialties]
            .join(' ')
            .toLowerCase()
            .includes(q.toLowerCase())
        : true
      const matchesCity = city ? p.city === city : true
      const matchesSpec = spec ? p.specialties.includes(spec) : true
      return matchesQ && matchesCity && matchesSpec
    })
  }, [pros, q, city, spec])

  return (
    <section id="pros" className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="card p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr,200px,200px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이름, 도시, 역할, 태그 검색"
            className="input"
          />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="select"
          >
            <option value="">전체 지역</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            className="select"
          >
            <option value="">전체 분야</option>
            {specs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pro Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pro) => (
          <Link
            key={pro.slug}
            href={`/profile/${pro.slug}`}
            className="card group animate-slideUp"
          >
            {/* Pro Image */}
            <div className="relative h-64 overflow-hidden bg-calm-cloud">
              <Image
                src={pro.image}
                alt={pro.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Pro Info */}
            <div className="card-content">
              {/* Role & City */}
              <div className="flex items-center justify-between">
                <span className="text-body-xs font-medium uppercase tracking-wide text-calm-ash">
                  {pro.role}
                </span>
                <span className="rounded-full bg-calm-cloud px-3 py-1 text-body-xs text-calm-charcoal">
                  {pro.city}
                </span>
              </div>

              {/* Name */}
              <h4 className="font-display text-display-sm font-semibold text-calm-obsidian transition-colors duration-200 group-hover:text-accent">
                {pro.name}
              </h4>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {pro.specialties.slice(0, 3).map((t) => (
                  <span key={t} className="tag">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Rate & CTA */}
              <div className="flex items-center justify-between border-t border-calm-stone pt-4">
                <span className="text-body-sm font-semibold text-accent">
                  {pro.rate ?? '요청 시 안내'}
                </span>
                <span className="rounded-xl border-2 border-calm-stone bg-white px-4 py-2 text-body-sm font-medium text-calm-charcoal transition-all duration-200 group-hover:border-accent group-hover:bg-accent-light group-hover:text-accent-dark">
                  프로필 보기
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <NoSearchResults
          searchTerm={q || undefined}
          onClear={() => {
            setQ('')
            setCity('')
            setSpec('')
          }}
        />
      )}
    </section>
  )
}
