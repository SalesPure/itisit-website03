window.addEventListener('load', () => {

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- Dynamic Header Padding ---
    function setMainPadding() {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        if (header && main) {
            const headerHeight = header.offsetHeight;
            main.style.paddingTop = `${headerHeight}px`;
            // Refresh ScrollTrigger to recalculate trigger points after padding change
            if (ScrollTrigger.isTouch !== 1) { // Don't refresh on touch devices for performance
                ScrollTrigger.refresh();
            }
        }
    }

    // --- Language Switcher Logic ---
    const translations = {
        "en": {
            "nav.about": "About",
            "nav.services": "Services",
            "nav.clients": "Clients",
            "nav.contact": "Contact",
            "hero.title": "Next-Generation IT Infrastructure",
            "hero.subtitle": "Your partner for leading the future of global business through IT infrastructure. ITISIT is with you.",
            "hero.button": "Our Services",
            "about.step1.title": "We are a <span class='highlight'>Global</span> IT Solution Provider.",
            "about.step1.desc": "In the complex global IT environment, ITISIT Inc. is your professional partner, providing the most stable and efficient infrastructure solutions so that companies can focus on their core business.",
            "about.step2.title": "<span class='highlight'>Technology</span> of Trust, <span class='highlight'>Partner</span> for Innovation",
            "about.step2.desc": "Beyond simple support, we build the technical foundation for our clients' success. We build tomorrow's business together with the latest technology and deep expertise. We earn our clients' trust with 24/7 uninterrupted service and proactive fault response.",
            "about.step3.title": "Vision for the <span class='highlight'>Future</span>",
            "about.step3.desc": "In an era centered on next-generation technology, ITISIT creates a future where everyone can enjoy its benefits through infrastructure innovation. We will be your reliable companion for sustainable growth.",
            "about.overlay1.title": "Global Partner",
            "about.overlay1.desc": "Providing stable services anywhere in the world.",
            "about.overlay2.title": "Trusted Technology",
            "about.overlay2.desc": "Supporting client success with innovative technology.",
            "about.overlay3.title": "Future-Proof Infrastructure",
            "about.overlay3.desc": "Leading infrastructure innovation for the next generation.",
            "services.title": "Our Services",
            "services.card1.title": "Remote Hands & On-site",
            "services.card1.desc": "24/7 on-site dispatch, providing rapid fault response and equipment installation/replacement services.",
            "services.card2.title": "IT Outsourcing",
            "services.card2.desc": "We provide customized operational services such as resident engineers, remote support, and IT asset management.",
            "services.card3.title": "Network Cabling",
            "services.card3.desc": "We design, install, and manage structured cabling systems for data centers and offices.",
            "services.card4.title": "Maintenance",
            "services.card4.desc": "Ensuring stable systems through regular inspections and emergency support for core infrastructure.",
            "services.card5.title": "IT Consulting",
            "services.card5.desc": "We provide optimal solutions to ensure business continuity by precisely analyzing the IT environment.",
            "services.card6.title": "Hardware & Software Supply",
            "services.card6.desc": "Supplying reasonably priced hardware and software through various partnerships.",
            "clients.title": "Our Valued Clients",
            "contact.title": "Contact Us",
            "contact.subtitle": "For project inquiries, partnership proposals, or anything else, please contact us.",
            "contact.info.title": "Information",
            "contact.form.name": "Name",
            "contact.form.message": "Message",
            "contact.form.button": "Send Message",
            "footer.about": "About",
            "footer.services": "Services",
            "footer.clients": "Clients",
            "footer.contact": "Contact"
        },
        "ko": {
            "nav.about": "소개",
            "nav.services": "서비스",
            "nav.clients": "고객사",
            "nav.contact": "문의하기",
            "hero.title": "Next-Generation IT Infrastructure",
            "hero.subtitle": "글로벌 비즈니스의 미래를 선도하는 IT 인프라 파트너, ITISIT가 함께합니다.",
            "hero.button": "서비스 보기",
            "about.step1.title": "We are a <span class='highlight'>Global</span> IT Solution Provider.",
            "about.step1.desc": "ITISIT Inc.는 복잡한 글로벌 IT 환경 속에서 기업이 비즈니스 본질에만 집중할 수 있도록, 가장 안정적이고 효율적인 인프라 솔루션을 제공하는 전문 파트너입니다.",
            "about.step2.title": "<span class='highlight'>Technology</span> of Trust, <span class='highlight'>Partner</span> for Innovation",
            "about.step2.desc": "단순한 지원을 넘어, 고객의 성공을 위한 기술적 토대를 구축합니다. 우리는 최신 기술과 깊은 전문성으로 비즈니스의 내일을 함께 만들어갑니다. 24/7 중단 없는 서비스와 선제적인 장애 대응으로 고객의 신뢰를 얻고 있습니다.",
            "about.step3.title": "Vision for the <span class='highlight'>Future</span>",
            "about.step3.desc": "차세대 기술이 중심이 되는 시대, ITISIT는 인프라의 혁신을 통해 모두가 기술의 혜택을 누리는 미래를 만들어갑니다. 지속가능한 성장을 위한 당신의 든든한 동반자가 되겠습니다.",
            "about.overlay1.title": "Global Partner",
            "about.overlay1.desc": "전 세계 어디든, 안정적인 서비스를 제공합니다.",
            "about.overlay2.title": "Trusted Technology",
            "about.overlay2.desc": "혁신 기술로 고객의 성공을 지원합니다.",
            "about.overlay3.title": "Future-Proof Infrastructure",
            "about.overlay3.desc": "차세대를 위한 인프라 혁신을 선도합니다.",
            "services.title": "Our Services",
            "services.card1.title": "Remote Hands & On-site",
            "services.card1.desc": "24/7 현장 출동, 신속한 장애 대응 및 장비 설치/교체 서비스를 제공합니다.",
            "services.card2.title": "IT Outsourcing",
            "services.card2.desc": "상주 엔지니어, 원격 지원, IT 자산 관리 등 고객 맞춤형 운영 서비스를 제공합니다.",
            "services.card3.title": "Network Cabling",
            "services.card3.desc": "데이터센터, 사무실의 구조화된 케이블링 시스템을 설계, 설치 및 관리합니다.",
            "services.card4.title": "Maintenance",
            "services.card4.desc": "핵심 인프라에 대한 정기 점검 및 긴급 지원으로 안정적인 시스템을 보장합니다.",
            "services.card5.title": "IT Consulting",
            "services.card5.desc": "IT 환경을 정밀 분석하여 비즈니스 연속성을 보장하는 최적의 솔루션을 제공합니다.",
            "services.card6.title": "Hardware & Software Supply",
            "services.card6.desc": "다양한 파트너십을 통해 합리적인 가격의 하드웨어와 소프트웨어를 공급합니다.",
            "clients.title": "Our Valued Clients",
            "contact.title": "Contact Us",
            "contact.subtitle": "프로젝트 문의, 파트너십 제안 등 무엇이든 연락주세요.",
            "contact.info.title": "Information",
            "contact.form.name": "이름",
            "contact.form.message": "메시지",
            "contact.form.button": "메시지 보내기",
            "footer.about": "소개",
            "footer.services": "서비스",
            "footer.clients": "고객사",
            "footer.contact": "문의하기"
        }
    };

    function applyTranslations(lang) {
        const data = translations[lang];
        if (!data) {
            console.warn(`Translations for language '${lang}' not found.`);
            return;
        }

        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (data[key]) {
                if (el.hasAttribute('data-is-placeholder')) {
                    el.placeholder = data[key];
                } else {
                    el.innerHTML = data[key];
                }
            }
        });
    }

    function setLanguage(lang) {
        applyTranslations(lang);
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        localStorage.setItem('preferredLanguage', lang);
    }

    function initLanguageSwitcher() {
        const langSwitcher = document.querySelector('.lang-switcher');
        if (langSwitcher) {
            langSwitcher.addEventListener('click', (e) => {
                e.preventDefault();
                const langBtn = e.target.closest('.lang-btn');
                if (langBtn && !langBtn.classList.contains('active')) {
                    const lang = langBtn.dataset.lang;
                    setLanguage(lang);
                }
            });
        }
        const preferredLang = localStorage.getItem('preferredLanguage') || 'en';
        setLanguage(preferredLang);
    }

    // --- Function Definitions ---

    function initCustomGradientNetwork() {
        const canvas = document.querySelector("#hero-background-canvas");
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 250;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const points = [];
        const pointCount = 80;
        const connectDistance = 100;
        const sceneSize = 400;

        for (let i = 0; i < pointCount; i++) {
            const x = (Math.random() - 0.5) * sceneSize;
            const y = (Math.random() - 0.5) * sceneSize;
            const z = (Math.random() - 0.5) * sceneSize;
            const point = new THREE.Vector3(x, y, z);
            point.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2);
            points.push(point);
        }

        const linesGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
        const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
        scene.add(linesMesh);

        function animate() {
            requestAnimationFrame(animate);
            const linePositions = [];
            const lineColors = [];
            const color1 = new THREE.Color(0x0a58ca);
            const color2 = new THREE.Color(0x29c5f6);

            points.forEach(p => {
                p.add(p.velocity);
                if (Math.abs(p.x) > sceneSize / 2) p.velocity.x *= -1;
                if (Math.abs(p.y) > sceneSize / 2) p.velocity.y *= -1;
                if (Math.abs(p.z) > sceneSize / 2) p.velocity.z *= -1;
            });

            for (let i = 0; i < pointCount; i++) {
                for (let j = i + 1; j < pointCount; j++) {
                    const p1 = points[i];
                    const p2 = points[j];
                    if (p1.distanceTo(p2) < connectDistance) {
                        linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                        lineColors.push(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b);
                    }
                }
            }

            linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
            renderer.render(scene, camera);
        }
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    }

    function setupScrollTriggers() {

        ScrollTrigger.matchMedia({
            // ===== DESKTOP ANIMATIONS =====
            "(min-width: 769px)": function() {
                // Generic Reveals for section titles
                gsap.utils.toArray('#services .reveal-container, #contact .reveal-container, #clients .reveal-container').forEach(container => {
                    const child = container.children[0];
                    if (child) {
                        gsap.from(child, { autoAlpha: 0, yPercent: 80, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: container, start: "top 90%", toggleActions: "play none none reverse" } });
                    }
                });

                // About Section Scrollytelling
                const aboutScrolly = document.querySelector(".about-scrolly");
                if (aboutScrolly) {
                    const aboutSteps = gsap.utils.toArray(".about-text-step");
                    const visualOverlays = gsap.utils.toArray(".visual-overlay");
                    gsap.set(visualOverlays, { autoAlpha: 0 });
                    aboutSteps.forEach((step, i) => {
                        ScrollTrigger.create({
                            trigger: step,
                            start: "top center",
                            end: "bottom center",
                            toggleClass: { targets: step, className: "is-active" },
                            onToggle: self => gsap.to(visualOverlays[i], { autoAlpha: self.isActive ? 1 : 0, duration: 0.4, ease: "power2.inOut" })
                        });
                    });
                }

                // Highlight Animation
                gsap.utils.toArray('.highlight').forEach(highlight => {
                    gsap.to(highlight, { color: 'var(--primary-color)', duration: 0.3, ease: 'none', scrollTrigger: { trigger: highlight, start: 'top 75%', end: 'bottom 25%', scrub: 0.5 } });
                });

                // Card/Logo Fade-in
                gsap.from(".service-card, .client-card", { scrollTrigger: { trigger: ".services-grid, .clients-grid", start: "top 85%", toggleActions: "play none none reverse" }, autoAlpha: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "power2.out" });
                gsap.from(".contact-info, .contact-form", { scrollTrigger: { trigger: ".contact-grid", start: "top 80%", toggleActions: "play none none reverse" }, autoAlpha: 0, y: 40, duration: 1, stagger: 0.15, ease: "power2.out" });
            },

            // ===== MOBILE (No animations) =====
            "(max-width: 768px)": function() {
                // On mobile, elements are visible by default in CSS. No animations needed.
            }
        });

        // Scroll-to-Top Button (works on all screen sizes)
        const scrollTopBtn = document.querySelector('.scroll-to-top-btn');
        if (scrollTopBtn) {
            gsap.set(scrollTopBtn, {autoAlpha: 0});
            ScrollTrigger.create({
                trigger: 'main',
                start: "top -20%",
                onUpdate: self => gsap.to(scrollTopBtn, {autoAlpha: self.scroll() > 200 ? 1 : 0, duration: 0.3})
            });
            scrollTopBtn.addEventListener('click', e => {
                e.preventDefault();
                gsap.to(window, { duration: 0.5, scrollTo: 0, ease: 'power2.inOut' });
            });
        }
    }

    // --- Main Execution Flow ---
    
    // 1. Initial Setup
    gsap.set(["main", "header"], { autoAlpha: 0 });
    initLanguageSwitcher();
    initCustomGradientNetwork();

    // 2. Master timeline for a smooth, sequential intro
    const masterTl = gsap.timeline({
        onComplete: () => {
            // Setup scroll-based animations only after the intro is fully complete
            setupScrollTriggers();
            ScrollTrigger.refresh();
            gsap.set("#genesis-intro", { display: "none" });
        }
    });

    masterTl
        // Genesis Intro Part
        .fromTo("#genesis-intro h1", 
            { scale: 1.5, autoAlpha: 0 }, 
            { scale: 1, autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' }
        )
        .to("#genesis-intro h1", 
            { scale: 0.05, autoAlpha: 0, duration: 2, ease: 'power3.in' }, 
            "+=0.5"
        )
        // Transition to Main Content
        .to("#genesis-intro", { autoAlpha: 0, duration: 1 }, "-=1.5")
        .to(["main", "header"], { autoAlpha: 1, duration: 1 }, "<") // Fade in main content at the same time as intro fades out
        // Animate Hero Content In
        .from(".hero-text .reveal-container > *", 
            { autoAlpha: 0, yPercent: 80, stagger: 0.1, ease: "power3.out", duration: 1 }, 
            "-=0.5"
        )
        .from(".hero-text .btn", { autoAlpha: 0, y: 20 }, "<0.2")
        .from(".hero-image img", { autoAlpha: 0, scale: 0.95, duration: 1 }, "<");


    // --- Utility Event Listeners ---
    
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroImage.getBoundingClientRect();
            const rotateX = gsap.utils.mapRange(0, height, -8, 8, e.clientY - top);
            const rotateY = gsap.utils.mapRange(0, width, 8, -8, e.clientX - left);
            gsap.to(heroImage, { rotationX: rotateX, rotationY: rotateY, transformPerspective: 1000, ease: "power1.out", duration: 0.5 });
        });
        heroImage.addEventListener('mouseleave', () => {
             gsap.to(heroImage, { rotationX: 0, rotationY: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (document.querySelector(targetId)) {
                gsap.to(window, { duration: 1.5, scrollTo: { y: targetId, offsetY: 80 }, ease: "power3.inOut" });
            }
        });
    });

    function initContactForm() {
        const form = document.querySelector('.contact-form');
        const formStatus = document.querySelector('.form-status');

        if (!form || !formStatus) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = `<span class="sending-spinner"></span> Sending...`;

            formStatus.textContent = '';
            formStatus.style.display = 'none';
            
            try {
                const response = await fetch('/.netlify/functions/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = 'var(--success-color)';
                    form.reset();
                } else {
                    throw new Error(result.message || 'An unknown error occurred.');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = `Error: ${error.message}`;
                formStatus.style.color = 'var(--danger-color)';
            } finally {
                formStatus.style.display = 'block';
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.textContent = '';
                }, 6000);
            }
        });
    }

    // --- Initializations ---
    function initApp() {
        initLanguageSwitcher();
        initCustomGradientNetwork();
        setupScrollTriggers();
        initContactForm();

        // Initial padding calculation
        setMainPadding();
        // Add a slight delay for resize to ensure all elements are rendered
        window.addEventListener('resize', () => setTimeout(setMainPadding, 150));
    }

    initApp();
});