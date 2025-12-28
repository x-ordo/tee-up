import { withSentryConfig } from '@sentry/nextjs';

/**
 * Next.js Configuration
 * @type {import('next').NextConfig}
 *
 * 설정 변경 시 주의사항:
 * - 이 파일은 .mjs 확장자를 사용해야 합니다 (Next.js 14는 .ts 설정 파일 미지원)
 * - 변경 후 개발 서버 재시작 필요
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  /**
   * 이미지 최적화 설정
   *
   * 새로운 외부 이미지 도메인 추가 방법:
   * remotePatterns 배열에 객체 추가
   *
   * @example
   * {
   *   protocol: 'https',
   *   hostname: 'example.com',
   *   pathname: '/images/**',  // 선택사항: 특정 경로만 허용
   * }
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 추가 도메인은 여기에 등록
      // { protocol: 'https', hostname: 'cdn.example.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * 실험적 기능 설정
   *
   * optimizePackageImports: 번들 크기 최적화를 위한 패키지 목록
   * - 큰 패키지의 트리 쉐이킹 개선
   * - 초기 로딩 시간 단축
   *
   * instrumentationHook: Sentry 서버 사이드 초기화를 위해 필요
   *
   * @example
   * optimizePackageImports: ['@fontsource/pretendard', 'lodash', 'date-fns']
   */
  experimental: {
    optimizePackageImports: [], // Removed @fontsource/pretendard
    instrumentationHook: true, // Enable Sentry instrumentation
  },
};

/**
 * Sentry Configuration Options
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 */
const sentryWebpackPluginOptions = {
  // Organization and project settings (from environment)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token for uploading source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only upload source maps in production
  silent: process.env.NODE_ENV !== 'production',

  // Upload source maps to Sentry
  widenClientFileUpload: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Webpack-specific options
  bundleSizeOptimizations: {
    // Remove debug logging in production
    excludeDebugStatements: true,
  },
};

// Wrap config with Sentry
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions)
