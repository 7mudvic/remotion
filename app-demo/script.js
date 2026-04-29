/* ============================================================
   ALFEX APP DEMO — auto-running flow:
   home → type prompt → send → chat → AI response → cinematic zoom
   ============================================================ */

/* ---------- SOUND ENGINE ---------- */
class SoundEngine {
  constructor(){ this.ctx=null; this.master=null; this.on=false }
  init(){
    if(this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.32;
    this.master.connect(this.ctx.destination);
    this.on = true;
  }
  _noise(d=0.5){
    const sr = this.ctx.sampleRate;
    const len = sr*d;
    const buf = this.ctx.createBuffer(1,len,sr);
    const ch = buf.getChannelData(0);
    for(let i=0;i<len;i++) ch[i] = Math.random()*2-1;
    return buf;
  }
  key(){
    if(!this.on) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noise(0.04);
    const f = this.ctx.createBiquadFilter();
    f.type='highpass'; f.frequency.value=2400;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t+0.04);
    src.connect(f).connect(g).connect(this.master);
    src.start(t); src.stop(t+0.05);
  }
  send(){
    if(!this.on) return;
    const t = this.ctx.currentTime;
    const dur = 0.5;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noise(dur);
    const f = this.ctx.createBiquadFilter();
    f.type='bandpass'; f.Q.value=1.5;
    f.frequency.setValueAtTime(800, t);
    f.frequency.exponentialRampToValueAtTime(3000, t+dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.35, t+0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t+dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(t); src.stop(t+dur);
    // tone
    const osc = this.ctx.createOscillator();
    const og = this.ctx.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t+dur);
    og.gain.setValueAtTime(0.18, t);
    og.gain.exponentialRampToValueAtTime(0.001, t+dur);
    osc.connect(og).connect(this.master);
    osc.start(t); osc.stop(t+dur);
  }
  receive(){
    if(!this.on) return;
    const t = this.ctx.currentTime;
    const freqs=[523, 659, 784]; // C5 E5 G5 chord
    freqs.forEach((f,i)=>{
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type='sine'; o.frequency.value=f;
      const start = t + i*0.04;
      g.gain.setValueAtTime(0,start);
      g.gain.linearRampToValueAtTime(0.18-(i*0.04), start+0.02);
      g.gain.exponentialRampToValueAtTime(0.001, start+1.2);
      o.connect(g).connect(this.master);
      o.start(start); o.stop(start+1.3);
    });
  }
  pop(freq=1100){
    if(!this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type='sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq*.5, t+0.08);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t+0.1);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t+0.12);
  }
  zoom(){
    if(!this.on) return;
    const t = this.ctx.currentTime;
    const dur = 1.2;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type='sine';
    o.frequency.setValueAtTime(80, t);
    o.frequency.exponentialRampToValueAtTime(220, t+dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t+0.1);
    g.gain.exponentialRampToValueAtTime(0.001, t+dur);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t+dur);
    // sparkle layer
    const o2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    o2.type='triangle';
    o2.frequency.setValueAtTime(1760, t);
    o2.frequency.exponentialRampToValueAtTime(880, t+dur);
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(0.10, t+0.08);
    g2.gain.exponentialRampToValueAtTime(0.001, t+dur);
    o2.connect(g2).connect(this.master);
    o2.start(t); o2.stop(t+dur);
  }
}
const sound = new SoundEngine();

/* ---------- TICKER ---------- */
function fillTicker(){
  const items = [
    {sym:'S&P 500', val:'5,224.60', dir:'down', pct:'-0.50%'},
    {sym:'NASDAQ',  val:'16,887.17', dir:'up', pct:'+1.04%'},
    {sym:'BTC',     val:'$67,234',   dir:'up', pct:'+2.45%'},
    {sym:'ETH',     val:'$3,456',    dir:'down', pct:'-0.82%'},
    {sym:'GOLD',    val:'$2,418',    dir:'up', pct:'+0.31%'},
    {sym:'TASI',    val:'12,418',    dir:'up', pct:'+0.42%'},
    {sym:'OIL',     val:'$78.4',     dir:'up', pct:'+1.12%'},
  ];
  const html = items.map(i =>
    `<span><b>${i.sym}</b> ${i.val} <span class="${i.dir}">${i.pct}</span></span>`
  ).join('');
  document.getElementById('tickerTrack').innerHTML = html + html;
}

/* ---------- TYPING INTO INPUT ---------- */
function typePrompt(text, perChar = 90){
  const inputText = document.getElementById('inputText');
  const placeholder = document.getElementById('placeholder');
  const caret = document.getElementById('caret');
  const inputRow = document.getElementById('inputRow');
  const sendBtn = document.getElementById('sendBtn');

  return new Promise(resolve => {
    placeholder.classList.add('gone');
    caret.classList.add('show');
    inputRow.classList.add('focused');

    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        // Activate send
        sendBtn.classList.add('active');
        gsap.to(sendBtn, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
        resolve();
        return;
      }
      inputText.textContent += text[i];
      sound.key();
      i++;
    }, perChar);
  });
}

/* ---------- STREAM AI RESPONSE ---------- */
function streamElement(el, delay = 0){
  return new Promise(resolve => {
    setTimeout(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
        onStart: () => sound.pop(900 + Math.random() * 400),
        onComplete: resolve,
      });
    }, delay);
  });
}

/* ---------- MAIN AUTO PLAY ---------- */
async function play(){
  const home = document.getElementById('home');
  const chatView = document.getElementById('chatView');
  const userMsg = document.getElementById('userMsg');
  const thinking = document.getElementById('thinking');
  const aiResponse = document.getElementById('aiResponse');
  const aiBubble = document.getElementById('aiBubble');
  const phone = document.getElementById('phone');
  const phoneScreen = document.querySelector('.phone-screen');
  const zoomVignette = document.getElementById('zoomVignette');
  const inputText = document.getElementById('inputText');
  const inputRow = document.getElementById('inputRow');
  const placeholder = document.getElementById('placeholder');
  const caret = document.getElementById('caret');
  const sendBtn = document.getElementById('sendBtn');
  const chips = document.querySelectorAll('.chip');

  while (true) {
    /* ===== RESET ===== */
    inputText.textContent = '';
    placeholder.classList.remove('gone');
    caret.classList.remove('show');
    inputRow.classList.remove('focused');
    sendBtn.classList.remove('active');
    gsap.set(home, { opacity: 1, scale: 1 });
    gsap.set(chatView, { y: '100%', visibility: 'hidden', scale: 1 });
    gsap.set(phoneScreen, { scale: 1, x: 0, y: 0 });
    gsap.set(zoomVignette, { opacity: 0 });
    gsap.set(userMsg, { opacity: 0, y: 12, scale: .95 });
    gsap.set(thinking, { display: 'none' });
    gsap.set(aiResponse, { display: 'none' });
    aiResponse.classList.remove('show');
    thinking.classList.remove('show');
    document.querySelectorAll('[data-stream]').forEach(el => {
      gsap.set(el, { opacity: 0, y: 8 });
    });
    chips.forEach(c => gsap.set(c, { opacity: 0, y: 8 }));

    /* ===== PHASE 1: home reveal ===== */
    await new Promise(r => setTimeout(r, 600));

    // chips fade in (one by one)
    for (let i = 0; i < chips.length; i++) {
      gsap.to(chips[i], {
        opacity: 1, y: 0, duration: 0.4, ease: 'expo.out',
        onStart: () => sound.pop(700 + i * 80),
      });
      await new Promise(r => setTimeout(r, 130));
    }

    /* ===== PHASE 2: typing ===== */
    await new Promise(r => setTimeout(r, 800));
    await typePrompt('حلل لي سوق الذهب', 95);

    await new Promise(r => setTimeout(r, 700));

    /* ===== PHASE 3: send + transition ===== */
    sound.send();
    // Send button press anim
    gsap.to(sendBtn, { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1 });
    // Subtle phone shake
    gsap.to(phoneScreen, { x: -2, duration: 0.06, yoyo: true, repeat: 5, ease: 'power1.inOut' });

    await new Promise(r => setTimeout(r, 200));

    // Slide chat up
    gsap.set(chatView, { visibility: 'visible' });
    await gsap.to(chatView, { y: 0, duration: 0.7, ease: 'expo.out' });

    /* ===== PHASE 4: user message + thinking ===== */
    gsap.to(userMsg, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' });
    sound.pop(660);
    await new Promise(r => setTimeout(r, 600));

    thinking.style.display = 'flex';
    thinking.classList.add('show');
    gsap.fromTo(thinking, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 });

    await new Promise(r => setTimeout(r, 1800));

    /* ===== PHASE 5: AI response stream ===== */
    // hide thinking, show response
    await gsap.to(thinking, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' });
    thinking.style.display = 'none';
    thinking.classList.remove('show');

    aiResponse.style.display = 'flex';
    aiResponse.classList.add('show');
    sound.receive();

    const streamables = aiBubble.querySelectorAll('[data-stream]');
    for (let i = 0; i < streamables.length; i++) {
      await streamElement(streamables[i], 180);
    }

    // disclaimer
    const disc = document.querySelector('.r-disclaimer');
    gsap.to(disc, { opacity: 1, duration: 0.4 });

    await new Promise(r => setTimeout(r, 1500));

    /* ===== PHASE 6: CINEMATIC ZOOM ===== */
    sound.zoom();
    gsap.to(zoomVignette, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });

    // Find recommendation card to zoom into
    const recEl = document.querySelector('.r-rec');
    const phoneRect = phoneScreen.getBoundingClientRect();
    const recRect = recEl.getBoundingClientRect();
    const targetCenterX = recRect.left + recRect.width / 2;
    const targetCenterY = recRect.top + recRect.height / 2;
    const phoneCenterX = phoneRect.left + phoneRect.width / 2;
    const phoneCenterY = phoneRect.top + phoneRect.height / 2;
    const dx = phoneCenterX - targetCenterX;
    const dy = phoneCenterY - targetCenterY;

    gsap.to(phoneScreen, {
      scale: 2.4,
      x: dx,
      y: dy,
      duration: 1.6,
      ease: 'expo.inOut',
    });

    // Pulse the rec card during zoom
    gsap.to(recEl, {
      boxShadow: '0 0 60px rgba(30,211,138,.6)',
      duration: 1.6,
      ease: 'power2.inOut',
    });

    await new Promise(r => setTimeout(r, 3500));

    /* ===== PHASE 7: ZOOM OUT and prepare for loop ===== */
    gsap.to(phoneScreen, {
      scale: 1, x: 0, y: 0, duration: 1.0, ease: 'expo.inOut',
    });
    gsap.to(recEl, { boxShadow: 'none', duration: 0.8 });
    gsap.to(zoomVignette, { opacity: 0, duration: 1.0 });

    await new Promise(r => setTimeout(r, 1500));

    // Slide chat back down
    await gsap.to(chatView, { y: '100%', duration: 0.8, ease: 'expo.in' });

    await new Promise(r => setTimeout(r, 500));
  }
}

/* ---------- BOOT ---------- */
fillTicker();

document.getElementById('enableBtn').addEventListener('click', () => {
  sound.init();
  sound.pop(800);
  document.getElementById('enable').classList.add('gone');
  setTimeout(() => play(), 600);
});
