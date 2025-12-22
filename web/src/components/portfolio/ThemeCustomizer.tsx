'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/patterns/FormField'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { updateProTheme, type ThemeConfig } from '@/actions/theme'
import { isValidHexColor, getContrastRatio, hexToRgb } from '@/lib/color-utils'

interface ThemeCustomizerProps {
  profileId: string
  initialConfig: ThemeConfig
}

const FONT_PRESETS = [
  { value: 'default', label: 'Pretendard (기본)', description: '깔끔하고 현대적인 한글 폰트' },
  { value: 'modern', label: 'Inter', description: '글로벌 스탠다드 산세리프' },
  { value: 'classic', label: 'Noto Serif', description: '전통적이고 우아한 세리프' },
] as const

const PRESET_COLORS = [
  { color: '#0A362B', name: '포레스트 그린' },
  { color: '#1E3A5F', name: '네이비 블루' },
  { color: '#6B4423', name: '코퍼 브라운' },
  { color: '#4A1942', name: '버건디' },
  { color: '#2D2D2D', name: '차콜 블랙' },
  { color: '#B39A68', name: '골드' },
]

/**
 * Theme customizer component for portfolio white-labeling
 * Allows pros to customize accent color, logo, font, and dark mode settings
 */
export function ThemeCustomizer({ profileId, initialConfig }: ThemeCustomizerProps) {
  const [isPending, startTransition] = useTransition()
  const [config, setConfig] = useState<ThemeConfig>(initialConfig)
  const [customColor, setCustomColor] = useState(initialConfig.accentColor)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleColorChange = (color: string) => {
    setCustomColor(color)
    if (isValidHexColor(color)) {
      setConfig((prev) => ({ ...prev, accentColor: color }))
      setError(null)
    }
  }

  const handlePresetColorClick = (color: string) => {
    setCustomColor(color)
    setConfig((prev) => ({ ...prev, accentColor: color }))
    setError(null)
  }

  const handleFontChange = (fontPreset: ThemeConfig['fontPreset']) => {
    setConfig((prev) => ({ ...prev, fontPreset }))
  }

  const handleDarkModeToggle = () => {
    setConfig((prev) => ({ ...prev, darkModeEnabled: !prev.darkModeEnabled }))
  }

  const handleSave = () => {
    if (!isValidHexColor(config.accentColor)) {
      setError('올바른 HEX 색상 코드를 입력해주세요 (예: #0A362B)')
      return
    }

    // Check contrast ratio for accessibility
    const accentRgb = hexToRgb(config.accentColor)
    const whiteRgb = { r: 255, g: 255, b: 255 }
    if (accentRgb) {
      const contrastWithWhite = getContrastRatio(accentRgb, whiteRgb)
      if (contrastWithWhite < 4.5) {
        setError('선택한 색상이 너무 밝아 흰색 텍스트와의 대비가 부족합니다. 더 어두운 색상을 선택해주세요.')
        return
      }
    }

    startTransition(async () => {
      const result = await updateProTheme(profileId, config)
      if (result.success) {
        setSuccess(true)
        setError(null)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || '저장에 실패했습니다')
      }
    })
  }

  const hasChanges =
    config.accentColor !== initialConfig.accentColor ||
    config.fontPreset !== initialConfig.fontPreset ||
    config.darkModeEnabled !== initialConfig.darkModeEnabled

  return (
    <Card>
      <CardHeader>
        <CardTitle>포트폴리오 테마</CardTitle>
      </CardHeader>
      <CardContent className="space-y-space-6">
        {/* Accent Color */}
        <FormField label="액센트 컬러" htmlFor="accent-color">
          <div className="space-y-space-3">
            {/* Preset Colors */}
            <div className="flex flex-wrap gap-space-2">
              {PRESET_COLORS.map(({ color, name }) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePresetColorClick(color)}
                  className={`
                    h-10 w-10 rounded-lg border-2 transition-all
                    ${config.accentColor === color ? 'border-tee-ink-strong ring-2 ring-offset-2' : 'border-transparent'}
                  `}
                  style={{ backgroundColor: color }}
                  aria-label={name}
                  title={name}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex gap-space-2">
              <div
                className="h-10 w-10 rounded-lg border border-tee-stone"
                style={{ backgroundColor: isValidHexColor(customColor) ? customColor : '#CCCCCC' }}
              />
              <Input
                id="accent-color"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#0A362B"
                className="font-mono"
                maxLength={7}
              />
            </div>
          </div>
        </FormField>

        {/* Font Preset */}
        <FormField label="폰트 스타일" htmlFor="font-preset">
          <div className="space-y-space-2">
            {FONT_PRESETS.map(({ value, label, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleFontChange(value)}
                className={`
                  w-full rounded-lg border p-space-3 text-left transition-all
                  ${config.fontPreset === value
                    ? 'border-tee-accent-primary bg-tee-accent-primary/5'
                    : 'border-tee-stone hover:border-tee-ink-muted'
                  }
                `}
              >
                <p className="font-medium text-tee-ink-strong">{label}</p>
                <p className="text-sm text-tee-ink-muted">{description}</p>
              </button>
            ))}
          </div>
        </FormField>

        {/* Dark Mode Toggle */}
        <FormField label="다크 모드" htmlFor="dark-mode">
          <button
            type="button"
            onClick={handleDarkModeToggle}
            className={`
              relative h-6 w-11 rounded-full transition-colors
              ${config.darkModeEnabled ? 'bg-tee-accent-primary' : 'bg-tee-stone'}
            `}
            role="switch"
            aria-checked={config.darkModeEnabled}
            aria-label="다크 모드 토글"
          >
            <span
              className={`
                absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform
                ${config.darkModeEnabled ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
          <p className="mt-space-1 text-sm text-tee-ink-muted">
            {config.darkModeEnabled
              ? '방문자가 다크 모드를 선택할 수 있습니다'
              : '항상 라이트 모드로 표시됩니다'}
          </p>
        </FormField>

        {/* Preview */}
        <div className="rounded-lg border border-tee-stone p-space-4">
          <p className="mb-space-2 text-sm font-medium text-tee-ink-muted">미리보기</p>
          <div
            className="rounded-lg p-space-4 text-white"
            style={{ backgroundColor: config.accentColor }}
          >
            <p className="font-bold">레슨 상담하기</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">테마 설정이 저장되었습니다</Alert>}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="w-full"
        >
          {isPending ? '저장 중...' : '저장하기'}
        </Button>
      </CardContent>
    </Card>
  )
}
