/* ============================================================
   ALFEX — premium scroll site
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ---------- LENIS smooth scroll ---------- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
  const fill = document.querySelector('.loader-fill');
  const loader = document.getElementById('loader');
  gsap.timeline({
    onComplete: () => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
      setTimeout(() => loader.remove(), 700);
      runHeroIntro();
    },
  })
    .to(fill, { width: '100%', duration: 1.2, ease: 'power2.inOut' })
    .to('.loader', { delay: 0.1, duration: 0 });
});

/* ---------- NAV scroll state ---------- */
ScrollTrigger.create({
  start: 'top -40',
  end: 99999,
  toggleClass: { className: 'scrolled', targets: '#nav' },
});

/* ---------- HERO PARTICLES ---------- */
(function makeParticles() {
  const host = document.getElementById('particles');
  if (!host) return;
  const N = 40;
  for (let i = 0; i < N; i++) {
    const s = document.createElement('span');
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 1 + Math.random() * 2;
    s.style.left = x + '%';
    s.style.top = y + '%';
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.opacity = 0.2 + Math.random() * 0.5;
    host.appendChild(s);
    gsap.to(s, {
      y: (Math.random() - 0.5) * 80,
      x: (Math.random() - 0.5) * 60,
      duration: 4 + Math.random() * 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: Math.random() * 2,
    });
  }
})();

/* ---------- ATOM ELECTRONS orbital motion ---------- */
(function animateElectrons() {
  const electrons = document.querySelectorAll('.atom-electron');
  const radii = [{ rx: 160, ry: 60, rot: 0, dur: 4 }, { rx: 160, ry: 60, rot: 60, dur: 5.5 }, { rx: 160, ry: 60, rot: -60, dur: 7 }];
  electrons.forEach((el, i) => {
    const cfg = radii[i];
    const cx = 200, cy = 200;
    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: Math.PI * 2,
      duration: cfg.dur,
      ease: 'none',
      repeat: -1,
      onUpdate: () => {
        const a = proxy.t;
        const x = cx + cfg.rx * Math.cos(a);
        const y = cy + cfg.ry * Math.sin(a);
        const rotRad = (cfg.rot * Math.PI) / 180;
        const dx = x - cx, dy = y - cy;
        const rx = cx + dx * Math.cos(rotRad) - dy * Math.sin(rotRad);
        const ry = cy + dx * Math.sin(rotRad) + dy * Math.cos(rotRad);
        el.setAttribute('cx', rx);
        el.setAttribute('cy', ry);
      },
    });
  });
})();

/* ---------- TICKER content ---------- */
(function fillTicker() {
  const items = [
    { sym: 'BTC', val: '$67,234', dir: 'up', pct: '+2.45%' },
    { sym: 'ETH', val: '$3,456', dir: 'down', pct: '-0.82%' },
    { sym: 'TASI', val: '12,418', dir: 'up', pct: '+0.42%' },
    { sym: 'GOLD', val: '$2,418', dir: 'up', pct: '+0.31%' },
    { sym: 'SOL', val: '$184', dir: 'up', pct: '+3.18%' },
    { sym: 'OIL', val: '$78.4', dir: 'up', pct: '+1.12%' },
    { sym: 'EUR/USD', val: '1.0842', dir: 'down', pct: '-0.18%' },
    { sym: 'S&P 500', val: '5,245', dir: 'down', pct: '-0.10%' },
    { sym: 'DXY', val: '104.2', dir: 'up', pct: '+0.10%' },
    { sym: 'NVDA', val: '$892', dir: 'up', pct: '+1.84%' },
  ];
  const html = items
    .map((i) => `<span><b>${i.sym}</b> ${i.val} <span class="${i.dir}">${i.pct}</span></span>`)
    .join('');
  const track = document.getElementById('tickerTrack');
  track.innerHTML = html + html;
})();

/* ---------- HERO INTRO animation ---------- */
function runHeroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero__atom', { y: 60, opacity: 0, scale: 0.7, duration: 1.2 })
    .from('.hero__title .word', { y: '110%', opacity: 0, duration: 1, stagger: 0.06 }, '-=0.7')
    .from('.hero__sub', { y: 24, opacity: 0, duration: 0.9 }, '-=0.5')
    .from('.hero__cta .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.5')
    .from('.ticker', { opacity: 0, duration: 1 }, '-=0.6')
    .from('.hero__scroll', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5');
}

/* ---------- INTRO TEXT — word-by-word lit ---------- */
(function introText() {
  const intro = document.getElementById('introText');
  if (!intro) return;
  const lines = intro.querySelectorAll('span');
  lines.forEach((line, i) => {
    ScrollTrigger.create({
      trigger: intro,
      start: `top+=${i * 80} 60%`,
      end: `top+=${i * 80 + 200} 30%`,
      onEnter: () => line.classList.add('lit'),
      onLeaveBack: () => line.classList.remove('lit'),
    });
  });
})();

/* ---------- FEATURES reveal ---------- */
gsap.utils.toArray('[data-feature]').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
    delay: (i % 3) * 0.08,
  });
});

/* ---------- DEMO PINNED chat scroll ---------- */
(function demoScroll() {
  const demo = document.querySelector('.demo');
  const phone = document.getElementById('demoPhone');
  const chat = document.getElementById('chat');
  const msgs = chat.querySelectorAll('[data-msg]');
  if (!demo) return;

  /* Pin the demo section so messages reveal as the user scrolls */
  ScrollTrigger.create({
    trigger: demo,
    start: 'top top',
    end: '+=2400',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;
      const total = msgs.length;
      msgs.forEach((m, i) => {
        const start = i / total;
        const end = (i + 1) / total;
        let local = (p - start) / (end - start);
        local = Math.max(0, Math.min(1, local));
        gsap.set(m, {
          opacity: local,
          y: 16 - local * 16,
        });
      });
    },
  });

  /* Demo points stagger on enter */
  gsap.to('.demo__points li', {
    opacity: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.demo__points', start: 'top 80%' },
  });

  /* Phone subtle parallax */
  gsap.to(phone, {
    y: -40,
    scrollTrigger: {
      trigger: demo,
      start: 'top top',
      end: '+=2400',
      scrub: 1,
    },
  });
})();

/* ---------- HEAT GAUGE animate to 33 ---------- */
(function heatGauge() {
  const needle = document.getElementById('heatNeedle');
  const num = document.getElementById('heatNum');
  const state = document.getElementById('heatState');
  if (!needle) return;
  const target = 33;
  const obj = { v: 0 };

  ScrollTrigger.create({
    trigger: '.heat',
    start: 'top 60%',
    once: true,
    onEnter: () => {
      gsap.to(needle, { left: target + '%', duration: 1.6, ease: 'expo.out' });
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: 'expo.out',
        onUpdate: () => {
          num.textContent = Math.round(obj.v);
        },
        onComplete: () => {
          state.textContent = 'خوف — السوق في حالة ترقّب';
        },
      });
    },
  });

  /* Chips reveal */
  gsap.to('.chip', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.heat__chips', start: 'top 85%' },
  });
})();
gsap.set('.chip', { opacity: 0, y: 30 });

/* ---------- PRICING reveal ---------- */
gsap.utils.toArray('[data-plan]').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
    delay: i * 0.1,
  });
});

/* ---------- CTA pulse ---------- */
gsap.to('.cta__bg', {
  scale: 1.1,
  opacity: 0.7,
  duration: 4,
  yoyo: true,
  repeat: -1,
  ease: 'sine.inOut',
});

/* ---------- Smooth-scroll nav links ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const tgt = document.querySelector(id);
      if (tgt) {
        e.preventDefault();
        lenis.scrollTo(tgt, { offset: -80, duration: 1.4 });
      }
    }
  });
});
