'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '../app/components/ThemeToggle'
import { Button } from './ui/Button'

const navLinks = [
  { href: '/profile', label: '전체 프로' },
  { href: '/pricing', label: '요금제' },
  { href: '/auth/login', label: '로그인' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-tee-ink-light/20 bg-tee-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-sans text-h2 font-bold text-tee-ink-strong">
          TEE<span className="text-tee-accent-secondary">:</span>UP
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-1 text-body text-tee-ink-strong transition-colors hover:text-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Primary CTA - Hidden on mobile */}
          <div className="hidden sm:block">
            <Button asChild variant="primary" size="md">
              <Link href="/auth/signup">
                바로 시작하기
              </Link>
            </Button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-tee-ink-strong transition-colors hover:bg-tee-surface focus:outline-none focus:ring-2 focus:ring-tee-accent-primary md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="border-t border-tee-ink-light/10 bg-tee-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-3 text-body font-medium text-tee-ink-strong transition-colors hover:bg-tee-surface hover:text-tee-accent-primary"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Button asChild variant="primary" size="md" className="w-full">
                <Link href="/auth/signup" onClick={closeMobileMenu}>
                  바로 시작하기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
