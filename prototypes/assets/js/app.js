const SAMPLE_PROS = [
  {
    id: 1,
    name: '김프로',
    title: 'KPGA 정회원 · 풀스윙 / 비거리',
    region: '강남',
    price: 180,
    rating: 4.9,
    img: 'assets/img/pro-1.jpg',
    tag: '풀스윙',
  },
  {
    id: 2,
    name: '이프로',
    title: 'KLPGA 투어 출신 · 아이언 / 쇼트게임',
    region: '송파',
    price: 220,
    rating: 4.8,
    img: 'assets/img/pro-2.jpg',
    tag: '쇼트게임',
  },
  {
    id: 3,
    name: '박프로',
    title: 'PGA 인증 코치 · 코스 매니지먼트',
    region: '분당',
    price: 260,
    rating: 5.0,
    img: 'assets/img/pro-3.jpg',
    tag: '코스',
  },
  {
    id: 4,
    name: '최프로',
    title: 'KPGA 투어 · 필드 동반',
    region: '강남',
    price: 300,
    rating: 4.7,
    img: 'assets/img/pro-4.jpg',
    tag: '필드',
  },
];

function proCardHTML(pro) {
  return `
    <article class="pro-card" onclick="goToProDetail(${pro.id})">
      <div class="pro-card-img" style="background-image:url('${pro.img}');"></div>
      <div class="pro-card-body">
        <div class="pro-name">${pro.name}</div>
        <div class="pro-meta">${pro.title}</div>
        <div class="pro-tag-row">
          <span class="pro-pill">${pro.region}</span>
          <span style="font-size:.78rem">${pro.price.toLocaleString()}원 / 90분</span>
        </div>
      </div>
    </article>`;
}

function renderFeaturedPros() {
  const container = document.getElementById('featured-pros');
  if (!container) return;
  container.innerHTML = SAMPLE_PROS.slice(0, 4).map(proCardHTML).join('');
}

function renderProList(list = SAMPLE_PROS) {
  const container = document.getElementById('pro-list');
  if (!container) return;
  container.innerHTML = list.map(proCardHTML).join('');
}

function applyFilters() {
  let filtered = [...SAMPLE_PROS];
  const region = document.getElementById('filter-region').value;
  const type = document.getElementById('filter-type').value;
  const price = document.getElementById('filter-price').value;
  const sort = document.getElementById('sort-select').value;

  if (region) filtered = filtered.filter((p) => p.region === region);
  if (type) filtered = filtered.filter((p) =>
    p.tag.toLowerCase().includes(type.replace('-', '')),
  );
  if (price) {
    const max = Number(price);
    filtered = filtered.filter((p) => p.price <= max);
  }

  if (sort === 'priceLow') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'priceHigh') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  renderProList(filtered);
}

function goToProsWithFilter() {
  window.location.href = 'pros.html';
}

function goToProDetail(id) {
  window.location.href = 'pro-detail.html';
}

function goToProSignup() {
  alert('프로 입점 신청 페이지는 추후 오픈 예정입니다.');
}

function goToLogin() {
  alert('로그인/회원가입 플로우 연결 예정.');
}

function loadProDetail() {
  const nameNode = document.getElementById('detail-name');
  if (!nameNode) return;
  const pro = SAMPLE_PROS[0];
  document.title = `${pro.name} 프로 상세 | ELITE GOLF`;
  nameNode.textContent = pro.name;
  document.getElementById('detail-title').textContent = pro.title;
  document.getElementById('detail-region').textContent = pro.region;
  document.getElementById('detail-price').textContent = `90분 ${pro.price.toLocaleString()}원`;
  document.getElementById('detail-hero-img').style.backgroundImage = `url('${pro.img}')`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedPros();
  renderProList();
  loadProDetail();
});

