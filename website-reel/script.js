/* ============================================================
   ALFEX REEL — auto-cycling presentation with 3D atom + sound
   ============================================================ */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/* ============================================================
   SOUND ENGINE — procedural Web Audio (no external files)
   ============================================================ */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = false;
  }

  init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.35;
    this.master.connect(this.ctx.destination);
    this.enabled = true;
  }

  // shared noise buffer for whooshes
  _noise(duration = 1) {
    const sr = this.ctx.sampleRate;
    const len = sr * duration;
    const buf = this.ctx.createBuffer(1, len, sr);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    return buf;
  }

  whooshIn(volume = 0.5) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    const dur = 0.7;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noise(dur);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.4;
    filter.frequency.setValueAtTime(120, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + dur);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(gain).connect(this.master);
    src.start(t); src.stop(t + dur);
  }

  whooshOut(volume = 0.4) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    const dur = 0.6;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noise(dur);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.exponentialRampToValueAtTime(180, t + dur);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(gain).connect(this.master);
    src.start(t); src.stop(t + dur);
  }

  tick(freq = 1200, volume = 0.18) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.08);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain).connect(this.master);
    osc.start(t); osc.stop(t + 0.12);
  }

  chime(volume = 0.3) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    const freqs = [880, 1108, 1318, 1760]; // A5, C#6, E6, A6
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const start = t + i * 0.04;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (1 - i * 0.18), start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);
      osc.connect(gain).connect(this.master);
      osc.start(start); osc.stop(start + 1.3);
    });
  }

  type(volume = 0.06) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noise(0.05);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    src.connect(filter).connect(gain).connect(this.master);
    src.start(t); src.stop(t + 0.05);
  }

  scan(volume = 0.18) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    const dur = 1.4;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + dur);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.master);
    osc.start(t); osc.stop(t + dur);
  }

  bell(volume = 0.35) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc2.type = 'sine';
    osc.frequency.value = 660;
    osc2.frequency.value = 990;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
    osc.connect(gain); osc2.connect(gain);
    gain.connect(this.master);
    osc.start(t); osc.stop(t + 1.7);
    osc2.start(t); osc2.stop(t + 1.7);
  }
}
const sound = new SoundEngine();

/* ============================================================
   3D ATOM — Three.js + UnrealBloomPass
   ============================================================ */
class Atom3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.visible = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this._buildAtom();
    this._buildBloom();
    this._resize();

    window.addEventListener('resize', () => this._resize());

    this.clock = new THREE.Clock();
    this._loop();
  }

  _buildAtom() {
    // Core glowing sphere
    const coreGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.core = new THREE.Mesh(coreGeo, coreMat);
    this.scene.add(this.core);

    // Inner glow sphere
    const glowGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00CFFF,
      transparent: true,
      opacity: 0.15,
    });
    this.glow = new THREE.Mesh(glowGeo, glowMat);
    this.scene.add(this.glow);

    // Orbits — 3 elliptical tubes
    const ringConfigs = [
      { color: 0x00CFFF, rot: [0, 0, 0] },
      { color: 0xA855F7, rot: [Math.PI / 3, 0, 0] },
      { color: 0xffffff, rot: [-Math.PI / 3, 0, 0] },
    ];

    this.rings = [];
    this.electrons = [];

    ringConfigs.forEach((cfg, idx) => {
      const curve = new EllipseCurve3D(1.6, 0.6);
      const tube = new THREE.TubeGeometry(curve, 200, 0.012, 8, true);
      const mat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const ring = new THREE.Mesh(tube, mat);
      ring.rotation.set(...cfg.rot);
      this.scene.add(ring);
      this.rings.push(ring);

      // Electron
      const eGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const eMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const electron = new THREE.Mesh(eGeo, eMat);
      this.scene.add(electron);
      this.electrons.push({
        mesh: electron,
        angle: idx * 1.2,
        speed: 0.7 + idx * 0.25,
        curve,
        ring,
      });
    });
  }

  _buildBloom() {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.4, // strength
      0.7, // radius
      0.0  // threshold
    );
    this.composer.addPass(bloom);
  }

  _resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    if (this.composer) this.composer.setSize(w, h);
  }

  setVisible(v) {
    this.visible = v;
    gsap.to(this.canvas, {
      opacity: v ? 1 : 0,
      duration: 1.0,
      ease: 'power2.inOut',
    });
  }

  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this.clock.getDelta();
    const t = this.clock.elapsedTime;

    // Slow camera drift
    this.camera.position.x = Math.sin(t * 0.15) * 0.3;
    this.camera.position.y = Math.cos(t * 0.2) * 0.2;
    this.camera.lookAt(0, 0, 0);

    // Core pulse
    const pulse = 1 + 0.06 * Math.sin(t * 1.4);
    this.core.scale.setScalar(pulse);
    this.glow.scale.setScalar(1 + 0.1 * Math.sin(t * 0.8));

    // Rings slow rotate
    this.rings.forEach((r, i) => {
      r.rotation.z += dt * (0.15 + i * 0.05);
    });

    // Electrons orbit
    this.electrons.forEach((e) => {
      e.angle += dt * e.speed;
      const t01 = (e.angle % (Math.PI * 2)) / (Math.PI * 2);
      const pt = e.curve.getPoint(t01);
      // Apply ring's local rotation
      const v = new THREE.Vector3(pt.x, pt.y, pt.z);
      v.applyEuler(e.ring.rotation);
      // Also apply ring.rotation.z which is animating
      e.mesh.position.copy(v);
    });

    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }
}

class EllipseCurve3D extends THREE.Curve {
  constructor(rx, ry) {
    super();
    this.rx = rx;
    this.ry = ry;
  }
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2;
    return target.set(Math.cos(a) * this.rx, Math.sin(a) * this.ry, 0);
  }
}

/* ============================================================
   PROGRESS DOTS
   ============================================================ */
const SCENE_NAMES = ['hero', 'intro', 'features', 'demo', 'heat', 'pricing', 'cta'];
function buildProgressDots() {
  const host = document.getElementById('progress');
  host.innerHTML = '';
  SCENE_NAMES.forEach(() => {
    const s = document.createElement('span');
    host.appendChild(s);
  });
}
function setActiveDot(idx) {
  const dots = document.querySelectorAll('#progress span');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
    d.classList.toggle('done', i < idx);
  });
}

/* ============================================================
   SCENE HELPERS
   ============================================================ */
function showScene(sel, duration = 1) {
  const el = document.querySelector(sel);
  return gsap.timeline()
    .set(el, { visibility: 'visible' })
    .fromTo(
      el,
      { opacity: 0, scale: 0.97, filter: 'blur(8px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration, ease: 'power3.out' }
    );
}
function hideScene(sel, duration = 0.8) {
  const el = document.querySelector(sel);
  return gsap.timeline()
    .to(el, { opacity: 0, scale: 1.04, filter: 'blur(8px)', duration, ease: 'power2.in' })
    .set(el, { visibility: 'hidden' });
}

/* ============================================================
   SCENES
   ============================================================ */
function sceneHero(atom) {
  const tl = gsap.timeline();
  tl.call(() => { sound.whooshIn(0.5); atom.setVisible(true); setActiveDot(0); });
  tl.add(showScene('.scene--hero', 1.2), 0);
  tl.from('.scene--hero .hero-title .word', {
    yPercent: 110, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
  }, 0.3);
  tl.from('.scene--hero .hero-sub', {
    y: 20, opacity: 0, duration: 0.8, ease: 'expo.out',
  }, '-=0.5');
  tl.from('.scene--hero .hero-cta .btn', {
    y: 20, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out',
    onStart: () => sound.tick(900, 0.12),
  }, '-=0.4');
  tl.to({}, { duration: 3.4 });
  tl.call(() => { sound.whooshOut(0.4); atom.setVisible(false); });
  tl.add(hideScene('.scene--hero', 0.8));
  return tl;
}

function sceneIntro() {
  const tl = gsap.timeline();
  tl.call(() => { sound.whooshIn(0.4); setActiveDot(1); });
  tl.add(showScene('.scene--intro', 1.0), 0);
  tl.from('.scene--intro .eyebrow', { y: 12, opacity: 0, duration: 0.6, ease: 'expo.out' }, 0.2);
  // Lit lines staggered
  const lines = gsap.utils.toArray('.scene--intro .intro-text .line');
  lines.forEach((line, i) => {
    tl.call(() => {
      line.classList.add('lit');
      sound.tick(600 + i * 200, 0.14);
    }, null, 0.5 + i * 1.0);
  });
  tl.to({}, { duration: 1.5 });
  tl.call(() => sound.whooshOut(0.35));
  tl.add(hideScene('.scene--intro', 0.7));
  // Reset for next loop
  tl.call(() => lines.forEach((l) => l.classList.remove('lit')));
  return tl;
}

function sceneFeatures() {
  const tl = gsap.timeline();
  tl.call(() => { sound.whooshIn(0.45); setActiveDot(2); });
  tl.add(showScene('.scene--features', 0.9), 0);
  tl.from('.scene--features .features-head', {
    y: 16, opacity: 0, duration: 0.7, ease: 'expo.out',
  }, 0.2);
  const feats = gsap.utils.toArray('.scene--features .feat');
  feats.forEach((f, i) => {
    tl.to(f, {
      opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
      onStart: () => sound.tick(800 + i * 60, 0.16),
    }, 0.7 + i * 0.5);
  });
  tl.to({}, { duration: 2.5 });
  tl.call(() => sound.whooshOut(0.4));
  tl.add(hideScene('.scene--features', 0.8));
  // Reset
  tl.set(feats, { opacity: 0, y: 28 });
  return tl;
}

function sceneDemo() {
  const tl = gsap.timeline();
  tl.call(() => { sound.whooshIn(0.45); setActiveDot(3); });
  tl.add(showScene('.scene--demo', 1.0), 0);
  tl.from('.scene--demo .eyebrow', { y: 12, opacity: 0, duration: 0.6 }, 0.2);
  tl.from('.scene--demo .demo-title', { y: 18, opacity: 0, duration: 0.8 }, '-=0.3');
  // bullet points
  tl.to('.scene--demo .demo-points li', {
    opacity: 1, x: 0, duration: 0.7, stagger: 0.18, ease: 'expo.out',
    onStart: () => sound.tick(1000, 0.1),
  }, 0.6);

  // Phone messages reveal one by one
  const msgs = gsap.utils.toArray('.scene--demo .msg');
  msgs.forEach((m, i) => {
    tl.to(m, {
      opacity: 1, y: 0, duration: 0.5, ease: 'expo.out',
      onStart: () => {
        if (m.classList.contains('msg--user')) sound.tick(700, 0.1);
        else if (m.classList.contains('msg--ai')) sound.type();
        else sound.tick(900, 0.1);
      },
    }, 0.7 + i * 0.95);
  });

  tl.to({}, { duration: 1.5 });
  tl.call(() => sound.whooshOut(0.4));
  tl.add(hideScene('.scene--demo', 0.8));
  // Reset
  tl.set(msgs, { opacity: 0, y: 12 });
  tl.set('.scene--demo .demo-points li', { opacity: 0, x: -16 });
  return tl;
}

function sceneHeat() {
  const tl = gsap.timeline();
  tl.call(() => { sound.whooshIn(0.4); setActiveDot(4); });
  tl.add(showScene('.scene--heat', 1.0), 0);
  tl.from('.scene--heat .heat-head', { y: 18, opacity: 0, duration: 0.7 }, 0.2);
  tl.from('.scene--heat .heat-card', { y: 18, opacity: 0, duration: 0.7 }, '-=0.3');

  // Animate gauge
  tl.call(() => sound.scan(0.2), null, 1.2);
  tl.to('.scene--heat .heat-needle', {
    left: '33%', duration: 1.4, ease: 'expo.out',
  }, 1.2);
  const numEl = document.getElementById('heatNum');
  const numObj = { v: 0 };
  tl.to(numObj, {
    v: 33, duration: 1.4, ease: 'expo.out',
    onUpdate: () => (numEl.textContent = Math.round(numObj.v)),
    onComplete: () => {
      document.getElementById('heatState').textContent = 'خوف — السوق في حالة ترقّب';
    },
  }, 1.2);

  // Chips
  const chips = gsap.utils.toArray('.scene--heat .chip');
  chips.forEach((c, i) => {
    tl.to(c, {
      opacity: 1, y: 0, duration: 0.5, ease: 'expo.out',
      onStart: () => sound.tick(900 + i * 100, 0.13),
    }, 3.0 + i * 0.12);
  });

  tl.to({}, { duration: 1.6 });
  tl.call(() => sound.whooshOut(0.4));
  tl.add(hideScene('.scene--heat', 0.8));
  // Reset
  tl.set('.scene--heat .heat-needle', { left: 0 });
  tl.call(() => {
    numObj.v = 0;
    numEl.textContent = '0';
    document.getElementById('heatState').textContent = 'جاري القراءة…';
  });
  tl.set(chips, { opacity: 0, y: 20 });
  return tl;
}

function scenePricing() {
  const tl = gsap.timeline();
  tl.call(() => { sound.whooshIn(0.42); setActiveDot(5); });
  tl.add(showScene('.scene--pricing', 0.9), 0);
  tl.from('.scene--pricing .pricing-head', { y: 16, opacity: 0, duration: 0.7 }, 0.2);

  const plans = gsap.utils.toArray('.scene--pricing .plan');
  plans.forEach((p, i) => {
    const priceEl = p.querySelector('[data-count]');
    const target = Number(priceEl.dataset.count);
    tl.to(p, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
      onStart: () => sound.chime(0.18 + i * 0.04),
    }, 0.7 + i * 0.4);
    if (target > 0) {
      const obj = { v: 0 };
      tl.to(obj, {
        v: target, duration: 0.9, ease: 'expo.out',
        onUpdate: () => (priceEl.textContent = Math.round(obj.v)),
      }, 0.95 + i * 0.4);
    }
  });

  tl.to({}, { duration: 2.0 });
  tl.call(() => sound.whooshOut(0.4));
  tl.add(hideScene('.scene--pricing', 0.8));
  // Reset
  tl.set(plans, { opacity: 0, y: 24 });
  tl.call(() => {
    plans.forEach((p) => {
      const el = p.querySelector('[data-count]');
      el.textContent = '0';
    });
  });
  return tl;
}

function sceneCTA() {
  const tl = gsap.timeline();
  tl.call(() => { sound.whooshIn(0.5); setActiveDot(6); sound.bell(0.32); });
  tl.add(showScene('.scene--cta', 1.0), 0);
  tl.from('.scene--cta .cta-title span', {
    yPercent: 110, opacity: 0, duration: 1.0, stagger: 0.15, ease: 'expo.out',
  }, 0.3);
  tl.from('.scene--cta .cta-sub', { y: 16, opacity: 0, duration: 0.7 }, '-=0.4');
  tl.from('.scene--cta .store', {
    y: 20, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'expo.out',
    onStart: () => sound.tick(1200, 0.16),
  }, '-=0.3');
  tl.to({}, { duration: 1.6 });
  tl.call(() => sound.whooshOut(0.4));
  tl.add(hideScene('.scene--cta', 0.8));
  return tl;
}

/* ============================================================
   MASTER TIMELINE
   ============================================================ */
function runMaster(atom) {
  const cycleEl = document.getElementById('cycle');
  let cycle = 1;
  cycleEl.textContent = `cycle ${cycle}`;

  // total per cycle ≈ 65s
  const tl = gsap.timeline({
    repeat: -1,
    onRepeat: () => {
      cycle += 1;
      cycleEl.textContent = `cycle ${cycle}`;
    },
  });

  tl.add(sceneHero(atom));
  tl.add(sceneIntro(), '+=0');
  tl.add(sceneFeatures(), '+=0');
  tl.add(sceneDemo(), '+=0');
  tl.add(sceneHeat(), '+=0');
  tl.add(scenePricing(), '+=0');
  tl.add(sceneCTA(), '+=0');

  return tl;
}

/* ============================================================
   BOOT
   ============================================================ */
const atom = new Atom3D(document.getElementById('atomCanvas'));
atom.setVisible(false);

document.getElementById('enableBtn').addEventListener('click', () => {
  sound.init();
  // Tiny silent ping to "unlock" some browsers
  sound.tick(800, 0.001);

  document.getElementById('enable').classList.add('gone');
  document.querySelector('.brand').classList.add('show');
  document.getElementById('cycle').classList.add('show');

  buildProgressDots();
  setTimeout(() => runMaster(atom), 800);
});
