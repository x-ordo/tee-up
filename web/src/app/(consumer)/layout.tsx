import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { User, Calendar, MessageSquare, Settings, LogOut, Heart, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Header from '@/components/Header'

const NAV_ITEMS = [
  { href: '/my', label: '내 예약', icon: Calendar },
  { href: '/my/saved', label: '저장한 프로', icon: Heart },
  { href: '/my/consultations', label: '상담 현황', icon: MessageSquare },
  { href: '/my/lessons', label: '레슨 이력', icon: BookOpen },
  { href: '/my/settings', label: '설정', icon: Settings },
]

export default async function ConsumerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=/my')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', user.id)
    .single()

  // Redirect pro users to pro dashboard
  if (profile?.role === 'pro') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-tee-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* User Profile Card */}
              <div className="rounded-2xl border border-tee-stone/60 bg-white p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tee-accent-primary/10">
                    <User className="h-6 w-6 text-tee-accent-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-tee-ink-strong">
                      {profile?.full_name || '회원'}
                    </p>
                    <p className="truncate text-sm text-tee-ink-muted">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-tee-ink-light transition-colors hover:bg-white hover:text-tee-ink-strong hover:shadow-sm"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Logout Button */}
              <form action="/auth/logout" method="post" className="pt-4 border-t border-tee-stone/40">
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start gap-3 text-tee-ink-muted hover:text-tee-error"
                >
                  <LogOut className="h-5 w-5" />
                  로그아웃
                </Button>
              </form>
            </div>
          </aside>

          {/* Mobile Navigation */}
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-tee-stone bg-white px-4 py-2 text-sm font-medium text-tee-ink-light transition-colors hover:border-tee-accent-primary hover:text-tee-accent-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
