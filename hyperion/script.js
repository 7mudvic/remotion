/* ============================================================
   HYPERION — interactive script
   ============================================================ */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

/* ===== LENIS ===== */
const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* ===== SOUND ENGINE ===== */
class Sound {
  constructor(){ this.ctx=null; this.master=null; this.amb=null; this.muted=true; }
  init(){
    if(this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.18;
    this.master.connect(this.ctx.destination);
    this.muted = false;
  }
  toggle(){
    if(!this.ctx) this.init();
    this.muted = !this.muted;
    gsap.to(this.master.gain, { value: this.muted ? 0 : 0.18, duration: 0.4 });
    if(!this.muted && !this.amb) this.startAmbient();
  }
  startAmbient(){
    const t = this.ctx.currentTime;
    const o1 = this.ctx.createOscillator(); o1.type='sine'; o1.frequency.value=55;
    const o2 = this.ctx.createOscillator(); o2.type='sine'; o2.frequency.value=82.41;
    const o3 = this.ctx.createOscillator(); o3.type='triangle'; o3.frequency.value=110;
    const lfo = this.ctx.createOscillator(); lfo.frequency.value=0.15;
    const lfoGain = this.ctx.createGain(); lfoGain.gain.value=8;
    lfo.connect(lfoGain); lfoGain.connect(o3.frequency);
    const filter = this.ctx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=400; filter.Q.value=2;
    const g = this.ctx.createGain(); g.gain.value=0.06;
    o1.connect(g); o2.connect(g); o3.connect(filter); filter.connect(g);
    g.connect(this.master);
    o1.start(t); o2.start(t); o3.start(t); lfo.start(t);
    this.amb = { o1,o2,o3,lfo,g };
  }
  _noise(d){ const sr=this.ctx.sampleRate; const len=sr*d; const buf=this.ctx.createBuffer(1,len,sr); const ch=buf.getChannelData(0); for(let i=0;i<len;i++) ch[i]=Math.random()*2-1; return buf; }
  click(f=2200){
    if(!this.ctx||this.muted) return;
    const t=this.ctx.currentTime;
    const o=this.ctx.createOscillator(); const g=this.ctx.createGain();
    o.type='sine'; o.frequency.value=f;
    g.gain.setValueAtTime(0.08,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t+0.08);
  }
  whoosh(){
    if(!this.ctx||this.muted) return;
    const t=this.ctx.currentTime; const dur=0.5;
    const s=this.ctx.createBufferSource(); s.buffer=this._noise(dur);
    const f=this.ctx.createBiquadFilter(); f.type='bandpass'; f.Q.value=1.4;
    f.frequency.setValueAtTime(200,t); f.frequency.exponentialRampToValueAtTime(2400,t+dur);
    const g=this.ctx.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.18,t+0.05); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    s.connect(f).connect(g).connect(this.master);
    s.start(t); s.stop(t+dur);
  }
  chord(){
    if(!this.ctx||this.muted) return;
    const t=this.ctx.currentTime;
    [523,659,784].forEach((f,i)=>{
      const o=this.ctx.createOscillator(); const g=this.ctx.createGain();
      o.type='sine'; o.frequency.value=f;
      const s=t+i*0.04;
      g.gain.setValueAtTime(0,s); g.gain.linearRampToValueAtTime(0.10-(i*0.02),s+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,s+0.9);
      o.connect(g).connect(this.master);
      o.start(s); o.stop(s+1);
    });
  }
}
const snd = new Sound();

const audioToggle = document.getElementById('audioToggle');
audioToggle.classList.add('muted');
audioToggle.addEventListener('click', () => {
  snd.toggle();
  audioToggle.classList.toggle('muted', snd.muted);
});

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cOuter = cursor.querySelector('.cursor__outer');
const cDot = cursor.querySelector('.cursor__dot');
const cLabel = document.getElementById('cursorLabel');
let mx = window.innerWidth/2, my = window.innerHeight/2;
let ox = mx, oy = my;
window.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cDot.style.transform=`translate(${mx}px,${my}px)`; });
function cursorLoop(){
  ox += (mx-ox)*0.18;
  oy += (my-oy)*0.18;
  cOuter.style.transform = `translate(${ox}px,${oy}px)`;
  cLabel.style.transform = `translate(${ox+24}px,${oy+24}px)`;
  requestAnimationFrame(cursorLoop);
}
cursorLoop();
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('is-magnetic');
    const label = el.getAttribute('data-cursor');
    if(label){ cLabel.textContent = label; cursor.classList.add('has-label'); }
    snd.click(2400);
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-magnetic','has-label');
  });
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left+r.width/2))*0.18;
    const dy = (e.clientY - (r.top+r.height/2))*0.18;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ===== NAV scroll state ===== */
ScrollTrigger.create({ start:'top -50', toggleClass:{className:'scrolled', targets:'#nav'} });

/* ===== SCROLL PROGRESS ===== */
const sp = document.getElementById('scrollProgress');
ScrollTrigger.create({
  start:0, end:'max',
  onUpdate: self => { sp.style.setProperty('--p', self.progress); sp.querySelector ? null : null; }
});
ScrollTrigger.create({ start:0, end:'max', onUpdate: self => { sp.style.cssText = `--p:${self.progress}`; const after = sp; after.style.setProperty('width', (self.progress*100)+'%'); /* fallback for ::after */ }});
sp.style.cssText = '';
const bar = document.createElement('div');
bar.style.cssText='position:absolute;top:0;left:0;height:100%;width:0;background:linear-gradient(90deg,var(--green),var(--cyan),var(--magenta));transition:width .15s linear';
sp.appendChild(bar);
ScrollTrigger.create({ start:0, end:'max', onUpdate: self => { bar.style.width = (self.progress*100)+'%'; }});

/* ===== AI STATUS METRIC ticker ===== */
const aiMetric = document.getElementById('aiStatusMetric');
setInterval(() => {
  const ms = (0.30 + Math.random()*0.25).toFixed(2);
  aiMetric.textContent = ms + ' ms';
}, 600);

/* ===== TICKER fill ===== */
(function(){
  const items = [
    {s:'BTC',v:'67,234',d:'up',p:'+2.45%'},{s:'ETH',v:'3,456',d:'down',p:'-0.82%'},
    {s:'SPX',v:'5,224',d:'down',p:'-0.10%'},{s:'NDX',v:'18,450',d:'up',p:'+0.52%'},
    {s:'GOLD',v:'2,418',d:'up',p:'+0.31%'},{s:'OIL',v:'78.4',d:'up',p:'+1.12%'},
    {s:'EUR',v:'1.0842',d:'down',p:'-0.18%'},{s:'JPY',v:'151.34',d:'up',p:'+0.04%'},
    {s:'TSLA',v:'247.18',d:'up',p:'+3.42%'},{s:'NVDA',v:'892.04',d:'up',p:'+1.84%'},
  ];
  const html = items.map(i => `<span><b>${i.s}</b> ${i.v} <span class="${i.d}">${i.p}</span></span>`).join('<span style="color:var(--ink-4)">|</span>');
  document.getElementById('ribbonTrack').innerHTML = html + html;
})();

/* ===== HERO TITLE letter split ===== */
(function(){
  const root = document.querySelector('.hero__title');
  root.querySelectorAll('.word').forEach(w => {
    const text = w.dataset.letters || w.textContent;
    if(w.dataset.letters !== undefined){
      w.textContent='';
      [...text].forEach(ch => {
        const span = document.createElement('span');
        span.className='letter';
        span.textContent = ch;
        w.appendChild(span);
      });
    }
  });
})();

/* ===== LOADER sequence ===== */
const loader = document.getElementById('loader');
const loaderArc = document.getElementById('loaderArc');
const loaderPct = document.getElementById('loaderPct');
const loaderTime = document.getElementById('loaderTime');
const loaderRows = document.getElementById('loaderRows');
const arcLen = 2 * Math.PI * 80;

function pad(n,l=3){ return String(n).padStart(l,'0'); }
function fmtTime(ms){ const d=new Date(ms); return `${pad(d.getMinutes(),2)}:${pad(d.getSeconds(),2)}.${pad(d.getMilliseconds())}`; }

const loaderMsgs = [
  '> mounting kernel...',
  '> loading 12.4B parameters... <span class="ok">[OK]</span>',
  '> connecting to NYSE... <span class="ok">[OK]</span>',
  '> connecting to NASDAQ... <span class="ok">[OK]</span>',
  '> connecting to TADAWUL... <span class="ok">[OK]</span>',
  '> warming sentiment model... <span class="ok">[OK]</span>',
  '> warming macro model... <span class="ok">[OK]</span>',
  '> arbiter consensus reached <span class="ok">[OK]</span>',
  '> handshake complete. neural core stable.',
];

function runLoader(){
  let progress = 0;
  let msgIdx = 0;
  const start = performance.now();
  const tick = () => {
    progress += (1.6 + Math.random()*1.4);
    if(progress > 100) progress = 100;
    loaderPct.textContent = pad(Math.floor(progress));
    loaderArc.style.strokeDashoffset = arcLen * (1 - progress/100);
    loaderTime.textContent = fmtTime(performance.now() - start);
    if(progress >= (msgIdx+1)*11 && msgIdx < loaderMsgs.length){
      const div = document.createElement('div');
      div.innerHTML = loaderMsgs[msgIdx++];
      loaderRows.appendChild(div);
      while(loaderRows.children.length > 5) loaderRows.removeChild(loaderRows.firstChild);
    }
    if(progress < 100){ setTimeout(tick, 30); }
    else { setTimeout(finishLoader, 500); }
  };
  tick();
}

function finishLoader(){
  snd.whoosh();
  const tl = gsap.timeline({ onComplete: () => loader.remove() });
  tl.to(loader, { opacity: 0, duration: 0.8, ease:'power2.inOut' });
  tl.add(introTimeline(), '-=0.6');
}

function introTimeline(){
  const tl = gsap.timeline({ defaults:{ ease:'expo.out' } });
  tl.from('.nav', { y:-40, opacity:0, duration:0.8 });
  tl.from('.hero__meta', { y:20, opacity:0, duration:0.8 }, '-=0.4');
  tl.from('.hero__title .letter', { y:'120%', opacity:0, duration:1, stagger:0.04, ease:'expo.out' }, '-=0.4');
  tl.from('.hero__title .line--accent .word', { y:30, opacity:0, duration:0.8, stagger:0.08 }, '-=0.7');
  tl.from('.hero__lede', { y:20, opacity:0, duration:0.8 }, '-=0.5');
  tl.from('.hero__cta .btn', { y:20, opacity:0, duration:0.7, stagger:0.1 }, '-=0.5');
  tl.to('.hero__stats .stat', { opacity:1, y:0, duration:0.8, stagger:0.08 }, '-=0.5');
  tl.from('.ribbon', { opacity:0, duration:1 }, '-=0.6');
  tl.from('.ai-status, .audio-toggle', { y:20, opacity:0, duration:0.8, stagger:0.08 }, '-=0.6');
  tl.call(() => animateStats('.hero__stats [data-count]'));
  return tl;
}

/* ===== STATS counter ===== */
function animateStats(selector){
  document.querySelectorAll(selector).forEach(el => {
    const target = parseFloat(el.dataset.count.replace(/,/g,''));
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.6, ease: 'expo.out',
      onUpdate: () => {
        let v = decimals ? obj.v.toFixed(decimals) : Math.floor(obj.v);
        if(target >= 1000) v = Math.floor(obj.v).toLocaleString();
        el.textContent = v;
      }
    });
  });
}

/* ===== MANIFESTO lit reveal ===== */
gsap.utils.toArray('.manifesto__text span').forEach((s,i) => {
  ScrollTrigger.create({
    trigger: s, start:'top 70%',
    onEnter: () => { s.classList.add('lit'); snd.click(800 + i*150); }
  });
});

/* ===== ENGINE cells reveal ===== */
gsap.to('.engine__cell', {
  opacity:1, y:0, duration:0.9, ease:'expo.out', stagger:0.08,
  scrollTrigger:{ trigger:'.engine__grid', start:'top 80%' }
});

/* ===== STATS BLOCK reveal + count ===== */
ScrollTrigger.create({
  trigger:'.stats__grid', start:'top 75%', once:true,
  onEnter: () => {
    gsap.to('[data-big-stat]', { opacity:1, y:0, duration:1, ease:'expo.out', stagger:0.12 });
    animateStats('[data-big-stat] [data-count]');
    snd.chord();
  }
});

/* ============================================================
   LIVE CHART (animated candles + prediction)
   ============================================================ */
(function(){
  const svg = document.getElementById('chartSvg');
  const candleHost = document.getElementById('chartCandles');
  const linePath = document.getElementById('chartLine');
  const areaPath = document.getElementById('chartArea');
  const predPath = document.getElementById('chartPred');
  const cursor = document.getElementById('chartCursor');
  const livePrice = document.getElementById('livePrice');
  const livePct = document.getElementById('livePct');
  const predPrice = document.getElementById('predPrice');

  const W=600, H=280, N=60;
  let data = [];
  let basePrice = 67000;

  function gen(){
    data = [];
    let price = basePrice;
    for(let i=0;i<N;i++){
      const o = price;
      const change = (Math.random()-0.48) * 250;
      const c = o + change;
      const range = Math.abs(change) + 80 + Math.random()*180;
      const h = Math.max(o,c) + Math.random()*range*0.4;
      const l = Math.min(o,c) - Math.random()*range*0.4;
      data.push({o,h,l,c});
      price = c;
    }
  }
  gen();

  function render(){
    const min = Math.min(...data.map(d=>d.l));
    const max = Math.max(...data.map(d=>d.h));
    const pad = (max-min)*0.12;
    const lo = min - pad, hi = max + pad;
    const yScale = v => H - ((v-lo)/(hi-lo)) * H;
    const w = W / N;
    const cw = w * 0.6;

    candleHost.innerHTML = data.map((d,i) => {
      const x = i*w + w/2;
      const up = d.c >= d.o;
      const fill = up ? 'rgba(0,255,178,.85)' : 'rgba(255,85,85,.85)';
      const yO = yScale(d.o), yC = yScale(d.c);
      const yH = yScale(d.h), yL = yScale(d.l);
      const top = Math.min(yO,yC), height = Math.max(1, Math.abs(yO-yC));
      return `<line x1="${x}" y1="${yH}" x2="${x}" y2="${yL}" stroke="${fill}" stroke-width="1"/>`+
             `<rect x="${x-cw/2}" y="${top}" width="${cw}" height="${height}" fill="${fill}" />`;
    }).join('');

    // Close-line
    const closes = data.map((d,i) => [i*w+w/2, yScale(d.c)]);
    let lp = `M ${closes[0][0]},${closes[0][1]}`;
    for(let i=1;i<closes.length;i++) lp += ` L ${closes[i][0]},${closes[i][1]}`;
    linePath.setAttribute('d', lp);
    areaPath.setAttribute('d', lp + ` L ${W},${H} L 0,${H} Z`);

    // Prediction (extrapolate next 4)
    const last = data[data.length-1].c;
    const trend = data.slice(-10).reduce((s,d,i,a)=> s + (i? d.c-a[i-1].c : 0),0) / 9;
    const ppts = [];
    for(let i=0;i<5;i++){
      const x = (N-1+i)*w + w/2;
      const v = last + trend*i + (Math.random()-0.5)*120;
      ppts.push([Math.min(W-2, x), yScale(v)]);
    }
    let pp = `M ${ppts[0][0]},${ppts[0][1]}`;
    for(let i=1;i<ppts.length;i++) pp += ` L ${ppts[i][0]},${ppts[i][1]}`;
    predPath.setAttribute('d', pp);

    // Cursor on last
    cursor.setAttribute('cx', closes[closes.length-1][0]);
    cursor.setAttribute('cy', closes[closes.length-1][1]);

    // Update price labels
    const cur = data[data.length-1].c;
    const first = data[0].c;
    const pct = ((cur-first)/first)*100;
    livePrice.textContent = cur.toLocaleString(undefined,{maximumFractionDigits:2});
    livePct.textContent = (pct>=0?'+':'')+pct.toFixed(2)+'%';
    livePct.className = 'mono ' + (pct>=0?'up':'down');
    const pred = ppts[ppts.length-1] ? data[data.length-1].c + trend*4 : cur*1.01;
    predPrice.textContent = pred.toLocaleString(undefined,{maximumFractionDigits:2});
  }

  render();

  // Periodic update: shift left, push new candle
  setInterval(() => {
    const last = data[data.length-1].c;
    const o = last;
    const change = (Math.random()-0.48) * 280;
    const c = o + change;
    const range = Math.abs(change)+80+Math.random()*200;
    const h = Math.max(o,c)+Math.random()*range*0.4;
    const l = Math.min(o,c)-Math.random()*range*0.4;
    data.shift();
    data.push({o,h,l,c});
    render();
    snd.click(1100 + Math.random()*400);
  }, 1800);

  // Animate signals on scroll into view
  ScrollTrigger.create({
    trigger:'.dashboard__panel', start:'top 70%', once:true,
    onEnter: () => {
      gsap.to('[data-signal]', { opacity:1, x:0, duration:0.7, stagger:0.18, ease:'expo.out',
        onStart: () => snd.click(1800) });
    }
  });
})();

/* ============================================================
   THREE.JS — HERO NEURAL SPHERE
   ============================================================ */
(function(){
  const canvas = document.getElementById('heroCanvas');
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  cam.position.set(0, 0, 6);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0x000000, 0);

  const N = 320;
  const positions = new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const phi = Math.acos(2*Math.random()-1);
    const theta = Math.random()*Math.PI*2;
    const r = 2.0;
    positions[i*3]   = r*Math.sin(phi)*Math.cos(theta);
    positions[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
    positions[i*3+2] = r*Math.cos(phi);
  }
  const ptsGeo = new THREE.BufferGeometry();
  ptsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const ptsMat = new THREE.PointsMaterial({ color:0xffffff, size:0.04, sizeAttenuation:true, transparent:true, opacity:0.85 });
  const points = new THREE.Points(ptsGeo, ptsMat);
  scene.add(points);

  // Lines between near neighbors
  const linePts = [];
  const lineColors = [];
  const TH = 0.7; const TH2 = TH*TH;
  for(let i=0;i<N;i++){
    for(let j=i+1;j<N;j++){
      const dx = positions[i*3]-positions[j*3];
      const dy = positions[i*3+1]-positions[j*3+1];
      const dz = positions[i*3+2]-positions[j*3+2];
      const d2 = dx*dx+dy*dy+dz*dz;
      if(d2 < TH2){
        linePts.push(positions[i*3],positions[i*3+1],positions[i*3+2]);
        linePts.push(positions[j*3],positions[j*3+1],positions[j*3+2]);
        const a = 1 - Math.sqrt(d2)/TH;
        lineColors.push(0,1,0.7,a*0.5, 0,1,0.7,a*0.5);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
  const lineMat = new THREE.LineBasicMaterial({ color:0x00ffb2, transparent:true, opacity:0.18 });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // Inner glow sphere
  const glowGeo = new THREE.SphereGeometry(1.3, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({ color:0x00ffb2, transparent:true, opacity:0.04 });
  scene.add(new THREE.Mesh(glowGeo, glowMat));

  // Bloom
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, cam));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.95, 0.6, 0.0));

  function resize(){
    const w = innerWidth, h = innerHeight;
    cam.aspect = w/h; cam.updateProjectionMatrix();
    renderer.setSize(w,h); composer.setSize(w,h);
  }
  resize();
  window.addEventListener('resize', resize);

  let mxn = 0, myn = 0;
  window.addEventListener('mousemove', e => {
    mxn = (e.clientX/innerWidth)*2 - 1;
    myn = (e.clientY/innerHeight)*2 - 1;
  });

  const clock = new THREE.Clock();
  function loop(){
    requestAnimationFrame(loop);
    const dt = clock.getDelta();
    points.rotation.y += dt * 0.12;
    points.rotation.x += dt * 0.06;
    lines.rotation.y = points.rotation.y;
    lines.rotation.x = points.rotation.x;
    cam.position.x += (mxn*0.5 - cam.position.x) * 0.03;
    cam.position.y += (-myn*0.3 - cam.position.y) * 0.03;
    cam.lookAt(0,0,0);
    composer.render();
  }
  loop();
})();

/* ============================================================
   THREE.JS — ENGINE NEURAL NETWORK (layers + flow)
   ============================================================ */
(function(){
  const canvas = document.getElementById('engineCanvas');
  if(!canvas) return;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  cam.position.set(0, 0, 8);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0x000000, 0);

  // Layers
  const LAYERS = [4, 8, 12, 8, 4];
  const nodePositions = [];
  const allNodes = [];
  LAYERS.forEach((count, li) => {
    const layerArr = [];
    const x = (li - (LAYERS.length-1)/2) * 1.4;
    for(let i=0;i<count;i++){
      const y = (i - (count-1)/2) * 0.55;
      const z = 0;
      layerArr.push(new THREE.Vector3(x,y,z));
      allNodes.push({pos:new THREE.Vector3(x,y,z), layer:li});
    }
    nodePositions.push(layerArr);
  });

  // Node spheres
  const nodeGeo = new THREE.SphereGeometry(0.07, 16, 16);
  const nodeMat = new THREE.MeshBasicMaterial({ color:0xffffff });
  allNodes.forEach(n => {
    const m = new THREE.Mesh(nodeGeo, nodeMat);
    m.position.copy(n.pos);
    scene.add(m);
    n.mesh = m;
  });

  // Connection lines
  const linePts = [];
  for(let li=0; li<LAYERS.length-1; li++){
    nodePositions[li].forEach(a => {
      nodePositions[li+1].forEach(b => {
        linePts.push(a.x,a.y,a.z, b.x,b.y,b.z);
      });
    });
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
  const lineMat = new THREE.LineBasicMaterial({ color:0x00ffb2, transparent:true, opacity:0.18 });
  const netLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(netLines);

  // Flowing pulse particles between layers
  const pulseGeo = new THREE.BufferGeometry();
  const PULSES = 80;
  const pulseData = [];
  const pulsePos = new Float32Array(PULSES*3);
  for(let i=0;i<PULSES;i++){
    const li = Math.floor(Math.random()*(LAYERS.length-1));
    const a = nodePositions[li][Math.floor(Math.random()*LAYERS[li])];
    const b = nodePositions[li+1][Math.floor(Math.random()*LAYERS[li+1])];
    pulseData.push({ a, b, t: Math.random(), s: 0.6 + Math.random()*0.6 });
    pulsePos[i*3]=a.x; pulsePos[i*3+1]=a.y; pulsePos[i*3+2]=a.z;
  }
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
  const pulseMat = new THREE.PointsMaterial({ color:0x00ffb2, size:0.08, transparent:true, opacity:0.95, sizeAttenuation:true });
  const pulses = new THREE.Points(pulseGeo, pulseMat);
  scene.add(pulses);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, cam));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.2, 0.6, 0.0));

  function resize(){
    const r = canvas.parentElement.getBoundingClientRect();
    cam.aspect = r.width/r.height; cam.updateProjectionMatrix();
    renderer.setSize(r.width, r.height); composer.setSize(r.width, r.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function loop(){
    requestAnimationFrame(loop);
    const dt = clock.getDelta();
    netLines.rotation.y += dt * 0.05;
    pulses.rotation.y = netLines.rotation.y;

    const arr = pulses.geometry.attributes.position.array;
    pulseData.forEach((p, i) => {
      p.t += dt * p.s;
      if(p.t > 1){
        p.t = 0;
        const li = Math.floor(Math.random()*(LAYERS.length-1));
        p.a = nodePositions[li][Math.floor(Math.random()*LAYERS[li])];
        p.b = nodePositions[li+1][Math.floor(Math.random()*LAYERS[li+1])];
      }
      arr[i*3]   = p.a.x + (p.b.x-p.a.x)*p.t;
      arr[i*3+1] = p.a.y + (p.b.y-p.a.y)*p.t;
      arr[i*3+2] = p.a.z + (p.b.z-p.a.z)*p.t;
    });
    pulses.geometry.attributes.position.needsUpdate = true;

    composer.render();
  }
  loop();
})();

/* ===== ACCESS form click ===== */
document.getElementById('accessSubmit').addEventListener('click', () => {
  snd.chord();
  const btn = document.getElementById('accessSubmit');
  const original = btn.querySelector('span').textContent;
  btn.querySelector('span').textContent = 'INVITE REQUESTED';
  gsap.fromTo(btn, { scale:0.96 }, { scale:1, duration:0.4, ease:'expo.out' });
  setTimeout(() => { btn.querySelector('span').textContent = original; }, 2400);
});

/* ===== Smooth scroll links ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id.length > 1){
      const tgt = document.querySelector(id);
      if(tgt){ e.preventDefault(); lenis.scrollTo(tgt, { offset:-80, duration:1.6 }); snd.whoosh(); }
    }
  });
});

/* ===== START ===== */
runLoader();
