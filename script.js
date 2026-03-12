// ================================
//   ANRODEV — script.js
// ================================

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── Navbar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile menu ──
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }
document.addEventListener('click', e => {
  if (mobileMenu.classList.contains('open') &&
      !hamburger.contains(e.target) && !mobileMenu.contains(e.target))
    mobileMenu.classList.remove('open');
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll(':scope > .reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = Math.min(idx * 80, 300) + 'ms';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Contact form — Web3Forms ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = document.getElementById('submitBtn');
    const note = document.getElementById('formNote');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
      const json = await res.json();
      if (json.success) {
        btn.textContent      = '✓ Message Sent!';
        btn.style.background = '#16a34a';
        note.textContent     = 'Thank you! We will get back to you within 24 hours.';
        note.style.color     = '#16a34a';
        form.reset();
        setTimeout(() => {
          btn.textContent      = 'Send Message';
          btn.style.background = '';
          btn.disabled         = false;
          note.textContent     = 'Confidential — Institutional Use Only.';
          note.style.color     = '';
        }, 4000);
      } else {
        btn.textContent      = 'Failed — Try Again';
        btn.style.background = '#dc2626';
        btn.disabled         = false;
      }
    } catch {
      btn.textContent      = 'Failed — Try Again';
      btn.style.background = '#dc2626';
      btn.disabled         = false;
    }
  });
}

// ── Active nav highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function setActiveNav() {
  let current = '';
  sections.forEach(s => {
    const top = s.getBoundingClientRect().top;
    if (top <= 120) current = s.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav(); // run on load too

// ── Typing effect ──
(function initTyping() {
  const el = document.getElementById('heroTyping');
  if (!el) return;
  const text = 'We design intelligent automation systems, AI agents, custom applications, and smart digital infrastructure for campuses and organizations.';
  const TYPE_SPD = 32, ERASE_SPD = 14, PAUSE_FULL = 2400, PAUSE_EMPTY = 700;
  let i = 0, erasing = false;
  el.classList.add('typing-active');
  function tick() {
    if (!erasing) {
      el.textContent = text.slice(0, i);
      if (i === text.length) { setTimeout(() => { erasing = true; tick(); }, PAUSE_FULL); return; }
      i++; setTimeout(tick, TYPE_SPD);
    } else {
      el.textContent = text.slice(0, i);
      if (i === 0) { setTimeout(() => { erasing = false; tick(); }, PAUSE_EMPTY); return; }
      i--; setTimeout(tick, ERASE_SPD);
    }
  }
  setTimeout(tick, 1000);
})();

// ── Hero canvas — ribbon waves ──
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, animId, t = 0;

  const RIBBONS = [
    { yBase:0.50, lines:18, spread:0.34, amp1:0.20, amp2:0.09, freq1:1.55, freq2:2.9,  phase1:0.0, phase2:1.1, speed:0.0022, color:[255,255,255], peak:0.48 },
    { yBase:0.44, lines:38, spread:0.24, amp1:0.17, amp2:0.08, freq1:1.85, freq2:2.6,  phase1:2.2, phase2:0.5, speed:0.0017, color:[255,60,70],   peak:0.38 },
    { yBase:0.56, lines:30, spread:0.20, amp1:0.15, amp2:0.07, freq1:2.0,  freq2:1.8,  phase1:1.5, phase2:3.5, speed:0.0015, color:[255,200,40],  peak:0.22 },
    { yBase:0.63, lines:34, spread:0.22, amp1:0.14, amp2:0.06, freq1:2.2,  freq2:1.5,  phase1:4.1, phase2:3.0, speed:0.0018, color:[220,235,255], peak:0.36 },
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    RIBBONS.forEach(rb => { rb._pinches = null; });
  }

  function drawRibbon(rb) {
    const ref = Math.min(W, H);
    const amp1 = rb.amp1 * ref, amp2 = rb.amp2 * ref;
    const [r, g, b] = rb.color;
    if (!rb._pinches) {
      const n = 2 + Math.floor(Math.random() * 2);
      rb._pinches = Array.from({ length: n }, () => ({
        cx: 0.10 + Math.random() * 0.80,
        str: 0.55 + Math.random() * 0.35,
        w:  0.06 + Math.random() * 0.10,
      }));
    }
    for (let li = 0; li < rb.lines; li++) {
      const frac = li / (rb.lines - 1);
      const bright = Math.pow(1 - Math.abs(frac - 0.5) * 2, 2.0);
      const alpha  = bright * rb.peak;
      if (alpha < 0.006) continue;
      const spd = t * rb.speed;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.lineWidth   = 0.35 + bright * 0.65;
      for (let x = 0; x <= W; x += 3) {
        const nx = x / W;
        let env = 1.0;
        for (const p of rb._pinches) {
          const d = Math.abs(nx - p.cx) / p.w;
          env *= 1 - p.str * Math.exp(-d * d * 3.5);
        }
        const yOff = (frac - 0.5) * rb.spread * H * env;
        const fs   = Math.min(1, W / 900);
        const y = rb.yBase * H + yOff
          + Math.sin(nx * Math.PI * 2 * rb.freq1 * fs + spd + rb.phase1 + li * 0.13) * amp1
          + Math.sin(nx * Math.PI * 2 * rb.freq2 * fs - spd * 0.65 + rb.phase2 + li * 0.065) * amp2;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 1;
    RIBBONS.forEach(rb => drawRibbon(rb));
    animId = requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); draw(); });
  resize(); draw();
})();

// ── Light plexus — Solutions & Contact ──
function createLightPlexus(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, animId, nodes = [], t = 0;
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; build(); }
  function build() {
    nodes = [];
    for (let i = 0; i < 55; i++) {
      const bx = Math.random() * W, by = Math.random() * H;
      nodes.push({ bx, by, amp: 10 + Math.random() * 22, phi: Math.random() * Math.PI * 2, frq: 0.2 + Math.random() * 0.35, x: bx, y: by });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.009;
    nodes.forEach(n => { n.y = n.by + Math.sin(t * n.frq + n.phi) * n.amp; n.x = n.bx + Math.cos(t * n.frq * 0.4 + n.phi) * 7; });
    const maxD = 0.22 * W;
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx*dx+dy*dy);
        if (d > maxD) continue;
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(60,80,120,${(1 - d/maxD) * 0.22})`; ctx.lineWidth = 0.6; ctx.stroke();
      }
    nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, 2.2, 0, Math.PI*2); ctx.fillStyle = 'rgba(60,80,130,0.50)'; ctx.fill(); });
    animId = requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); draw(); });
  resize(); draw();
}
createLightPlexus('solutionsCanvas');
createLightPlexus('contactCanvas');

// ── Dark wave ribbons — Services, Why Us, Products ──
function createWaveCanvas(canvasId, opts) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, animId, t = 0;
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  function drawRibbon(rb) {
    const amp1 = rb.amp1*H, amp2 = rb.amp2*H, spread = rb.spread*H, [r,g,b] = rb.color;
    for (let li = 0; li < rb.lines; li++) {
      const frac = li/(rb.lines-1);
      const bright = Math.pow(1 - Math.abs(frac-0.5)*2, 2.2);
      const alpha = bright * rb.peak;
      if (alpha < 0.008) continue;
      const yOff = (frac-0.5)*spread, lp = li*0.13, spd = t*rb.speed;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 0.4 + bright * 0.45;
      for (let x = 0; x <= W; x += 4) {
        const nx = x/W;
        const y = rb.yBase*H + yOff
          + Math.sin(nx*Math.PI*2*rb.freq1 + spd + rb.phase1 + lp) * amp1
          + Math.sin(nx*Math.PI*2*rb.freq2 - spd*0.65 + rb.phase2 + lp*0.5) * amp2;
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
  }
  function draw() { ctx.clearRect(0,0,W,H); t+=1; opts.ribbons.forEach(rb => drawRibbon(rb)); animId = requestAnimationFrame(draw); }
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); draw(); });
  resize(); draw();
}

createWaveCanvas('servicesCanvas', { ribbons: [
  { yBase:0.40, lines:40, spread:0.28, amp1:0.17, amp2:0.08, freq1:1.7, freq2:2.8, phase1:0,   phase2:1.0, speed:0.005,  color:[50,160,255], peak:0.60 },
  { yBase:0.65, lines:30, spread:0.20, amp1:0.13, amp2:0.06, freq1:2.2, freq2:1.6, phase1:3.0, phase2:2.2, speed:0.004,  color:[40,210,255], peak:0.42 },
]});
createWaveCanvas('whyCanvas', { ribbons: [
  { yBase:0.38, lines:38, spread:0.26, amp1:0.18, amp2:0.08, freq1:1.9, freq2:3.1, phase1:1.0, phase2:0.5, speed:0.0055, color:[30,190,240], peak:0.58 },
  { yBase:0.66, lines:28, spread:0.18, amp1:0.12, amp2:0.06, freq1:2.4, freq2:1.4, phase1:3.5, phase2:2.8, speed:0.004,  color:[60,180,255], peak:0.40 },
]});
createWaveCanvas('productsCanvas', { ribbons: [
  { yBase:0.42, lines:42, spread:0.28, amp1:0.16, amp2:0.07, freq1:1.8, freq2:2.5, phase1:0.5, phase2:1.5, speed:0.0045, color:[80,150,230], peak:0.58 },
  { yBase:0.63, lines:30, spread:0.20, amp1:0.12, amp2:0.06, freq1:2.1, freq2:1.7, phase1:3.2, phase2:2.5, speed:0.0038, color:[50,200,255], peak:0.40 },
]});
