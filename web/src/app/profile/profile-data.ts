export type StorySection = {
  title: string
  heading: string
  body: string
  image: string
  align: 'left' | 'right'
}

export type SpecGroup = {
  title: string
  specs: { label: string; value: string }[]
}

export type Testimonial = {
  quote: string
  name: string
  avatar: string
}

export type InstagramPost = {
  id: string
  url: string
  image: string
}

export type YouTubeVideo = {
  id: string
  title: string
  url: string
}

export type ProfileData = {
  profile: {
    name: string
    title: string
    subtitle: string
    summary: string
    heroImage: string
    tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
    city?: string
    languages?: string[]
    instagramUsername?: string
    youtubeChannelId?: string
    kakaoTalkId?: string
  }
  highlights: { label: string; value: string; detail: string }[]
  storySections: StorySection[]
  specGroups: SpecGroup[]
  testimonials: Testimonial[]
  instagramPosts?: InstagramPost[]
  youtubeVideos?: YouTubeVideo[]
  services?: { name: string; duration: string; price: string }[]
  locations?: string[]
  policies?: string[]
  metrics?: {
    driver: number
    iron: number
    short: number
    putting: number
  }
  video?: {
    url: string
    poster: string
  }
  themes?: { title: string; description: string }[]
  curriculum?: string[]
  priceTiers?: { name: string; duration: string; price: string }[]
  similarPros?: { slug: string; name: string; role: string; city: string; image: string }[]
}

export const profileLibrary: Record<string, ProfileData> = {
  'elliot-kim': {
    profile: {
      name: 'Elliot Kim',
      title: 'Signature Performance Architect',
      subtitle: 'Private Member Profile',
      summary:
        '투어 경험과 라이프스타일을 모두 아는 엘리트 코치. 동작은 단순하게, 피드백은 정교하게 전달해 세션마다 깔끔한 완성도를 제공합니다.',
      heroImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80',
      instagramUsername: 'elliotkim.golf',
      youtubeChannelId: 'UCE_M8A5yxnLfW0KghEeajjQ',
      kakaoTalkId: '_xabc123',
    },
    highlights: [
      { label: 'Invitational 우승', value: '8', detail: '아시아 투어 & 유럽 서킷' },
      { label: '전담 VIP', value: '24', detail: 'CEO / 아트디렉터 / 아티스트' },
      { label: '평균 스코어 감소', value: '-4.8', detail: '4주 시그니처 프로그램' },
      { label: '거점 도시', value: 'Seoul · Tokyo · LA', detail: '글로벌 투어 동행' },
    ],
    storySections: [
      {
        title: 'SILHOUETTE',
        heading: '과하지 않은 라인과 리듬으로 만드는 시그니처 스윙',
        body: '동작을 최소화해 필요한 감각만 잡아드립니다. 초고속 카메라와 모션 캡처로 내 스윙 실루엣을 바로 확인하고 다듬을 수 있어요.',
        image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
        align: 'left',
      },
      {
        title: 'AURA',
        heading: '차분한 톤온톤 스튜디오에서 몰입도 높게',
        body: '조명과 음악까지 신경 쓴 공간에서 편안하게 연습합니다. 입장부터 마무리까지 전담 큐레이터가 동선을 챙겨 드려요.',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        align: 'right',
      },
      {
        title: 'PRECISION',
        heading: '한눈에 읽히는 깔끔한 피드백',
        body: '모션 그래프와 퍼팅 스트로크를 보기 쉽게 정리해 드립니다. 세션 후에도 언제든 다시 확인하며 바로 연습에 옮길 수 있어요.',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
        align: 'left',
      },
    ],
    specGroups: [
      {
        title: '코어 데이터',
        specs: [
          { label: '핸디캡', value: '+2.1' },
          { label: '드라이버 캐리', value: '287m' },
          { label: '그린 적중률', value: '82%' },
          { label: '퍼팅 게인', value: '+1.6' },
        ],
      },
      {
        title: '세션 구성',
        specs: [
          { label: '러닝타임', value: '120분 / 1:1' },
          { label: '스팟 로케이션', value: '청담 · 한남 · 한남하우스' },
          { label: '장비', value: '3D 모션 플레이트 · LiDAR 스캐너' },
          { label: '컨시어지', value: '전담 드라이버 & 스타일링 파트너' },
        ],
      },
    ],
    testimonials: [
      {
        quote:
          '“매 세션마다 새로운 애플 기기를 언박싱하는 기분. 디자인과 분석이 결합된 보고서를 통해 브랜드 런칭 프레젠테이션 같은 몰입감을 느꼈다.”',
        name: 'Luxury Fashion Director · Seoul',
        avatar: 'https://images.unsplash.com/photo-1502452213786-a5bc0a67e963?auto=format&fit=crop&w=500&q=80',
      },
      {
        quote:
          '“엘리엇의 리듬은 명품 브랜드 뮤직디렉터처럼 정교하다. 해외 일정이 많아도 원격 피드백으로 흐름이 끊기지 않는다.”',
        name: 'Media Tech Founder · Los Angeles',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      },
    ],
    instagramPosts: [
      { id: '1', url: '#', image: 'https://images.unsplash.com/photo-1587162146766-e76b22884690?auto=format&fit=crop&w=800&q=80' },
      { id: '2', url: '#', image: 'https://images.unsplash.com/photo-1562768939-a7e697a22115?auto=format&fit=crop&w=800&q=80' },
      { id: '3', url: '#', image: 'https://images.unsplash.com/photo-1614065968843-8f6835102a90?auto=format&fit=crop&w=800&q=80' },
      { id: '4', url: '#', image: 'https://images.unsplash.com/photo-1550992973-1cef39f8633c?auto=format&fit=crop&w=800&q=80' },
      { id: '5', url: '#', image: 'https://images.unsplash.com/photo-1582669357053-9d6d45942472?auto=format&fit=crop&w=800&q=80' },
      { id: '6', url: '#', image: 'https://images.unsplash.com/photo-1543349562-59765f025709?auto=format&fit=crop&w=800&q=80' },
    ],
    youtubeVideos: [
      { id: 'LXb3EKWsInQ', title: '깨끗한 아이언 임팩트를 위한 완벽한 방법', url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ' },
      { id: '2G9xrightg', title: '올바른 골프 스윙의 첫 번째 단계', url: 'https://www.youtube.com/watch?v=2G9xrightg' },
      { id: 'A_wK43CV1mE', title: '일관된 드라이버 샷을 위한 완벽한 루틴', url: 'https://www.youtube.com/watch?v=A_wK43CV1mE' },
      { id: '5k23iS5S1i4', title: '골프 스윙의 기초: 파워와 정확성을 한번에', url: 'https://www.youtube.com/watch?v=5k23iS5S1i4' },
    ],
    services: [
      { name: 'Intro Fitting', duration: '60m', price: '₩120,000' },
      { name: 'Signature Lesson', duration: '90m', price: '₩180,000' },
      { name: 'On-course Coaching', duration: '120m', price: '₩260,000' },
    ],
    locations: ['청담 Studio', '한남 House', '제주 · 부산(주말)'],
    policies: ['D-1 18:00 변경 가능', '소액 보증금 결제', '현장/간편결제, 영수증 발행'],
    metrics: { driver: 93, iron: 90, short: 87, putting: 84 },
    video: {
      url: 'https://cdn.coverr.co/videos/coverr-golfer-practicing-his-swing-1807/1080p.mp4',
      poster: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    },
    themes: [
      { title: 'Tempo Ritual', description: '호흡과 템포를 정돈한 뒤 스윙을 시작하는 시그니처 루틴.' },
      { title: 'Data + Emotion', description: '숫자 기반 분석과 감각적인 비유를 동시에 전달.' },
      { title: 'Night Range Immersion', description: '음악·조명·촬영을 결합한 야간 몰입 세션.' },
    ],
    curriculum: ['Baseline 분석 및 3D 모션', 'Tempo & Transition', '코스 매니지먼트 시뮬레이션', 'Night Range Immersion'],
    priceTiers: [
      { name: 'Studio 60m', duration: '60분', price: '₩150,000' },
      { name: 'Studio 90m', duration: '90분', price: '₩220,000' },
      { name: 'Field 120m', duration: '120분', price: '₩320,000' },
    ],
    similarPros: [
      {
        slug: 'hannah-park',
        name: 'Hannah Park',
        role: 'LPGA International Lead',
        city: 'Seoul',
        image: 'https://images.unsplash.com/photo-1502452213786-a5bc0a67e963?auto=format&fit=crop&w=500&q=80',
      },
      {
        slug: 'mina-jang',
        name: 'Mina Jang',
        role: 'Short Game Director',
        city: 'Busan',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  'hannah-park': {
    profile: {
      name: 'Hannah Park',
      title: 'LPGA International Lead',
      subtitle: 'Private Member Profile',
      summary:
        '국가대표 단체전 전략을 다년간 총괄해온 한나는 감성적인 스토리텔링과 강한 멘탈 플로우를 결합하여 라운드를 설계합니다. 파인주얼리 쇼룸처럼 고요한 공간에서 집중력을 디자인합니다.',
      heroImage: 'https://images.unsplash.com/photo-1521579987242-334c248be0dc?auto=format&fit=crop&w=1400&q=80',
      instagramUsername: 'hannahpark.golf',
      youtubeChannelId: 'UCg1r5G0cT7d_E0g6g5g6gQ',
    },
    highlights: [
      { label: '국가대표 코칭', value: '6 yrs', detail: '아시아 단체전 연속 메달' },
      { label: '라이브 퍼포먼스', value: '210+', detail: 'VIP 플레이 동행' },
      { label: '멘탈 프로토콜', value: '4-step', detail: 'Studio Tempo Ritual' },
      { label: '전담 도시', value: 'Seoul · Busan', detail: '해안 레인지' },
    ],
    storySections: [
      {
        title: 'POISE',
        heading: '하우 쿠튀르 피팅 룸 같은 루틴.',
        body: '라운지 조명, 향, 음악을 직접 큐레이션하여 선수들이 긴장을 풀고 집중하도록 돕습니다. 사전 브리핑 문서는 패션 컬렉션 룩북 형식으로 제공됩니다.',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        align: 'left',
      },
      {
        title: 'TACTILITY',
        heading: '프리미엄 소재 샤프트 + 커스텀 그립.',
        body: '럭셔리 레더 공방과 협업한 커스텀 그립, 미세한 질감을 체감할 수 있는 트레이닝 도구로 감각을 깨웁니다.',
        image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
        align: 'right',
      },
      {
        title: 'MENTAL FLOW',
        heading: '파인 아트 갤러리처럼 정돈된 피드백.',
        body: '감성적인 문장과 데이터 노트를 조합해 세션 결과를 전달합니다. 디지털 캔버스에서 바로 리뷰할 수 있어 투어 이동 중에도 루틴을 유지합니다.',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        align: 'left',
      },
    ],
    specGroups: [
      {
        title: '코어 데이터',
        specs: [
          { label: '핸디캡', value: '+1.4' },
          { label: '드라이버 캐리', value: '272m' },
          { label: '페어웨이 적중', value: '79%' },
          { label: '클러치 퍼팅', value: '91%' },
        ],
      },
      {
        title: '세션 구성',
        specs: [
          { label: '러닝타임', value: '100분 / 1:2' },
          { label: '스팟 로케이션', value: '청담 · 해운대' },
          { label: '장비', value: 'AR 퍼팅 랩 · 8K 카메라' },
          { label: '컨시어지', value: '웰니스 티 + 셰프 페어링' },
        ],
      },
    ],
    testimonials: [
      {
        quote: '“하우스 콘서트처럼 조용하고 집중되는 환경. 감정선까지 관리해줘서 프리젠테이션 전 멘탈까지 정비됩니다.”',
        name: 'Brand Experience VP · Seoul',
        avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80',
      },
      {
        quote: '“데이터보다 먼저 감각을 깨우는 방식이 인상적이었습니다. 팀워크 워크숍에도 초대하고 싶어요.”',
        name: 'Creative Studio Founder · Busan',
        avatar: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80',
      },
    ],
    instagramPosts: [
      { id: '1', url: '#', image: 'https://images.unsplash.com/photo-1610910148293-111241c6b29f?auto=format&fit=crop&w=800&q=80' },
      { id: '2', url: '#', image: 'https://images.unsplash.com/photo-1593411195156-78a31b9beb35?auto=format&fit=crop&w=800&q=80' },
      { id: '3', url: '#', image: 'https://images.unsplash.com/photo-1574269894299-78a0050c538a?auto=format&fit=crop&w=800&q=80' },
      { id: '4', url: '#', image: 'https://images.unsplash.com/photo-1597402636259-7cec15307044?auto=format&fit=crop&w=800&q=80' },
      { id: '5', url: '#', image: 'https://images.unsplash.com/photo-1597402636259-7cec15307044?auto=format&fit=crop&w=800&q=80' },
      { id: '6', url: '#', image: 'https://images.unsplash.com/photo-1574269894299-78a0050c538a?auto=format&fit=crop&w=800&q=80' },
    ],
    youtubeVideos: [
      { id: 'Fz_Xp0lA-f4', title: '골프 멘탈 게임: 자신감과 집중력 향상', url: 'https://www.youtube.com/watch?v=Fz_Xp0lA-f4' },
      { id: '0a3Qk_7b4k4', title: '코스 위에서의 멘탈 전략', url: 'https://www.youtube.com/watch?v=0a3Qk_7b4k4' },
    ],
    services: [
      { name: 'Tempo & Short Game', duration: '90m', price: '₩190,000' },
      { name: 'Mental Routine Clinic', duration: '60m', price: '₩140,000' },
    ],
    locations: ['청담 Studio', '해운대 Pop-up'],
    policies: ['D-1 18:00 변경 가능', '촬영 자료 제공', '보증금 결제 후 확정'],
    metrics: { driver: 88, iron: 92, short: 94, putting: 90 },
    video: {
      url: 'https://cdn.coverr.co/videos/coverr-golf-player-practicing-2468/1080p.mp4',
      poster: 'https://images.unsplash.com/photo-1521579987242-334c248be0dc?auto=format&fit=crop&w=1200&q=80',
    },
    themes: [
      { title: 'Poise & Rhythm', description: '정적인 라인과 리듬으로 균형을 잡는 LPGA식 접근.' },
      { title: 'Mental Atelier', description: '패션 아틀리에 같은 감각 훈련 공간.' },
    ],
    curriculum: ['감각 워밍업', 'Tempo Drill', 'Short Game Matrix', 'On-course Debrief'],
    priceTiers: [
      { name: 'Atelier 80m', duration: '80분', price: '₩210,000' },
      { name: 'Field 9H', duration: '필드 9홀', price: '₩320,000' },
    ],
    similarPros: [
      {
        slug: 'elliot-kim',
        name: 'Elliot Kim',
        role: 'PGA Performance Coach',
        city: 'Seoul',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80',
      },
      {
        slug: 'mina-jang',
        name: 'Mina Jang',
        role: 'Short Game Director',
        city: 'Busan',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  'mina-jang': {
    profile: {
      name: 'Mina Jang',
      title: 'Short Game Director',
      subtitle: 'Private Member Profile',
      summary:
        '투어급 쇼트게임과 퍼팅 실험실을 이끄는 미나는 카본 파이버 소재와 고급 사운드 디자인으로 감각을 정교하게 조율합니다. 명품 워치처럼 치밀한 타이밍을 구현합니다.',
      heroImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80',
      instagramUsername: 'minajang.lab',
      youtubeChannelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
    },
    highlights: [
      { label: '투어 동행', value: '14', detail: 'Major putting coach' },
      { label: '랩 디바이스', value: '11', detail: 'ARMJ Lab Signature' },
      { label: '거리 오차', value: '±0.3m', detail: '칩샷 오토메이션' },
      { label: '세션 타입', value: 'Soirée · Atelier', detail: 'Night Range & Studio' },
    ],
    storySections: [
      {
        title: 'SCULPT',
        heading: '조명과 그림자로 리듬을 깎아낸다.',
        body: '고급 시네마 조명과 음영을 이용해 그린 컨투어를 시각화합니다. 손끝 감각이 살아나도록 천천히 움직이는 그림자를 연출합니다.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
        align: 'left',
      },
      {
        title: 'SOUND',
        heading: '워치메이킹에서 착안한 사운드 큐.',
        body: '초고해상도 마이크로 임팩트 사운드를 녹음하고 스테레오로 플레이백하여 거리 감각을 교정합니다.',
        image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
        align: 'right',
      },
      {
        title: 'CRAFT',
        heading: '미세 조정 가능한 퍼터 앰플리파이어.',
        body: '장인의 손길로 제작된 퍼터 웨이트와 인터체인저블 소프트 굿즈로 스윙웨이트를 즉시 조절합니다.',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        align: 'left',
      },
    ],
    specGroups: [
      {
        title: '코어 데이터',
        specs: [
          { label: '핸디캡', value: '+0.8' },
          { label: '어프로치 게인', value: '+2.3' },
          { label: '퍼팅 게인', value: '+2.8' },
          { label: '샷 크리에이티브', value: '36 set' },
        ],
      },
      {
        title: '세션 구성',
        specs: [
          { label: '러닝타임', value: '90분 / 1:1' },
          { label: '스팟 로케이션', value: '성수 · 도산' },
          { label: '장비', value: 'Carbon putting rail · LiDAR green map' },
          { label: '컨시어지', value: 'Night chauffeured ride' },
        ],
      },
    ],
    testimonials: [
      {
        quote: '“퍼팅 사운드를 이렇게 정교하게 다루는 코치는 처음입니다. 하이엔드 워치 브랜드 PT 같은 집중감을 느꼈습니다.”',
        name: 'Luxury Watch PR · Tokyo',
        avatar: 'https://images.unsplash.com/photo-1521579987242-334c248be0dc?auto=format&fit=crop&w=500&q=80',
      },
      {
        quote: '“칩샷 실험실에서 얻은 감각이 바로 대회에서 재현됐어요. 감각 튜닝에 진심인 분들에게 추천합니다.”',
        name: 'Pro-Am Champion · Seoul',
        avatar: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80',
      },
    ],
    instagramPosts: [
      { id: '1', url: '#', image: 'https://images.unsplash.com/photo-1519548427-4a5d81254385?auto=format&fit=crop&w=800&q=80' },
      { id: '2', url: '#', image: 'https://images.unsplash.com/photo-1628882829143-61690258145a?auto=format&fit=crop&w=800&q=80' },
      { id: '3', url: '#', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80' },
      { id: '4', url: '#', image: 'https://images.unsplash.com/photo-1610920427906-5de8c052865e?auto=format&fit=crop&w=800&q=80' },
      { id: '5', url: '#', image: 'https://images.unsplash.com/photo-1610920427906-5de8c052865e?auto=format&fit=crop&w=800&q=80' },
      { id: '6', url: '#', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80' },
    ],
    youtubeVideos: [
      { id: 'hMyj2oO3s_U', title: '퍼팅을 마스터하는 법: 모든 골퍼를 위한 팁', url: 'https://www.youtube.com/watch?v=hMyj2oO3s_U' },
      { id: 'GZG_2i831Co', title: '칩샷의 비밀: 그린 주변에서 점수 줄이기', url: 'https://www.youtube.com/watch?v=GZG_2i831Co' },
    ],
    services: [
      { name: 'Putting Lab', duration: '60m', price: '₩150,000' },
      { name: 'Chipping Diagnostics', duration: '60m', price: '₩140,000' },
      { name: 'Short Game Intensive', duration: '120m', price: '₩250,000' },
    ],
    locations: ['성수 Lab', '도산 Studio'],
    policies: ['D-1 18:00 변경 가능', '장비 세팅 포함', '보증금 결제 후 확정'],
    metrics: { driver: 78, iron: 86, short: 96, putting: 95 },
    video: {
      url: 'https://cdn.coverr.co/videos/coverr-perfecting-the-shot-0206/1080p.mp4',
      poster: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    },
    themes: [
      { title: 'Sound Craft', description: '임팩트 사운드를 이용해 감각을 교정.' },
      { title: 'Night Atelier', description: '야간 조명과 그림자로 리듬을 조형.' },
    ],
    curriculum: ['Putting Sequencing', 'Distance Window', 'Chipping Automation', 'Creative Shots'],
    priceTiers: [
      { name: 'Lab 60m', duration: '60분', price: '₩160,000' },
      { name: 'Lab 90m', duration: '90분', price: '₩210,000' },
    ],
    similarPros: [
      {
        slug: 'hannah-park',
        name: 'Hannah Park',
        role: 'LPGA International Lead',
        city: 'Seoul',
        image: 'https://images.unsplash.com/photo-1521579987242-334c248be0dc?auto=format&fit=crop&w=500&q=80',
      },
      {
        slug: 'elliot-kim',
        name: 'Elliot Kim',
        role: 'PGA Performance Coach',
        city: 'Seoul',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
}

// Enrich profiles with booking-centric fields (services/locations/policies) and branding info
const ek = profileLibrary['elliot-kim']
if (ek) {
  ek.profile.tier = ek.profile.tier ?? 'Gold'
  ek.profile.city = ek.profile.city ?? 'Seoul'
  ek.profile.languages = ek.profile.languages ?? ['KR', 'EN']
  ek.services = ek.services ?? [
    { name: 'Intro Fitting', duration: '60m', price: '₩120,000' },
    { name: 'Signature Lesson', duration: '90m', price: '₩180,000' },
    { name: 'On-course Coaching', duration: '120m', price: '₩260,000' },
  ]
  ek.locations = ek.locations ?? ['청담 Studio', '한남 House', '제주 · 부산(주말)']
  ek.policies = ek.policies ?? ['D-1 18:00 변경 가능', '소액 보증금 결제', '현장/간편결제, 영수증 발행']
}

const hp = profileLibrary['hannah-park']
if (hp) {
  hp.profile.tier = hp.profile.tier ?? 'Platinum'
  hp.profile.city = hp.profile.city ?? 'Seoul'
  hp.profile.languages = hp.profile.languages ?? ['KR']
  hp.services = hp.services ?? [
    { name: 'Tempo & Short Game', duration: '90m', price: '₩190,000' },
    { name: 'Mental Routine Clinic', duration: '60m', price: '₩140,000' },
  ]
  hp.locations = hp.locations ?? ['청담 Studio', '해운대 Pop-up']
  hp.policies = hp.policies ?? ['D-1 18:00 변경 가능', '촬영 자료 제공', '보증금 결제 후 확정']
}

const mj = profileLibrary['mina-jang']
if (mj) {
  mj.profile.tier = mj.profile.tier ?? 'Gold'
  mj.profile.city = mj.profile.city ?? 'Busan'
  mj.profile.languages = mj.profile.languages ?? ['KR']
  mj.services = mj.services ?? [
    { name: 'Putting Lab', duration: '60m', price: '₩150,000' },
    { name: 'Chipping Diagnostics', duration: '60m', price: '₩140,000' },
    { name: 'Short Game Intensive', duration: '120m', price: '₩250,000' },
  ]
  mj.locations = mj.locations ?? ['성수 Lab', '도산 Studio']
  mj.policies = mj.policies ?? ['D-1 18:00 변경 가능', '장비 세팅 포함', '보증금 결제 후 확정']
}

export const defaultProfileSlug = 'elliot-kim'
