/**
 * SEO 구조화 데이터 (JSON-LD)
 * @description 검색 엔진을 위한 구조화된 데이터
 */

import type { IProProfile } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://teeup.golf';

// ============================================
// Organization Schema
// ============================================

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TEE:UP',
    alternateName: '티업',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: '프리미엄 골프 레슨 매칭 플랫폼 - 검증된 프로 골퍼와 함께하세요',
    foundingDate: '2025',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+82-2-000-0000',
      contactType: 'customer service',
      availableLanguage: ['Korean', 'English'],
      areaServed: 'KR',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Seoul',
      addressRegion: 'Gangnam',
      addressCountry: 'KR',
    },
    sameAs: [
      'https://www.instagram.com/teeup.official',
      'https://www.youtube.com/@teeup',
    ],
  };
}

// ============================================
// Website Schema
// ============================================

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TEE:UP',
    url: BASE_URL,
    description: '프리미엄 골프 레슨 매칭 플랫폼',
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/profile?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ============================================
// Local Business Schema
// ============================================

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#business`,
    name: 'TEE:UP 골프 레슨',
    image: `${BASE_URL}/og-image.jpg`,
    description: '프리미엄 골프 레슨 매칭 플랫폼',
    url: BASE_URL,
    telephone: '+82-2-000-0000',
    priceRange: '₩₩₩',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '테헤란로 123',
      addressLocality: '강남구',
      addressRegion: '서울',
      postalCode: '06234',
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.4979,
      longitude: 127.0276,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1200',
    },
  };
}

// ============================================
// Person Schema (Pro Profile)
// ============================================

export function getProProfileSchema(pro: IProProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/profile/${pro.slug}#person`,
    name: pro.title,
    description: pro.bio,
    url: `${BASE_URL}/profile/${pro.slug}`,
    image: pro.profile_image_url,
    jobTitle: '골프 프로',
    worksFor: {
      '@type': 'Organization',
      name: 'TEE:UP',
    },
    knowsAbout: pro.specialties,
    award: pro.certifications,
    aggregateRating: pro.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: pro.rating.toString(),
      bestRating: '5',
      worstRating: '1',
      ratingCount: pro.matched_lessons.toString(),
    } : undefined,
  };
}

// ============================================
// Service Schema
// ============================================

export function getServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '프리미엄 골프 레슨 매칭',
    provider: {
      '@type': 'Organization',
      name: 'TEE:UP',
    },
    serviceType: '골프 레슨',
    description: '검증된 프로 골퍼와의 1:1 맞춤 레슨 매칭 서비스',
    areaServed: {
      '@type': 'Country',
      name: '대한민국',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '골프 레슨 서비스',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '1:1 프라이빗 레슨',
            description: '프로 골퍼와의 개인 맞춤 레슨',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '그룹 레슨',
            description: '소그룹 골프 레슨 프로그램',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '필드 레슨',
            description: '실제 골프장에서의 라운드 레슨',
          },
        },
      ],
    },
  };
}

// ============================================
// FAQ Schema
// ============================================

export function getFAQSchema() {
  const faqs = [
    {
      question: 'TEE:UP은 어떤 서비스인가요?',
      answer: 'TEE:UP은 검증된 프로 골퍼와 골프 레슨을 원하는 골퍼를 연결해주는 프리미엄 매칭 플랫폼입니다.',
    },
    {
      question: '레슨 비용은 어떻게 되나요?',
      answer: '레슨 비용은 프로마다 다르며, 각 프로의 프로필 페이지에서 확인하실 수 있습니다. 일반적으로 1회 레슨 기준 10만원~30만원 수준입니다.',
    },
    {
      question: '프로 골퍼 검증은 어떻게 하나요?',
      answer: '모든 프로 골퍼는 자격증, 경력, 투어 경험 등을 기반으로 철저한 검증 과정을 거칩니다.',
    },
    {
      question: '레슨 예약은 어떻게 하나요?',
      answer: '원하는 프로의 프로필에서 "문의하기" 버튼을 통해 카카오톡으로 직접 상담하실 수 있습니다.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============================================
// Breadcrumb Schema
// ============================================

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================
// Script Component
// ============================================

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
