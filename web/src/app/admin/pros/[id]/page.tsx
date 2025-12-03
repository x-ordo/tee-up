"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// 컬러 테마 프리셋
const colorThemes = [
  {
    id: 'navy-gold',
    name: '네이비 & 골드',
    bg: 'from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]',
    accent: '#d4af37',
    preview: 'linear-gradient(135deg, #0a0e27, #1a1f3a)',
  },
  {
    id: 'black-rose',
    name: '블랙 & 로즈골드',
    bg: 'from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]',
    accent: '#e0a899',
    preview: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
  },
  {
    id: 'green-gold',
    name: '그린 & 골드',
    bg: 'from-[#0d1f1a] via-[#1a3328] to-[#0d1f1a]',
    accent: '#d4af37',
    preview: 'linear-gradient(135deg, #0d1f1a, #1a3328)',
  },
  {
    id: 'burgundy-gold',
    name: '버건디 & 골드',
    bg: 'from-[#1a0d0d] via-[#2d1a1a] to-[#1a0d0d]',
    accent: '#d4af37',
    preview: 'linear-gradient(135deg, #1a0d0d, #2d1a1a)',
  },
]

// 섹션 구성
const availableSections = [
  { id: 'stats', name: '통계 카드', icon: '📊', description: '투어 경력, 평점 등 핵심 지표' },
  { id: 'video', name: '소개 영상', icon: '🎥', description: '프로필 비디오' },
  { id: 'instagram', name: 'Instagram', icon: '📸', description: 'Instagram 피드' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', description: 'YouTube 영상' },
  { id: 'metrics', name: '전문 분야', icon: '⛳', description: '드라이버, 아이언, 퍼팅 실력' },
  { id: 'programs', name: '레슨 프로그램', icon: '📚', description: '커리큘럼 소개' },
  { id: 'pricing', name: '요금제', icon: '💰', description: '레슨 가격' },
  { id: 'testimonials', name: '후기', icon: '⭐', description: '수강생 후기' },
  { id: 'location', name: '장소 & 정책', icon: '📍', description: '레슨 장소 및 예약 안내' },
]

export default function ProProfileEditorPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'layout' | 'preview'>('design')
  const [selectedTheme, setSelectedTheme] = useState('navy-gold')
  const [enabledSections, setEnabledSections] = useState([
    'stats', 'video', 'instagram', 'youtube', 'metrics', 'programs', 'pricing', 'testimonials', 'location'
  ])
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: 실제 저장 로직
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const [profileData, setProfileData] = useState({
    name: 'Hannah Park',
    title: 'LPGA Tour Professional',
    subtitle: 'LPGA Verified',
    city: 'Seoul',
    bio: '2019 KLPGA 챔피언십 우승 · US LPGA Tour 5년 · 국가대표 단체전 금메달',
    heroImage: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=1600&q=80',
    instagramHandle: '@hannahpark_golf',
    youtubeChannel: 'Hannah Park Golf',
  })

  const toggleSection = (sectionId: string) => {
    if (enabledSections.includes(sectionId)) {
      setEnabledSections(enabledSections.filter(id => id !== sectionId))
    } else {
      setEnabledSections([...enabledSections, sectionId])
    }
  }

  return (
    <div className="min-h-screen bg-calm-white">
      {/* Header */}
      <header className="border-b border-calm-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-calm-obsidian">프로필 편집</h1>
              <p className="text-body-sm text-calm-ash">프로 #{params.id} 프로필을 원하는 모습으로 꾸며보세요.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/pros" className="btn-ghost">
                ← 목록으로
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary"
                aria-busy={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    저장 중입니다
                  </span>
                ) : (
                  '변경사항 저장'
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-calm-stone bg-white">
        <nav className="mx-auto max-w-7xl px-6" aria-label="프로필 편집 탭">
          <div className="flex gap-8" role="tablist">
            <button
              onClick={() => setActiveTab('design')}
              role="tab"
              aria-selected={activeTab === 'design'}
              aria-controls="design-panel"
              className={`border-b-2 px-4 py-4 text-body-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-light focus:ring-inset ${
                activeTab === 'design'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-calm-charcoal hover:text-accent'
              }`}
            >
              🎨 디자인
            </button>
            <button
              onClick={() => setActiveTab('content')}
              role="tab"
              aria-selected={activeTab === 'content'}
              aria-controls="content-panel"
              className={`border-b-2 px-4 py-4 text-body-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-light focus:ring-inset ${
                activeTab === 'content'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-calm-charcoal hover:text-accent'
              }`}
            >
              ✏️ 콘텐츠
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              role="tab"
              aria-selected={activeTab === 'layout'}
              aria-controls="layout-panel"
              className={`border-b-2 px-4 py-4 text-body-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-light focus:ring-inset ${
                activeTab === 'layout'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-calm-charcoal hover:text-accent'
              }`}
            >
              📐 레이아웃
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              role="tab"
              aria-selected={activeTab === 'preview'}
              aria-controls="preview-panel"
              className={`border-b-2 px-4 py-4 text-body-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-light focus:ring-inset ${
                activeTab === 'preview'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-calm-charcoal hover:text-accent'
              }`}
            >
              👁️ 미리보기
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Design Tab */}
        {activeTab === 'design' && (
          <div id="design-panel" role="tabpanel" aria-labelledby="design-tab" className="space-y-8">
            <section>
              <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">컬러 테마</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all ${
                      selectedTheme === theme.id
                        ? 'border-accent shadow-lg'
                        : 'border-calm-stone hover:border-accent/50'
                    }`}
                  >
                    <div
                      className="mb-4 h-32 rounded-xl"
                      style={{ background: theme.preview }}
                    />
                    <h3 className="mb-2 font-semibold text-calm-obsidian">{theme.name}</h3>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full border border-calm-stone"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <span className="text-body-xs text-calm-ash">Accent</span>
                    </div>
                    {selectedTheme === theme.id && (
                      <div className="absolute right-4 top-4 rounded-full bg-accent p-2 text-white">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">커스텀 컬러</h2>
              <div className="card p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      배경 색상 (어두운 톤)
                    </label>
                    <input
                      type="color"
                      className="h-12 w-full cursor-pointer rounded-lg border border-calm-stone"
                      defaultValue="#0a0e27"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      액센트 색상 (강조 색)
                    </label>
                    <input
                      type="color"
                      className="h-12 w-full cursor-pointer rounded-lg border border-calm-stone"
                      defaultValue="#d4af37"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div id="content-panel" role="tabpanel" aria-labelledby="content-tab" className="space-y-8">
            <section>
              <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">기본 정보</h2>
              <div className="card p-8">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      이름
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      직함
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={profileData.title}
                      onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      자기소개
                    </label>
                    <textarea
                      className="input w-full"
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      활동 지역
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">히어로 이미지</h2>
              <div className="card p-8">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                    이미지 URL
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={profileData.heroImage}
                    onChange={(e) => setProfileData({...profileData, heroImage: e.target.value})}
                  />
                </div>
                <div className="relative h-48 rounded-xl border border-calm-stone bg-calm-cloud p-4 overflow-hidden">
                  <Image
                    src={profileData.heroImage}
                    alt="Hero preview"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
                <button className="btn-secondary mt-4 w-full">
                  📁 이미지 업로드
                </button>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">SNS 연동</h2>
              <div className="card p-8">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      Instagram 핸들
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="@username"
                      value={profileData.instagramHandle}
                      onChange={(e) => setProfileData({...profileData, instagramHandle: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      YouTube 채널
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Channel Name"
                      value={profileData.youtubeChannel}
                      onChange={(e) => setProfileData({...profileData, youtubeChannel: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">통계 & 지표</h2>
              <div className="card p-8">
                <div className="mb-6">
                  <h3 className="mb-4 font-semibold text-calm-obsidian">핵심 통계 (4개)</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                        라벨
                      </label>
                      <input type="text" className="input w-full" defaultValue="투어 경력" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                        값
                      </label>
                      <input type="text" className="input w-full" defaultValue="8+ 년" />
                    </div>
                  </div>
                  <button className="btn-ghost mt-4">+ 통계 추가</button>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold text-calm-obsidian">전문 분야 실력</h3>
                  <div className="space-y-4">
                    {['드라이버', '아이언', '쇼트게임', '퍼팅'].map((skill) => (
                      <div key={skill} className="flex items-center gap-4">
                        <span className="w-24 text-sm font-medium text-calm-charcoal">{skill}</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="92"
                          className="flex-1"
                        />
                        <span className="w-12 text-right font-mono text-sm text-calm-charcoal">92%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div id="layout-panel" role="tabpanel" aria-labelledby="layout-tab" className="space-y-8">
            <section>
              <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">섹션 구성</h2>
              <p className="mb-6 text-body-sm text-calm-ash">
                프로필에 표시할 섹션을 선택하세요. 드래그로 순서를 변경할 수 있습니다.
              </p>

              <div className="grid gap-4">
                {availableSections.map((section) => (
                  <div
                    key={section.id}
                    className={`card flex items-center justify-between p-6 transition-all ${
                      enabledSections.includes(section.id)
                        ? 'border-accent bg-accent/5'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="cursor-move text-2xl">::</div>
                      <div className="text-4xl">{section.icon}</div>
                      <div>
                        <h3 className="font-semibold text-calm-obsidian">{section.name}</h3>
                        <p className="text-body-sm text-calm-ash">{section.description}</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={enabledSections.includes(section.id)}
                        onChange={() => toggleSection(section.id)}
                        className="h-6 w-6 cursor-pointer accent-accent"
                      />
                      <span className="text-sm font-medium text-calm-charcoal">
                        {enabledSections.includes(section.id) ? '표시' : '숨김'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">레이아웃 설정</h2>
              <div className="card p-8">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      히어로 섹션 높이
                    </label>
                    <select className="input w-full">
                      <option value="screen">전체 화면 (100vh)</option>
                      <option value="80vh">80vh</option>
                      <option value="60vh">60vh</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      섹션 간격
                    </label>
                    <select className="input w-full">
                      <option value="compact">좁게</option>
                      <option value="normal">보통</option>
                      <option value="spacious">넓게</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-calm-charcoal">
                      최대 너비
                    </label>
                    <select className="input w-full">
                      <option value="6xl">1280px</option>
                      <option value="7xl">1536px (기본)</option>
                      <option value="full">전체 너비</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div id="preview-panel" role="tabpanel" aria-labelledby="preview-tab" className="space-y-8">
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-calm-obsidian">미리보기</h2>
                <div className="flex gap-3">
                  <button className="btn-ghost">📱 Mobile</button>
                  <button className="btn-ghost">💻 Desktop</button>
                  <button className="btn-primary">새 탭에서 열기 →</button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-calm-stone bg-calm-cloud">
                <iframe
                  src={`/profile/preview/${params.id}`}
                  className="h-[800px] w-full"
                  title="Profile Preview"
                />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
