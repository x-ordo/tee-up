import './global.css'
import '@fontsource/pretendard/400.css'
import '@fontsource/pretendard/500.css'
import '@fontsource/pretendard/600.css'
import '@fontsource/pretendard/700.css'
import type { Metadata, Viewport } from 'next'
import {
  JsonLd,
  getOrganizationSchema,
  getWebsiteSchema,
  getServiceSchema,
} from '@/lib/seo/structured-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://teeup.golf'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e27' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'TEE:UP | 프리미엄 골프 레슨 매칭 플랫폼',
    template: '%s | TEE:UP',
  },
  description:
    '검증된 프로 골퍼와 함께하는 프리미엄 골프 레슨. AI 기반 매칭으로 나에게 딱 맞는 프로를 찾아보세요. 강남 최고의 골프 레슨 플랫폼.',
  keywords: [
    '골프 레슨',
    '골프 프로',
    '강남 골프',
    '프리미엄 골프',
    '골프 코치',
    '개인 레슨',
    'LPGA 프로',
    'PGA 프로',
    'KPGA 프로',
    '골프 매칭',
    'golf lessons',
    'golf pro',
    'premium golf',
    'Seoul golf',
  ],
  authors: [{ name: 'TEE:UP', url: BASE_URL }],
  creator: 'TEE:UP',
  publisher: 'TEE:UP',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    url: BASE_URL,
    title: 'TEE:UP | 프리미엄 골프 레슨 매칭 플랫폼',
    description: '검증된 프로 골퍼와 함께하는 프리미엄 골프 레슨. AI 기반 매칭으로 나에게 딱 맞는 프로를 찾아보세요.',
    siteName: 'TEE:UP',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TEE:UP - 프리미엄 골프 레슨 플랫폼',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 600,
        height: 600,
        alt: 'TEE:UP 로고',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEE:UP | 프리미엄 골프 레슨 매칭 플랫폼',
    description: '검증된 프로 골퍼와 함께하는 프리미엄 골프 레슨',
    images: ['/og-image.jpg'],
    creator: '@teeup_golf',
    site: '@teeup_golf',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    yandex: '',
    yahoo: '',
    other: {
      'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || '',
    },
  },
  category: 'sports',
  classification: 'Golf Lesson Matching Platform',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#d4af37' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TEE:UP',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://pf.kakao.com" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* JSON-LD Structured Data */}
        <JsonLd data={getOrganizationSchema()} />
        <JsonLd data={getWebsiteSchema()} />
        <JsonLd data={getServiceSchema()} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
