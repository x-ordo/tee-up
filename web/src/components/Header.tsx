import Link from 'next/link'
import { ThemeToggle } from '../app/components/ThemeToggle'
import { Button } from './ui/Button' // Import Button component

export default function Header() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-tee-ink-light/20 bg-tee-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-sans text-h2 font-bold text-tee-ink-strong">
          TEE<span className="text-tee-accent-secondary">:</span>UP
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#"
            className="rounded-lg px-2 py-1 text-body text-tee-ink-strong transition-colors hover:text-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary"
          >
            전체 프로
          </Link>
          <Link
            href="#"
            className="rounded-lg px-2 py-1 text-body text-tee-ink-strong transition-colors hover:text-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary"
          >
            소개
          </Link>
          <Link
            href="#"
            className="rounded-lg px-2 py-1 text-body text-tee-ink-strong transition-colors hover:text-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary"
          >
            문의
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Primary CTA */}
          <Button asChild variant="primary" size="md">
            <Link href="/get-started">
              바로 시작하기
            </Link>
          </Button>
          {/* Mobile Hamburger (Hidden on desktop) */}
          {/* <button className="md:hidden">
            <svg
              className="h-6 w-6 text-tee-ink-strong"
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
          </button> */}
        </div>
      </div>
    </nav>
  )
}
