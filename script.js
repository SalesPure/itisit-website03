(function(){
'use strict';

const header = document.getElementById('main-header');
const canvas = document.getElementById('hero-background-canvas');
const ctx = canvas.getContext('2d');
let W, H;

/* ---- INTRO ---- */
const intro = document.getElementById('genesis-intro');
if(intro){
  document.body.style.overflow='hidden';
  setTimeout(()=>{
    intro.classList.add('done');
    document.body.style.overflow='';
    setTimeout(()=>intro.remove(),800);
    if(header)header.classList.add('visible');
    animateHero();
    document.fonts.ready.then(()=>{ resize(); initDots(); buildTargets(); setTimeout(()=>{ initScroll(); },200); });
  },2800);
}else{
  if(header)header.classList.add('visible');
  animateHero();
  document.fonts.ready.then(()=>{ resize(); initDots(); buildTargets(); setTimeout(initScroll,200); });
}

/* ============================================
   SQUARE DOTS — orbit → morph to stats text
   ============================================ */
const COUNT = 10000;
let dots = [];
let morphProgress = 0;
let angle = 0;
let mx = 0, my = 0;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

class Dot {
  constructor(i){
    this.i = i;
    this.orbitR = 150 + Math.random()*700;
    this.theta = Math.random()*Math.PI*2;
    this.phi = (Math.random()-0.5)*Math.PI*0.9;
    this.speed = 0.0001 + Math.random()*0.0004;
    this.yOff = (Math.random()-0.5)*0.00015;
    this.sz = 0.3 + Math.random()*1.2;
    this.baseAlpha = 0.08 + Math.random()*0.4;
    this.delay = Math.random()*0.25;
    this.x = 0; this.y = 0; this.alpha = this.baseAlpha;
    this.tx = W/2; this.ty = H/2;
    this.hasTarget = false;
  }
  orbitXY(){
    const cx=W/2, cy=H/2;
    const x3=this.orbitR*Math.cos(this.phi)*Math.cos(this.theta);
    const y3=this.orbitR*Math.sin(this.phi);
    const z3=this.orbitR*Math.cos(this.phi)*Math.sin(this.theta);
    const p=400, s=p/(p+z3);
    return { x:cx+x3*s+mx*s*40, y:cy+y3*s+my*s*40, s };
  }
  update(){
    this.theta += this.speed;
    this.phi += Math.sin(angle*0.3+this.i*0.01)*this.yOff;
    const o = this.orbitXY();
    if(morphProgress <= 0.001){
      this.x=o.x; this.y=o.y;
      this.sz=(0.5+Math.random()*0.4)*o.s*2;
      this.alpha=this.baseAlpha*o.s;
    } else {
      const raw=Math.max(0,Math.min(1,(morphProgress-this.delay)/(1-this.delay)));
      const e=raw<0.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2;
      this.x=o.x+(this.tx-o.x)*e;
      this.y=o.y+(this.ty-o.y)*e;
      if(this.hasTarget){
        this.alpha = this.baseAlpha + e*0.55;
        this.sz = (0.5+o.s)*(1-e) + 1.3*e;
      } else {
        this.alpha = this.baseAlpha * Math.max(0, 1 - e*2.5);
        this.sz = (0.5+o.s) * Math.max(0, 1 - e*2.5);
      }
    }
  }
  draw(){
    if(this.alpha<0.01) return;
    ctx.globalAlpha=this.alpha;
    ctx.fillRect(this.x-this.sz/2, this.y-this.sz/2, this.sz, this.sz);
  }
}

function initDots(){ dots=[]; for(let i=0;i<COUNT;i++) dots.push(new Dot(i)); }

function buildTargets(){
  const overlay = document.querySelector('.stats-overlay');
  if(overlay) overlay.style.opacity = '1';

  const tmp=document.createElement('canvas');
  const tc=tmp.getContext('2d');
  tmp.width=W; tmp.height=H;
  tc.fillStyle='#fff';
  tc.textAlign='center'; tc.textBaseline='middle';

  document.querySelectorAll('.stat-block').forEach(block=>{
    const numEl = block.querySelector('.stat-num');
    const lblEl = block.querySelector('.stat-lbl');
    if(numEl){
      const r = numEl.getBoundingClientRect();
      const style = getComputedStyle(numEl);
      const fs = parseFloat(style.fontSize);
      tc.font = style.fontWeight+' '+fs+'px '+style.fontFamily;
      tc.fillText(numEl.textContent, r.left+r.width/2, r.top+r.height/2);
      tc.fillText(numEl.textContent, r.left+r.width/2+0.5, r.top+r.height/2);
      tc.fillText(numEl.textContent, r.left+r.width/2, r.top+r.height/2+0.5);
    }
    if(lblEl){
      const r = lblEl.getBoundingClientRect();
      const style = getComputedStyle(lblEl);
      const fs = parseFloat(style.fontSize);
      tc.font = style.fontWeight+' '+fs+'px '+style.fontFamily;
      tc.fillText(lblEl.textContent, r.left+r.width/2, r.top+r.height/2);
      tc.fillText(lblEl.textContent, r.left+r.width/2+0.5, r.top+r.height/2);
      tc.fillText(lblEl.textContent, r.left+r.width/2, r.top+r.height/2+0.5);
    }
  });

  document.querySelectorAll('.stat-divider').forEach(div=>{
    const r = div.getBoundingClientRect();
    if(r.width>0 && r.height>0){
      tc.fillStyle='rgba(255,255,255,0.5)';
      tc.fillRect(r.left, r.top, Math.max(r.width,2), r.height);
      tc.fillStyle='#fff';
    }
  });

  if(overlay) overlay.style.opacity = '0';

  const img=tc.getImageData(0,0,W,H);
  const targets=[];
  const step=Math.max(1,Math.round(Math.sqrt(W*H/(COUNT*10))));
  for(let y=0;y<H;y+=step) for(let x=0;x<W;x+=step){
    if(img.data[(y*W+x)*4]>80) targets.push({x,y});
  }
  for(let i=targets.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[targets[i],targets[j]]=[targets[j],targets[i]];}
  for(let i=0;i<dots.length;i++){
    if(i<targets.length){ dots[i].tx=targets[i].x; dots[i].ty=targets[i].y; dots[i].hasTarget=true; }
    else { dots[i].hasTarget=false; const o=dots[i].orbitXY(); dots[i].tx=o.x; dots[i].ty=o.y; }
  }
}

function render(){
  requestAnimationFrame(render);
  angle+=0.005;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#4a6cf7';
  for(const d of dots){ d.update(); d.draw(); }
  ctx.globalAlpha=1;
}

document.addEventListener('mousemove',e=>{mx=e.clientX/W-0.5;my=e.clientY/H-0.5});
window.addEventListener('resize',()=>{ resize(); document.fonts.ready.then(buildTargets); });

resize(); initDots(); render();

/* ---- HERO TEXT ANIM ---- */
function animateHero(){
  if(typeof gsap==='undefined')return;
  const tl=gsap.timeline({delay:.3});
  tl.to('.hero-label',{opacity:1,y:0,duration:.6,ease:'power3.out'});
  tl.to('.hero-title .tl span',{y:0,opacity:1,duration:.9,stagger:.12,ease:'power4.out'},'-=.3');
  tl.to('.hero-sub',{opacity:1,y:0,duration:.6,ease:'power3.out'},'-=.4');
  tl.to('.hero-ctas',{opacity:1,y:0,duration:.6,ease:'power3.out'},'-=.3');
  tl.to('.hero-scroll-indicator',{opacity:.6,duration:.8},'-=.2');
}

/* ============================================
   SCROLL — Hero pinned, dots morph, stats-overlay fades in
   CHANGED: +=250% → +=140% (스크롤 거리 44% 감소)
   CHANGED: 페이즈 타이밍 조정 (더 빠르고 부드러운 전환)
   ============================================ */
function initScroll(){
  if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined')return;
  gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

  ScrollTrigger.create({start:'top -80',onUpdate:s=>header?.classList.toggle('scrolled',s.progress>0)});
  gsap.to('.scroll-progress-bar',{width:'100%',ease:'none',scrollTrigger:{trigger:'body',start:'top top',end:'bottom bottom',scrub:.3}});

  const heroEl = document.getElementById('hero');
  const statsOverlay = document.querySelector('.stats-overlay');
  if(!heroEl) return;

  ScrollTrigger.create({
    trigger: heroEl,
    start: 'top top',
    end: '+=140%',
    pin: true,
    pinSpacing: true,
    onUpdate: self => {
      const p = self.progress;

      // Phase 1 (0–0.2): hero text fades + blurs away (faster)
      const ht = document.querySelector('.hero-text');
      const si = document.querySelector('.hero-scroll-indicator');
      const fade = Math.min(1, p/0.18);
      if(ht){
        ht.style.opacity = (1-fade);
        ht.style.transform = 'scale('+(1-fade*0.06)+')';
        ht.style.filter = 'blur('+fade*10+'px)';
      }
      if(si) si.style.opacity = Math.max(0, 0.6-fade*2);

      // Phase 2 (0.1–0.75): dots morph into stats text shape (tighter range)
      morphProgress = p<0.1 ? 0 : p>0.75 ? 1 : (p-0.1)/0.65;

      // Phase 3 (0.82–0.95): dots fade out, real stats DOM appears (earlier reveal)
      const reveal = p<0.82 ? 0 : Math.min(1,(p-0.82)/0.13);
      if(statsOverlay){
        statsOverlay.style.opacity = reveal;
      }
      canvas.style.opacity = p<0.8 ? '1' : (1 - Math.min(1,(p-0.8)/0.15)).toString();
    }
  });

  /* ---- Other section transitions ---- */
  const ap=document.querySelector('.about-panel');
  if(ap){const wL=document.createElement('div');wL.className='section-wipe-left';const wR=document.createElement('div');wR.className='section-wipe-right';ap.prepend(wL,wR);const atl=gsap.timeline({scrollTrigger:{trigger:ap,start:'top 80%',end:'top 20%',scrub:.6}});atl.to(wL,{scaleX:0,duration:1,ease:'power3.inOut'},0);atl.to(wR,{scaleX:0,duration:1,ease:'power3.inOut'},0);}
  const sp2=document.querySelector('.services-panel');
  if(sp2){sp2.style.clipPath='circle(0% at 50% 50%)';gsap.to(sp2,{clipPath:'circle(75% at 50% 50%)',ease:'power2.out',scrollTrigger:{trigger:sp2,start:'top 98%',end:'top 15%',scrub:.8}});}
  gsap.utils.toArray('.portfolio-item').forEach((it,i)=>{gsap.fromTo(it,{opacity:0,x:i%2===0?-120:120,scale:.88},{opacity:1,x:0,scale:1,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:it,start:'top 98%',once:true}})});
  const cp=document.querySelector('.coverage-panel');if(cp)gsap.fromTo(cp,{clipPath:'polygon(0 0,0 0,0 100%,0 100%)'},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',ease:'power2.inOut',scrollTrigger:{trigger:cp,start:'top 80%',end:'top 20%',scrub:.8}});
  const ctp=document.querySelector('.contact-panel');if(ctp)gsap.fromTo(ctp,{scale:.92,opacity:.5,borderRadius:'40px'},{scale:1,opacity:1,borderRadius:'0px',ease:'power2.out',scrollTrigger:{trigger:ctp,start:'top 98%',end:'top 30%',scrub:.6}});

  /* ---- Element reveals ---- */
  gsap.utils.toArray('.big-title').forEach(t=>{gsap.to(t.querySelectorAll('.tl span'),{y:0,opacity:1,duration:1,stagger:.1,ease:'power4.out',scrollTrigger:{trigger:t,start:'top 98%',once:true}})});
  gsap.utils.toArray('.section-tag').forEach(t=>gsap.from(t,{opacity:0,y:15,duration:.5,scrollTrigger:{trigger:t,start:'top 98%',once:true}}));
  gsap.utils.toArray('.section-desc').forEach(d=>gsap.from(d,{opacity:0,y:15,duration:.6,scrollTrigger:{trigger:d,start:'top 98%',once:true}}));
  gsap.utils.toArray('.stat-num').forEach(el=>{const target=parseInt(el.dataset.target),suffix=el.dataset.suffix||'';ScrollTrigger.create({trigger:el,start:'top 98%',once:true,onEnter:()=>{gsap.fromTo({val:0},{val:target},{duration:1.2,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(this.targets()[0].val)+suffix},onComplete:function(){el.textContent=target+suffix}})}})});
  gsap.utils.toArray('.stat-block').forEach((b,i)=>gsap.from(b,{opacity:0,y:20,duration:.5,delay:i*.03,scrollTrigger:{trigger:b,start:'top 98%',once:true}}));
  gsap.utils.toArray('.about-card').forEach((c,i)=>gsap.to(c,{x:0,opacity:1,duration:.5,delay:i*.04,scrollTrigger:{trigger:c,start:'top 98%',once:true}}));
  gsap.from('.about-desc',{opacity:0,y:20,duration:.6,scrollTrigger:{trigger:'.about-desc',start:'top 98%',once:true}});
  gsap.from('.vision-bar',{opacity:0,y:30,duration:.7,scrollTrigger:{trigger:'.vision-bar',start:'top 98%',once:true}});
  gsap.utils.toArray('.service-card').forEach((c,i)=>gsap.to(c,{opacity:1,y:0,duration:.5,delay:i*.03,scrollTrigger:{trigger:c,start:'top 98%',once:true}}));
  gsap.utils.toArray('.lc-step').forEach((s,i)=>gsap.fromTo(s,{opacity:0,y:50,scale:.9},{opacity:1,y:0,scale:1,duration:.8,delay:i*.05,ease:'back.out(1.4)',scrollTrigger:{trigger:s,start:'top 98%',once:true}}));
  gsap.utils.toArray('.model-card').forEach((c,i)=>gsap.to(c,{opacity:1,y:0,duration:.5,delay:i*.03,scrollTrigger:{trigger:c,start:'top 98%',once:true}}));
  gsap.utils.toArray('.why-card').forEach((c,i)=>gsap.fromTo(c,{opacity:0,y:60,scale:.85},{opacity:1,y:0,scale:1,duration:.8,delay:i*.04,scrollTrigger:{trigger:c,start:'top 98%',once:true}}));
  gsap.utils.toArray('.cc').forEach((c,i)=>gsap.to(c,{opacity:1,y:0,duration:.4,delay:i*.02,scrollTrigger:{trigger:c,start:'top 98%',once:true}}));
  gsap.utils.toArray('.cov-card').forEach((c,i)=>gsap.to(c,{opacity:1,y:0,duration:.5,delay:i*.03,scrollTrigger:{trigger:c,start:'top 98%',once:true}}));
  gsap.utils.toArray('.trust-item').forEach((it,i)=>gsap.from(it,{opacity:0,y:15,duration:.4,delay:i*.03,scrollTrigger:{trigger:it,start:'top 98%',once:true}}));
  gsap.utils.toArray('.pi-img img').forEach(img=>gsap.to(img,{yPercent:-10,ease:'none',scrollTrigger:{trigger:img.closest('.portfolio-item'),start:'top bottom',end:'bottom top',scrub:1}}));
}

/* ---- Utilities ---- */
document.querySelectorAll('a[href^="#"]').forEach(l=>{l.addEventListener('click',e=>{const t=document.querySelector(l.getAttribute('href'));if(!t)return;e.preventDefault();if(typeof gsap!=='undefined')gsap.to(window,{scrollTo:{y:t,offsetY:80},duration:1,ease:'power3.inOut'});else t.scrollIntoView({behavior:'smooth'});document.querySelector('header ul')?.classList.remove('open')})});
document.querySelector('.mobile-menu-btn')?.addEventListener('click',()=>document.querySelector('header ul')?.classList.toggle('open'));
const fc=document.querySelector('.floating-cta'),stb=document.querySelector('.scroll-to-top-btn'),csc=document.getElementById('contact');
window.addEventListener('scroll',()=>{const s=window.scrollY>600;let nc=false;if(csc){const r=csc.getBoundingClientRect();nc=r.top<window.innerHeight&&r.bottom>0}fc?.classList.toggle('visible',s&&!nc);stb?.classList.toggle('visible',s)});
const form=document.querySelector('.contact-form');if(form)form.addEventListener('submit',async e=>{e.preventDefault();const status=form.querySelector('.form-status'),data=new FormData(form);try{const res=await fetch('/.netlify/functions/contact',{method:'POST',body:JSON.stringify(Object.fromEntries(data)),headers:{'Content-Type':'application/json'}});if(res.ok){status.textContent='✓ Sent!';status.style.color='#34d399';form.reset()}else{status.textContent='✗ Failed.';status.style.color='#ef4444'}}catch{status.textContent='✗ Error.';status.style.color='#ef4444'}});

/* CHANGED: 한국어 번역 — Smart Hands 포지셔닝 반영 */
const translations={ko:{'nav.about':'소개','nav.services':'서비스','nav.portfolio':'포트폴리오','nav.why':'강점','nav.clients':'고객사','nav.contact':'문의','hero.label':'It\'s IT Inc.','hero.line1':'대한민국의 신뢰받는','hero.line2':'데이터센터 &','hero.line3':'IT 인프라','hero.line4':'파트너','hero.subtitle':'전국 당일 현장 엔지니어링 · 한/영 이중 언어 지원 · 글로벌 기업의 현장 엔지니어링 파트너','hero.cta1':'견적 요청','hero.cta2':'서비스 보기','stats.established':'설립','stats.divisions':'사업부','stats.projects':'수행 프로젝트','stats.coverage':'전국 커버리지','stats.support':'지원 가능','about.tag':'회사 소개','about.t1':'대한민국','about.t2':'데이터센터','about.t3':'& IT 인프라 전문기업','about.desc':'부산 본사와 서울 지점을 기반으로, 전국 현장 엔지니어링 서비스를 제공합니다. 단순 작업 대행이 아닌, 현장에서 솔루션을 제공하는 엔지니어링 파트너로서 글로벌 IT 기업의 한국 인프라를 책임집니다.','about.c1.title':'ServicePure','about.c1.desc':'인프라 & 컨설팅 · SI 솔루션','about.c2.title':'SalesPure','about.c2.desc':'기술·글로벌·국내 영업','about.c3.title':'BizPure','about.c3.desc':'마케팅·기획·인사·재무','services.tag':'서비스','services.title':'핵심 서비스','services.desc':'솔루션 설계부터 설치, 운영, 라이프사이클 관리까지 엔드투엔드 인프라 서비스.','services.card1.title':'데이터센터 인프라','services.card1.desc':'랙 배치 설계 & 구축, 광/동 케이블링 경로 설계, BIOS/RAID/OS 구성, HW 수리 및 라이프사이클 관리.','services.card2.title':'스마트 핸즈 & 현장 엔지니어링','services.card2.desc':'단순 리모트 핸즈를 넘어, 현장에서 솔루션을 제공합니다. 랙 배치 설계, 케이블 경로 설계 & 자재 관리, 물리 레이어 트러블슈팅(SFP, 패치, 광 추적), 원격 엔지니어링 팀과 실시간 협업.','services.card3.title':'배포 & 물류','services.card3.desc':'수령~번인테스트~전국배송.','services.card4.title':'End-User IT & 매니지드','services.card4.desc':'PC프로비저닝, OS이미징, 상주엔지니어.','services.card5.title':'금융 트레이딩 인프라','services.card5.desc':'초저지연, 10G/25G/100G, KRX/CME/SGX.','services.badge':'전문 특화','portfolio.tag':'실적','portfolio.title':'구축, 유지보수 & 운영','lifecycle.tag':'운영 방식','lifecycle.title':'운영 프로세스','lifecycle.s1.title':'기획','lifecycle.s1.desc':'컨설팅·설계·평가','lifecycle.s2.title':'배포','lifecycle.s2.desc':'설치·구성·테스트','lifecycle.s3.title':'운영','lifecycle.s3.desc':'모니터링·유지보수·24/7','lifecycle.s4.title':'지원','lifecycle.s4.desc':'장애대응·업그레이드·리포팅','model.t1':'티켓 기반','model.d1':'건별 소규모 IT.','model.t2':'유지보수','model.d2':'정기점검 & 24x7x4.','model.t3':'IT 아웃소싱','model.d3':'전담 상주 SLA기반.','why.tag':'강점','why.title':'Why It\'s IT','why.c1.title':'엔지니어링 파트너','why.c1.desc':'단순 작업 대행이 아닌, 랙 배치 설계부터 케이블 경로 설계, 물리 레이어 트러블슈팅까지 현장에서 솔루션을 제공합니다.','why.c2.title':'네이티브 영어','why.c2.desc':'글로벌 본사와 직접 이중언어 커뮤니케이션.','why.c3.title':'전국 커버리지','why.c3.desc':'전국 당일 출동.','why.c4.title':'유연한 확장성','why.c4.desc':'티켓~풀 아웃소싱.','partners.tag':'생태계','partners.title':'지원 플랫폼','clients.tag':'신뢰','clients.title':'프로젝트 실적','clients.desc':'글로벌 기업이 신뢰.','clients.cat1':'캐피탈 마켓 / 금융','clients.cat2':'미디어 & 디지털','clients.cat3':'엔터프라이즈','clients.note':'* 비밀유지 계약.','coverage.tag':'커버리지','coverage.title':'전국 & 글로벌','coverage.desc':'전역 IT + 국제 파트너.','coverage.direct':'직접 커버리지','coverage.partner':'파트너 네트워크','contact.tag':'연락처','contact.title':'문의하기','contact.subtitle':'프로젝트~파트너십, 한 통화로.','contact.trust1':'24시간 이내','contact.trust2':'한/영 이중언어','contact.trust3':'단건 또는 SLA','contact.form.name':'이름','contact.form.service':'서비스 선택','contact.form.message':'메시지','contact.form.button':'보내기','contact.form.opt0':'서비스 선택','contact.form.opt1':'데이터센터 인프라','contact.form.opt2':'스마트 핸즈 & 현장 엔지니어링','contact.form.opt3':'배포 & 물류','contact.form.opt4':'End-User IT','contact.form.opt5':'금융 트레이딩','contact.form.opt6':'기타','footer.about':'소개','footer.services':'서비스','footer.why':'강점','footer.clients':'고객사','footer.contact':'문의','floating.cta':'문의하기'}};
let currentLang='en';
document.querySelectorAll('.lang-btn').forEach(btn=>{btn.addEventListener('click',e=>{e.preventDefault();const lang=btn.dataset.lang;if(lang===currentLang)return;currentLang=lang;document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.documentElement.lang=lang==='ko'?'ko':'en';applyTranslations(lang)})});
function applyTranslations(lang){document.querySelectorAll('[data-translate-key]').forEach(el=>{const key=el.dataset.translateKey;if(lang==='ko'&&translations.ko[key]){if(el.hasAttribute('data-is-placeholder'))el.placeholder=translations.ko[key];else if(el.tagName==='OPTION')el.textContent=translations.ko[key];else el.innerHTML=translations.ko[key]}else if(lang==='en'&&el.dataset.originalText){if(el.hasAttribute('data-is-placeholder'))el.placeholder=el.dataset.originalText;else if(el.tagName==='OPTION')el.textContent=el.dataset.originalText;else el.innerHTML=el.dataset.originalText}})}
document.querySelectorAll('[data-translate-key]').forEach(el=>{if(el.hasAttribute('data-is-placeholder'))el.dataset.originalText=el.placeholder;else if(el.tagName==='OPTION')el.dataset.originalText=el.textContent;else el.dataset.originalText=el.innerHTML});

})();
