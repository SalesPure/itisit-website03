/* ============================
   IT'S IT INC. — MAIN SCRIPT
   Final version with all fixes
   ============================ */

(function () {
  'use strict';

  /* ---------- INTRO ---------- */
  const intro = document.getElementById('genesis-intro');
  if (intro) {
    setTimeout(() => {
      intro.classList.add('done');
      setTimeout(() => intro.remove(), 700);
      initAnimations();
    }, 2200);
  } else {
    initAnimations();
  }

  /* ---------- THREE.JS HERO BACKGROUND ---------- */
  (function initHeroCanvas() {
    const canvas = document.getElementById('hero-background-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x4a6cf7,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (-mouseY - camera.position.y) * 0.02;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();

  /* ---------- GSAP ANIMATIONS ---------- */
  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Reveal containers
    gsap.utils.toArray('.reveal-container > *').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // Hero text stagger
    gsap.from('.hero-text .reveal-container', {
      opacity: 0,
      y: 40,
      stagger: 0.2,
      duration: 0.8,
      delay: 2.5,
      ease: 'power3.out',
    });

    // Hero image
    gsap.from('.hero-image', {
      opacity: 0,
      x: 60,
      duration: 1,
      delay: 3,
      ease: 'power3.out',
    });

    // FIX #1: Stats counter — animate but keep static fallback visible
    // Numbers already show correct values in HTML; animation is enhancement only
    gsap.utils.toArray('.stat-number').forEach((el) => {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const originalText = el.textContent; // preserve fallback

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            { val: 0 },
            { val: target },
            {
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].val) + suffix;
              },
              onComplete: function () {
                el.textContent = target + suffix; // ensure final value
              },
            }
          );
        },
      });
    });

    // About scrolly — step activation
    const aboutSteps = gsap.utils.toArray('.about-text-step');
    const overlays = gsap.utils.toArray('.visual-overlay');

    aboutSteps.forEach((step) => {
      const stepNum = step.dataset.step;
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => activateStep(stepNum),
        onEnterBack: () => activateStep(stepNum),
      });
    });

    function activateStep(num) {
      aboutSteps.forEach((s) => s.classList.toggle('active', s.dataset.step === num));
      overlays.forEach((o) => o.classList.toggle('active', o.dataset.stepTarget === num));
    }

    // Service cards stagger
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 40, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      });
    });

    // Why cards
    gsap.utils.toArray('.why-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 30, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      });
    });

    // Client cards
    gsap.utils.toArray('.client-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 20, duration: 0.5, delay: i * 0.05, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      });
    });

    // Coverage cards
    gsap.utils.toArray('.coverage-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 30, duration: 0.6, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      });
    });

    // Lifecycle steps
    gsap.utils.toArray('.lifecycle-step').forEach((step, i) => {
      gsap.from(step, {
        opacity: 0, y: 30, duration: 0.5, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 85%', once: true },
      });
    });

    // Section headers
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.from(header.children, {
        opacity: 0, y: 30, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: header, start: 'top 85%', once: true },
      });
    });

    // Trust items
    gsap.utils.toArray('.trust-item').forEach((item, i) => {
      gsap.from(item, {
        opacity: 0, y: 20, duration: 0.5, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 90%', once: true },
      });
    });
  }

  /* ---------- SMOOTH NAV SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, { duration: 0.8, scrollTo: { y: target, offsetY: 80 }, ease: 'power3.inOut' });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      document.querySelector('header ul')?.classList.remove('open');
    });
  });

  /* ---------- MOBILE MENU ---------- */
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.querySelector('header ul')?.classList.toggle('open');
    });
  }

  /* ---------- FIX #12: FLOATING CTA — hide near contact section ---------- */
  const floatingCta = document.querySelector('.floating-cta');
  const scrollTopBtn = document.querySelector('.scroll-to-top-btn');
  const contactSection = document.getElementById('contact');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 600;

    // Hide floating CTA when user is in the contact section
    let nearContact = false;
    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      nearContact = rect.top < window.innerHeight && rect.bottom > 0;
    }

    floatingCta?.classList.toggle('visible', scrolled && !nearContact);
    scrollTopBtn?.classList.toggle('visible', scrolled);
  });

  /* ---------- CONTACT FORM ---------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const data = new FormData(form);
      try {
        const res = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          body: JSON.stringify(Object.fromEntries(data)),
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          status.textContent = '✓ Message sent successfully!';
          status.style.color = '#34d399';
          form.reset();
        } else {
          status.textContent = '✗ Failed to send. Please try again.';
          status.style.color = '#ef4444';
        }
      } catch {
        status.textContent = '✗ Network error. Please try again.';
        status.style.color = '#ef4444';
      }
    });
  }

  /* ---------- LANGUAGE SWITCHER ---------- */
  const translations = {
    ko: {
      'nav.about': '소개',
      'nav.services': '서비스',
      'nav.why': '강점',
      'nav.clients': '고객사',
      'nav.contact': '문의',
      'hero.title': '대한민국 데이터센터\n& IT 인프라 파트너',
      'hero.subtitle': '전국 당일 현장 엔지니어링 · 한/영 이중 언어 지원 · 2024년 설립, 글로벌 기업 신뢰 파트너',
      'hero.cta1': '견적 요청',
      'hero.cta2': '서비스 보기',
      'stats.established': '설립',
      'stats.divisions': '사업부',
      'stats.projects': '수행 프로젝트',
      'stats.coverage': '전국 커버리지',
      'stats.support': '지원 가능',
      'about.step1.title': '대한민국 <span class="highlight">데이터센터</span> & IT 인프라 전문기업',
      'about.step1.desc': '부산 본사와 서울 지점을 두고, 전국 현장 엔지니어링 네트워크를 통해 글로벌 IT 기업의 신뢰받는 실행 파트너로 활동하고 있습니다.',
      'about.step2.title': '3개 사업부, <span class="highlight">하나의 미션</span>',
      'about.step2.desc': 'ServicePure(인프라 & 컨설팅), SalesPure(기술·글로벌 영업), BizPure(마케팅·인사·재무) — 각 사업부가 독립적으로 운영되며 지속적인 역량 개발을 추구합니다.',
      'about.step3.title': '우리의 <span class="highlight">비전</span>',
      'about.step3.desc': '<em>"세계에서 가장 존경받는 IT 인프라 기업"</em> — 차세대 기술 시대, 인프라 혁신을 통해 모든 기업이 기술 혜택을 누릴 수 있는 미래를 만들어 갑니다.',
      'about.overlay1.title': '전국 운영',
      'about.overlay1.desc': '전국 모든 데이터센터 당일 출동 가능',
      'about.overlay2.title': '3개 사업부',
      'about.overlay2.desc': 'ServicePure · SalesPure · BizPure',
      'about.overlay3.title': '비전',
      'about.overlay3.desc': '가장 존경받는 IT 인프라 기업',
      'services.tag': '서비스',
      'services.title': '핵심 서비스',
      'services.desc': '컨설팅부터 설치, 라이프사이클 관리까지 엔드투엔드 인프라 서비스를 제공합니다.',
      'services.card1.title': '데이터센터 인프라',
      'services.card1.desc': '서버 랙 & 스택 구축, 광섬유/구리 케이블링, BIOS/RAID/OS 설정, 하드웨어 수리 및 라이프사이클 관리.',
      'services.card2.title': '리모트 핸즈 & 현장 엔지니어링',
      'services.card2.desc': 'SLA 기반 현장 지원: 서버 진단, 하드웨어 교체, 케이블 패칭, 24/7 모니터링. 한/영 이중 언어 지원.',
      'services.card3.title': '배포 & 물류',
      'services.card3.desc': '수령, 검수, 자산 태깅, 스테이징, 사전 설정, 번인 테스트, 전국 안전 배송 및 설치까지 풀사이클 지원.',
      'services.card4.title': 'End-User IT & 매니지드 서비스',
      'services.card4.desc': '기업 PC 프로비저닝, OS 이미징, 엔드포인트 관리, 상주 엔지니어 IT 아웃소싱, OA 관리 & 네트워크 케이블링.',
      'services.card5.title': '금융 트레이딩 인프라',
      'services.card5.desc': '캐피탈 마켓 미션크리티컬 인프라: 초저지연 네트워크, 10G/25G/100G 배포, KRX/CME/SGX 연결, 제로다운타임 프로토콜.',
      'services.cta': '견적 요청 →',
      'services.badge': '전문 특화',
      'lifecycle.tag': '운영 방식',
      'lifecycle.title': '운영 프로세스',
      'lifecycle.desc': '엔드투엔드 서비스 라이프사이클 관리 및 유연한 참여 모델.',
      'lifecycle.s1.title': '기획',
      'lifecycle.s1.desc': '컨설팅 · 설계 · 평가',
      'lifecycle.s2.title': '배포',
      'lifecycle.s2.desc': '설치 · 구성 · 테스트',
      'lifecycle.s3.title': '운영',
      'lifecycle.s3.desc': '모니터링 · 유지보수 · 24/7 지원',
      'lifecycle.s4.title': '지원',
      'lifecycle.s4.desc': '장애대응 · 업그레이드 · 리포팅',
      'model.t1': '티켓 기반',
      'model.d1': '소규모 IT 필요에 따른 건별 과금 지원. 간헐적 IT 요구사항이 있는 기업에 적합합니다.',
      'model.t2': '유지보수',
      'model.d2': '정기 예방 점검 & 우선 장애 대응. 24x7x4 긴급 옵션 제공.',
      'model.t3': 'IT 아웃소싱',
      'model.d3': '전담 상주 엔지니어. SLA 기반 풀 IT 매니지먼트 서비스 제공.',
      'why.tag': '강점',
      'why.title': 'Why It\'s IT',
      'why.c1.title': '원스톱 창구',
      'why.c1.desc': '전국 데이터센터 & IT 인프라 모든 니즈를 하나의 파트너가 해결 — 중간 단계 없이 빠르게.',
      'why.c2.title': '네이티브 영어 커뮤니케이션',
      'why.c2.desc': '글로벌 본사와 직접 이중 언어 지원 — 통역 불필요, 빠른 문제 해결.',
      'why.c3.title': '전국 커버리지',
      'why.c3.desc': '전국 모든 데이터센터·오피스 현장 엔지니어링, 당일 출동 가능.',
      'why.c4.title': '유연한 확장성',
      'why.c4.desc': '티켓 기반부터 풀 아웃소싱까지 — 니즈와 예산에 맞는 서비스 모델을 선택하세요.',
      'partners.tag': '생태계',
      'partners.title': '지원 플랫폼',
      'clients.tag': '신뢰',
      'clients.title': '프로젝트 실적',
      'clients.desc': '다양한 산업군의 글로벌 기업 및 국내 기관이 신뢰하는 파트너.',
      'clients.cat1': '캐피탈 마켓 / 금융 트레이딩',
      'clients.cat2': '미디어 & 디지털 플랫폼',
      'clients.cat3': '엔터프라이즈',
      'clients.note': '* 고객사명은 비밀유지 계약에 따라 비공개입니다. 상세 내용은 문의 시 안내드립니다.',
      'coverage.tag': '커버리지',
      'coverage.title': '전국 커버리지 & 글로벌 네트워크',
      'coverage.desc': '대한민국 전역 IT 서비스를 위한 단일 창구 — 국제 파트너 네트워크를 통한 글로벌 확장.',
      'coverage.direct': '직접 커버리지',
      'coverage.partner': '파트너 네트워크',
      'contact.tag': '연락처',
      'contact.title': '문의하기',
      'contact.subtitle': '프로젝트 문의, 파트너십 제안, 그 외 무엇이든 — 한 통화로 해결됩니다.',
      'contact.trust1': '24시간 이내 응답',
      'contact.trust2': '한/영 이중 언어 대응',
      'contact.trust3': '단건 티켓 또는 SLA 계약 가능',
      'contact.form.name': '이름',
      'contact.form.service': '서비스 선택',
      'contact.form.message': '메시지',
      'contact.form.button': '메시지 보내기',
      // FIX #9: Korean select option translations
      'contact.form.opt0': '서비스 선택',
      'contact.form.opt1': '데이터센터 인프라',
      'contact.form.opt2': '리모트 핸즈 & 현장 엔지니어링',
      'contact.form.opt3': '배포 & 물류',
      'contact.form.opt4': 'End-User IT & 매니지드 서비스',
      'contact.form.opt5': '금융 트레이딩 인프라',
      'contact.form.opt6': '기타',
      'footer.about': '소개',
      'footer.services': '서비스',
      'footer.why': '강점',
      'footer.clients': '고객사',
      'footer.contact': '문의',
      'floating.cta': '문의하기',
    },
  };

  let currentLang = 'en';

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      currentLang = lang;
      document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
      applyTranslations(lang);
    });
  });

  function applyTranslations(lang) {
    document.querySelectorAll('[data-translate-key]').forEach((el) => {
      const key = el.dataset.translateKey;
      if (lang === 'ko' && translations.ko[key]) {
        if (el.hasAttribute('data-is-placeholder')) {
          el.placeholder = translations.ko[key];
        } else if (el.tagName === 'OPTION') {
          el.textContent = translations.ko[key];
        } else {
          el.innerHTML = translations.ko[key];
        }
      } else if (lang === 'en') {
        if (!el.dataset.originalText) return;
        if (el.hasAttribute('data-is-placeholder')) {
          el.placeholder = el.dataset.originalText;
        } else if (el.tagName === 'OPTION') {
          el.textContent = el.dataset.originalText;
        } else {
          el.innerHTML = el.dataset.originalText;
        }
      }
    });
  }

  // Store original English text on load
  document.querySelectorAll('[data-translate-key]').forEach((el) => {
    if (el.hasAttribute('data-is-placeholder')) {
      el.dataset.originalText = el.placeholder;
    } else if (el.tagName === 'OPTION') {
      el.dataset.originalText = el.textContent;
    } else {
      el.dataset.originalText = el.innerHTML;
    }
  });

})();
