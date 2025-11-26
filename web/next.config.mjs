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
   * 새 패키지 추가 방법:
   * 1. 큰 번들 크기를 가진 패키지 확인 (npm run build로 분석)
   * 2. 해당 패키지를 배열에 추가
   *
   * @example
   * optimizePackageImports: ['@fontsource/pretendard', 'lodash', 'date-fns']
   */
  experimental: {
    optimizePackageImports: ['@fontsource/pretendard'],
  },
}

export default nextConfig
