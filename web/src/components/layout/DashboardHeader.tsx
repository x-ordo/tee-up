'use client'

import Link from 'next/link'
import { User, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DashboardHeaderProps {
  userEmail?: string
  onMenuClick?: () => void
}

export function DashboardHeader({ userEmail, onMenuClick }: DashboardHeaderProps) {
  return (
    <header
      data-testid="dashboard-header"
      className="sticky top-0 z-40 flex h-16 items-center gap-space-4 border-b border-tee-stone bg-tee-surface px-space-4 lg:px-space-6"
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="메뉴"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile logo */}
      <Link
        href="/dashboard"
        className="lg:hidden font-pretendard text-lg font-bold text-tee-ink-strong hover:no-underline"
      >
        TEE:UP
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-space-2"
            aria-label="사용자 메뉴"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tee-accent-primary/10">
              <User className="h-4 w-4 text-tee-accent-primary" />
            </div>
            <span className="hidden sm:inline text-sm text-tee-ink-light">
              {userEmail || '사용자'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="flex items-center gap-space-2">
              <User className="h-4 w-4" />
              <span>프로필 설정</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action="/auth/signout" method="post" className="w-full">
              <button
                type="submit"
                className="flex w-full items-center gap-space-2 text-tee-error"
              >
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
