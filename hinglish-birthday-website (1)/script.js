/* ============================================================
   TANU HR PRIVATE LIMITED — Birthday Surprise Website
   Vanilla JS only. All personal details & jokes live in CONFIG.
   ============================================================ */
'use strict';

/* ================= CONFIG ================= */
const CONFIG = {
  name: 'Yogita',
  nickname: 'Tanu',
  birthdayDay: 8,
  birthdayMonth: 10,            // 0-based => 10 = November
  profession: 'HR',
  favouriteColour: 'Pink',
  loves: 'Flowers',
  from: 'Jeel',
  companyName: 'TANU HR PRIVATE LIMITED',

  // Salary-audit deductions (fictional joke only — total is auto-calculated)
  deductions: [
    { label: 'Friendship Maintenance',    amount: 500 },
    { label: 'Jeel Commission',           amount: 1000 },
    { label: 'Random Treat Fund',         amount: 300 },
    { label: 'Birthday Party Tax',        amount: 500 },
    { label: 'Emergency Friendship Fund', amount: 200 },
  ],
  hiddenCharges: [
    { label: 'Chai Tax',                      amount: 0, note: 'Still Pending' },
    { label: 'Pizza Surcharge',               amount: 0, note: 'Tanu ne abhi tak nahi khilaya' },
    { label: 'GST (Gossip & Sarcasm Tax)',    amount: 0, note: 'Exempted, madam ka mood accha hai' },
    { label: 'Emotional Support Fee',         amount: '∞', note: 'Jeel ne waive kar diya, dost hai na 🥹😂' },
  ],

  loaderMessages: [
    'Tanu HR Portal load ho raha hai...',
    'Madam ka overthinking module start ho raha hai... 🌀',
    'Jeel ki salary-hissa application dhoondh rahe hain... 🔍',
    'Social battery check: 2% 🔋',
  ],

  appealLines: [
    'Appeal #2 filed ⚖️',
    'Appeal #3 filed. Jeel ke paas vakeel hai ⚖️',
    'Jeel ne dharna shuru kar diya 🪧',
  ],

  stickyNotes: [
    'Meri Inglish ko littel ignore karna , thodi kamzor hai. 💭',
    'Jo bhi hota hai,achhe ke liye hota hai. Take a chill pill dude😌',
    'Trust issue nahi, security verification chal raha hai. 🔐',
    'Company ke problems Company tak hi rakho 🏢',
    'Muje Roz bahar ka khane ka man karta hai to khila diya karo. 🍕🍔🍟',
    'Problems aati jati rahegi , bakchodi nahi rukni chahiye ladle 👀',
  ],

  // The birthday message — typed out exactly line by line
  birthdayMessage: [
    'Happy Birthday, Tanu! ❤️',
    'Pata hai, tu life mein bahut kuch manage karti hai. Kabhi responsibilities, kabhi unnecessary overthinking aur kabhi doosron ki problems.',
    'Jo tare liye sahi hoga wo tuje zaroor milega. Bas apni life ke liye thoda time nikalna seekh.',
    'Har cheez ke baare mein itna mat socha kar. Thoda relax bhi kiya kar.',
    'Aur haan, har kisi par trust karna zaroori nahi, lekin achhe logon ko apni life mein aane ka chance zaroor dena.',
    'Bas hamesha khush reh, healthy reh aur apni tarah reh.',
    'Aur ek important baat:',
    'Teri life mein problems pehle se bahut hain, isliye main ek extra problem banke hamesha available hoon. 😂',
    'Happy Birthday, Yogita!',
    '— Jeel',
    '( best temporary person you ever met)'
  ],

  tearTapsRequired: 5,
  dodgeAttempts: 2,
};

/* ================= HELPERS ================= */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CAN_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const fmtINR = n => '₹' + Number(n).toLocaleString('en-IN');
const TOTAL_DEDUCTION = CONFIG.deductions.reduce((s, d) => s + d.amount, 0);

let paused = false;
document.addEventListener('visibilitychange', () => {
  paused = document.hidden;
  document.body.classList.toggle('paused', paused);
});

function shake(el) {
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth;           // restart animation
  el.classList.add('shake');
}

/* ============================================================
   CANVAS LAYERS — petals background + confetti/fx overlay
   ============================================================ */
const petalCanvas = $('#petalCanvas');
const pctx = petalCanvas.getContext('2d');
const fxCanvas = $('#fxCanvas');
const fctx = fxCanvas.getContext('2d');
const DPR = Math.min(window.devicePixelRatio || 1, 2);
let VW = 0, VH = 0;

function resizeCanvases() {
  VW = window.innerWidth; VH = window.innerHeight;
  for (const [c, ctx] of [[petalCanvas, pctx], [fxCanvas, fctx]]) {
    c.width = VW * DPR; c.height = VH * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
}
window.addEventListener('resize', () => { resizeCanvases(); seedPetals(); });
resizeCanvases();

/* ---- falling pink petals (background) ---- */
const PETAL_COLORS = ['#FF8FB8', '#F45B93', '#FFB3D1', '#E9DFFF', '#FFD3E5', '#FF9FC6'];
let petals = [];
function petalCount() {
  if (REDUCED) return 8;
  return VW < 640 ? 18 : 30;
}
function seedPetals() {
  const n = petalCount();
  petals = Array.from({ length: n }, () => ({
    x: Math.random() * VW,
    y: Math.random() * VH,
    r: 5 + Math.random() * 7,
    vy: 0.6 + Math.random() * 1.1,
    sway: 0.6 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.03,
    color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
    alpha: 0.55 + Math.random() * 0.4,
  }));
}
seedPetals();

function drawPetal(ctx, x, y, r, rot, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.55, r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = alpha * 0.5;
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.35, r * 0.3, r * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function stepPetals(t) {
  pctx.clearRect(0, 0, VW, VH);
  for (const p of petals) {
    p.y += p.vy;
    p.x += Math.sin(t / 900 * p.sway + p.phase) * 0.7;
    p.rot += p.vr;
    if (p.y > VH + 20) { p.y = -20; p.x = Math.random() * VW; }
    if (p.x > VW + 20) p.x = -20; else if (p.x < -20) p.x = VW + 20;
    drawPetal(pctx, p.x, p.y, p.r, p.rot, p.color, p.alpha);
  }
}

/* ---- confetti / petal bursts (fx overlay, max 150 pieces) ---- */
const FX_COLORS = ['#FF8FB8', '#F45B93', '#E9DFFF', '#FFF9F5', '#FFD3E5', '#A83D69', '#FFE08A'];
let fx = [];
const FX_MAX = 150;

function spawnBurst(x, y, count, opts = {}) {
  const shape = opts.shape || 'rect';
  const spread = opts.spread ?? Math.PI * 2;
  const baseAng = opts.up ? -Math.PI / 2 : 0;
  const speed = opts.speed ?? 7;
  for (let i = 0; i < count; i++) {
    if (fx.length >= FX_MAX) fx.shift();          // cap & auto-cleanup
    const a = baseAng + (Math.random() - 0.5) * spread;
    const v = speed * (0.4 + Math.random() * 0.8);
    fx.push({
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - (opts.up ? 3 : 0),
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      w: shape === 'petal' ? 6 + Math.random() * 6 : 5 + Math.random() * 6,
      h: shape === 'petal' ? 9 + Math.random() * 8 : 4 + Math.random() * 5,
      color: FX_COLORS[(Math.random() * FX_COLORS.length) | 0],
      shape,
      life: 1,
      decay: 0.006 + Math.random() * 0.008,
    });
  }
}
function burstConfetti(x, y, count = 110) { spawnBurst(x, y, count, { up: true, speed: 8 }); }
function burstPetals(x, y, count = 30) { spawnBurst(x, y, count, { up: true, speed: 5, shape: 'petal' }); }

function stepFx() {
  fctx.clearRect(0, 0, VW, VH);
  fx = fx.filter(p => p.life > 0 && p.y < VH + 40);
  for (const p of fx) {
    p.vy += 0.22;                 // gravity
    p.vx *= 0.99;
    p.x += p.vx; p.y += p.vy;
    p.rot += p.vr;
    p.life -= p.decay;
    fctx.save();
    fctx.translate(p.x, p.y);
    fctx.rotate(p.rot);
    fctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
    fctx.fillStyle = p.color;
    if (p.shape === 'petal') {
      fctx.beginPath();
      fctx.ellipse(0, 0, p.w * 0.55, p.w, 0, 0, Math.PI * 2);
      fctx.fill();
    } else {
      fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    fctx.restore();
  }
}

/* ---- butterflies on curved paths ---- */
const BUTTERFLY_SVG =
  '<svg viewBox="0 0 60 40" width="52" height="36">' +
  '<g class="wing wing-l"><path d="M30 20 C10 2, 2 10, 9 22 C2 31, 15 39, 30 25 Z"/></g>' +
  '<g class="wing wing-r"><path d="M30 20 C50 2, 58 10, 51 22 C58 31, 45 39, 30 25 Z"/></g>' +
  '<rect class="bbody" x="28.4" y="12" width="3.2" height="17" rx="1.6"/></svg>';

let butterflies = [];
function initButterflies() {
  const holder = $('#butterflies');
  const defs = [
    { bf: '#FF8FB8', bf2: '#F45B93' },
    { bf: '#E9DFFF', bf2: '#C9A9F5' },
    { bf: '#FFB3D1', bf2: '#FF8FB8' },
  ];
  butterflies = defs.map((d, i) => {
    const el = document.createElement('div');
    el.className = 'butterfly';
    el.style.setProperty('--bf', d.bf);
    el.style.setProperty('--bf2', d.bf2);
    el.innerHTML = BUTTERFLY_SVG;
    holder.appendChild(el);
    return {
      el,
      cx: VW * (0.2 + Math.random() * 0.6),
      cy: VH * (0.15 + Math.random() * 0.55),
      rx: 90 + Math.random() * 160,
      ry: 60 + Math.random() * 110,
      sp: 0.25 + Math.random() * 0.3,
      ph: Math.random() * Math.PI * 2,
      ph2: Math.random() * Math.PI * 2,
      px: 0, py: 0,
    };
  });
}
initButterflies();

function stepButterflies(t) {
  const s = t / 1000;
  for (const b of butterflies) {
    const cx = Math.min(Math.max(b.cx, 60), Math.max(VW - 120, 60));
    const cy = Math.min(Math.max(b.cy, 50), Math.max(VH - 80, 50));
    const x = cx + Math.min(b.rx, VW * 0.32) * Math.cos(s * b.sp + b.ph);
    const y = cy + Math.min(b.ry, VH * 0.3) * Math.sin(s * b.sp * 1.31 + b.ph2);
    const ang = Math.atan2(y - b.py, x - b.px) * 180 / Math.PI + 90;
    b.px = x; b.py = y;
    b.el.style.transform = `translate(${x - 26}px, ${y - 18}px) rotate(${ang}deg) scale(${b.rx > 200 ? 1.15 : 0.9})`;
  }
}
if (REDUCED) { // static, gentle placement
  butterflies.forEach(b => { b.el.style.transform = `translate(${b.cx}px, ${b.cy}px)`; });
}

/* ---- ambient sparkles ---- */
function initSparkles() {
  const holder = $('#sparkles');
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    const size = 5 + Math.random() * 9;
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;` +
      `width:${size}px;height:${size}px;--td:${2.2 + Math.random() * 3}s;--tdel:${Math.random() * 4}s;`;
    holder.appendChild(s);
  }
}
initSparkles();

function sparkleBurst(x, y, count = 14) {
  const glyphs = ['✦', '✧', '❀', '🌸', '✨'];
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'spark-burst';
    s.textContent = glyphs[(Math.random() * glyphs.length) | 0];
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 110;
    s.style.cssText = `left:${x}px;top:${y}px;color:${FX_COLORS[(Math.random() * FX_COLORS.length) | 0]};` +
      `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 40}px;font-size:${10 + Math.random() * 12}px;`;
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

/* ---- master rAF loop (pauses when tab hidden) ---- */
let lastT = performance.now();
function loop(now) {
  if (!paused && !document.hidden) {
    stepPetals(now);
    if (!REDUCED) stepButterflies(now);
    stepFx();
  }
  lastT = now;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ============================================================
   0. FUNNY LOADER
   ============================================================ */
(function loader() {
  const el = $('#loader'), fill = $('#loaderFill'), msg = $('#loaderMsg');
  let mi = 0;
  const timer = setInterval(() => {
    mi = (mi + 1) % CONFIG.loaderMessages.length;
    msg.textContent = CONFIG.loaderMessages[mi];
  }, 480);
  requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = '100%'; }));
  setTimeout(() => {
    clearInterval(timer);
    el.classList.add('done');
    document.body.classList.remove('loading');
    setTimeout(() => { el.style.display = 'none'; }, 700);
  }, REDUCED ? 700 : 2000);
})();

/* ============================================================
   1. SECTION — HR NOTICE: countdown, tilt, stamp
   ============================================================ */
function updateCountdown() {
  const chip = $('#countdownChip');
  const now = new Date();
  const bday = new Date(now.getFullYear(), CONFIG.birthdayMonth, CONFIG.birthdayDay);
  const sameDay = now.getMonth() === CONFIG.birthdayMonth && now.getDate() === CONFIG.birthdayDay;
  if (sameDay) {
    chip.textContent = '🎉 Aaj hai woh din! Happy Birthday madam! 🎂';
    chip.classList.add('today');
  } else if (now < bday) {
    const days = Math.ceil((bday - now) / 86400000);
    chip.textContent = `⏳ ${days} din baaki hain madam ke birthday mein (treat ki taiyaari shuru karo) 🎂`;
  } else {
    chip.textContent = '😌 Birthday week extended by HR policy';
  }
}
updateCountdown();

/* ID card tilt (mouse); simple touch alternative = tap wiggle */
(function idTilt() {
  const card = $('#idCard');
  if (CAN_HOVER && !REDUCED) {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 13}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  } else {
    card.addEventListener('touchstart', () => shake(card), { passive: true });
  }
})();

/* APPROVED stamp + bursts + scroll */
$('#openNoticeBtn').addEventListener('click', function () {
  const stamp = $('#approvedStamp');
  stamp.classList.remove('slam');
  void stamp.offsetWidth;
  stamp.classList.add('slam');
  const r = this.getBoundingClientRect();
  burstConfetti(r.left + r.width / 2, r.top + r.height / 2, 120);
  burstPetals(r.left + r.width / 2, r.top + r.height / 2, 34);
  setTimeout(() => {
    $('#sec-audit').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  }, REDUCED ? 150 : 700);
});

/* ============================================================
   SCROLL REVEALS (IntersectionObserver)
   ============================================================ */
const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('in');
    io.unobserve(e.target);
    if (e.target.id === 'slipCard') startSlipCount();
    if (e.target.id === 'statGrid') startReport();
    if (e.target.id === 'stickyNotes') { /* handled by .in class */ }
    if (e.target.id === 'stepper') { /* handled by .in class */ }
    if (e.target.id === 'fakeNotif') startFakeNotif();
    if (e.target.id === 'sec-message') startTypewriter();
  }
}, { threshold: 0.12 });
$$('.reveal').forEach(el => io.observe(el));
io.observe($('#slipCard'));
io.observe($('#statGrid'));
io.observe($('#stickyNotes'));
io.observe($('#stepper'));
io.observe($('#fakeNotif'));
io.observe($('#sec-message'));

// stagger the status stepper steps
$$('#stepper .st').forEach((el, i) => el.style.setProperty('--d', (i * 0.35) + 's'));

/* ============================================================
   2. SECTION — SALARY AUDIT
   ============================================================ */
/* a) fake notification glitch */
function startFakeNotif() {
  const n = $('#fakeNotif');
  n.classList.add('show');
  setTimeout(() => {
    n.classList.add('glitch');
    $('#notifText1').hidden = true;
    $('#notifText2').hidden = false;
  }, REDUCED ? 300 : 1100);
}

/* c) salary slip — build rows from CONFIG, count up on view */
(function buildSlip() {
  const rows = $('#deductionRows');
  CONFIG.deductions.forEach((d, i) => {
    const div = document.createElement('div');
    div.className = 'ded-row';
    div.style.setProperty('--d', (0.35 + i * 0.3) + 's');
    div.innerHTML = `<span>${d.label}</span><span class="amt" data-amt="${d.amount}">₹0</span>`;
    rows.appendChild(div);
  });
  const hidden = $('#hiddenRows');
  CONFIG.hiddenCharges.forEach((h, i) => {
    const div = document.createElement('div');
    div.className = 'hidden-row';
    div.style.setProperty('--d', (i * 0.22) + 's');
    const amt = typeof h.amount === 'number' ? fmtINR(h.amount) : h.amount;
    div.innerHTML = `<span>${h.label}<span class="note">${h.note}</span></span><span class="amt">${amt}</span>`;
    hidden.appendChild(div);
  });
})();

function countUp(el, to, suffix = '', dur = 1100, fmt = n => String(n)) {
  if (REDUCED) { el.textContent = fmt(to) + suffix; return; }
  const t0 = performance.now();
  (function frame(t) {
    const p = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(to * eased)) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  })(t0);
}

let slipCounted = false;
function startSlipCount() {
  if (slipCounted) return;
  slipCounted = true;
  $$('#deductionRows .amt').forEach((el, i) => {
    setTimeout(() => countUp(el, +el.dataset.amt, '', 1100, fmtINR), REDUCED ? 0 : 400 + i * 300);
  });
  setTimeout(() => countUp($('#totalAmount'), TOTAL_DEDUCTION, '', 1300, fmtINR),
    REDUCED ? 0 : 400 + CONFIG.deductions.length * 300);
}

/* hidden charges toggle */
$('#hiddenBtn').addEventListener('click', function () {
  const box = $('#hiddenRows');
  const open = box.hidden;
  box.hidden = !open;
  if (open) {
    $('#slipCard').classList.add('in'); // ensure rows animate
    this.textContent = 'Hide Hidden Charges 🙈';
  } else {
    this.textContent = 'View Hidden Charges 🔍';
  }
});

/* g) tear easter egg — 5 taps on the slip */
(function tearEgg() {
  const slip = $('#slipCard');
  let taps = 0;
  slip.addEventListener('click', e => {
    if (e.target.closest('button')) return;   // don't count button taps
    taps++;
    if (taps < CONFIG.tearTapsRequired) { shake(slip); return; }
    if (!slip.classList.contains('torn')) {
      slip.classList.add('torn');
      $('#tearMsg').classList.add('show');
      burstPetals(VW / 2, VH / 2, 20);
    }
  });
})();

/* f) approve / reject buttons + dodge gag */
let modalToken = 0;
$('#approveBtn').addEventListener('click', () => {
  const token = ++modalToken;
  openModal('🎉 Application Approved',
    '<p>Congratulations! Your application for salary commission has been <b>approved</b>.</p>');
  setTimeout(() => {
    if (!isModalOpen() || token !== modalToken) return;
    $('#modalBody').innerHTML =
      '<p>Payment status: <b>Pending since friendship began.</b> 😂</p>';
    burstConfetti(VW / 2, VH / 3, 110);
  }, REDUCED ? 250 : 1500);
});

(function rejectGag() {
  const btn = $('#rejectBtn'), wrap = $('#rejectWrap'), line = $('#appealLine');
  let dodges = 0, appealIdx = 0;

  // Desktop only: button dodges the cursor twice
  if (CAN_HOVER && !REDUCED) {
    wrap.addEventListener('mousemove', e => {
      if (dodges >= CONFIG.dodgeAttempts) return;
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d < 90 && d > 0.01) {
        dodges++;
        btn.style.transform = `translate(${(dx / d) * 100}px, ${(dy / d) * 100}px)`;
        btn.classList.add('dodging');
        setTimeout(() => btn.classList.remove('dodging'), 250);
      }
    });
    wrap.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  }

  btn.addEventListener('click', () => {
    shake(btn);                                  // touch devices: just shakes too
    openModal('🚫 Error 403',
      '<p>Rejection not allowed. Jeel has already filed an appeal.</p>');
    if (appealIdx < CONFIG.appealLines.length) {
      line.textContent = CONFIG.appealLines[appealIdx++];
      line.classList.remove('show'); void line.offsetWidth; line.classList.add('show');
    } else {
      line.textContent = 'Jeel ab bhi appeal kar raha hai... 😂';
      line.classList.add('show');
    }
  });
})();

/* ============================================================
   3. SECTION — PERFORMANCE REPORT
   ============================================================ */
(function buildNotes() {
  const holder = $('#stickyNotes');
  CONFIG.stickyNotes.forEach((txt, i) => {
    const n = document.createElement('div');
    n.className = 'note';
    n.style.setProperty('--d', (i * 0.14) + 's');
    n.style.setProperty('--rot', (i % 2 === 0 ? -1.6 : 1.8) + 'deg');
    n.textContent = '• ' + txt;
    holder.appendChild(n);
  });
})();

let reportStarted = false;
function startReport() {
  if (reportStarted) return;
  reportStarted = true;

  // Overthinking counter -> 999+
  countUp($('#statThinking'), 999, '+', 1800);

  // Thought bubbles pop up
  const thoughts = $('#thoughts');
  const glyphs = ['💭', '🌀', '🤔', '💭', '😵‍💫', '💭'];
  if (!REDUCED) {
    for (let i = 0; i < 7; i++) {
      const t = document.createElement('span');
      t.className = 'thought';
      t.textContent = glyphs[i % glyphs.length];
      t.style.left = (8 + Math.random() * 84) + '%';
      t.style.animationDelay = (0.3 + i * 0.35) + 's';
      thoughts.appendChild(t);
      t.addEventListener('animationend', () => t.remove());
    }
  }

  // Trust bar: fills but stays "Verifying..."
  const tf = $('#trustFill');
  requestAnimationFrame(() => tf.classList.add('go'));

  // Battery: 2% and blinking pink
  const bf = $('#batteryFill');
  requestAnimationFrame(() => {
    bf.classList.add('go');
    setTimeout(() => {
      bf.classList.add('blink');
      countUp($('#batteryLabel'), 2, '%', 900);
    }, REDUCED ? 0 : 1300);
  });

  // Problem management bars
  requestAnimationFrame(() => {
    $('#barEmp').classList.add('go');
    $('#barLife').classList.add('go');
  });
}

/* ============================================================
   4. SECTION — OFFICIAL FRIENDSHIP COMPLAINT
   ============================================================ */
(function complaintForm() {
  $('#caseNo').textContent = `TANU-HR-${new Date().getFullYear()}-0811-JEEL`;

  const chkHissa = $('#chkHissa'), bonus = $('#bonusLabel');
  chkHissa.addEventListener('change', () => { bonus.hidden = !chkHissa.checked; });

  const form = $('#complaintForm'), err = $('#formError'),
        btn = $('#submitComplaint'), result = $('#formResult'),
        l1 = $('#resultLine1'), l2 = $('#resultLine2'), stamp = $('#closedStamp');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const any = $$('.complaint-check:checked', form).length > 0;
    if (!any) {
      err.hidden = false;
      shake(form);
      return;
    }
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Processing... ⏳';
    result.hidden = false;
    l1.hidden = false; l1.textContent = 'Processing...';
    l2.hidden = true;
    stamp.classList.remove('slam');

    setTimeout(() => {
      l1.textContent = 'Your complaint has been received. ✅';
      setTimeout(() => {
        l2.hidden = false;
        stamp.classList.add('slam');
        const r = stamp.getBoundingClientRect();
        burstConfetti(r.left + r.width / 2, r.top + r.height / 2, 60);
        btn.disabled = false;
        btn.textContent = 'Submit Complaint 📮';
      }, REDUCED ? 150 : 1100);
    }, REDUCED ? 200 : 1200);
  });
})();

/* ============================================================
   5. SECTION — TYPEWRITER BIRTHDAY MESSAGE + FINALE
   ============================================================ */
let typeStarted = false, typeFinished = false;
function startTypewriter() {
  if (typeStarted) return;
  typeStarted = true;
  const out = $('#typeOut');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  const lines = CONFIG.birthdayMessage;
  let buffer = '', li = 0, ci = 0;

  function finish() {
    if (typeFinished) return;
    typeFinished = true;
    buffer = lines.join('\n');
    out.textContent = buffer;
    out.appendChild(cursor);
    setTimeout(finale, REDUCED ? 300 : 900);
  }

  function step() {
    if (typeFinished) return;
    if (li >= lines.length) { finish(); return; }
    const line = lines[li];
    if (ci < line.length) {
      buffer += line[ci++];
      out.textContent = buffer;
      out.appendChild(cursor);
      const ch = line[ci - 1];
      let d = 16 + Math.random() * 30;
      if (ch === ' ' || ch === ',') d *= 0.5;
      setTimeout(step, REDUCED ? 4 : d);
    } else {
      buffer += '\n';
      li++; ci = 0;
      const trimmed = line.trim();
      const longPause = /[.!?❤️]$/.test(trimmed);
      setTimeout(step, REDUCED ? 40 : (longPause ? 700 : 260));
    }
  }
  step();

  // Skip button OR tap the message itself -> complete instantly
  const skip = () => { if (!typeFinished) finish(); };
  $('#skipType').addEventListener('click', skip);
  $('#typeBox').addEventListener('click', e => { if (e.target.id !== 'skipType') skip(); });
}

let finaleDone = false;
function finale() {
  if (finaleDone) return;
  finaleDone = true;
  const closing = $('#closingLine');
  closing.classList.add('show');
  // flower bloom + confetti + sparkles
  const bq = $('#bouquet');
  bq.classList.add('bloom');
  const r = bq.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  burstConfetti(cx, cy, 130);
  burstPetals(cx, cy, 40);
  sparkleBurst(cx, cy, 16);
  setTimeout(() => {
    const ps = $('#psLine');
    ps.hidden = false;
    requestAnimationFrame(() => ps.classList.add('show'));
  }, REDUCED ? 400 : 1600);
}

$('#replayBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'auto' });
  setTimeout(() => window.location.reload(), REDUCED ? 0 : 350);
});

/* ============================================================
   MODAL — spring popup with focus trap, Esc, backdrop close
   ============================================================ */
const overlay = $('#modalOverlay');
let lastFocus = null;

function isModalOpen() { return !overlay.hidden; }

function openModal(title, html) {
  lastFocus = document.activeElement;
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = html;
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('open'));
  $('#modalClose').focus();
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.classList.remove('open');
  setTimeout(() => {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }, 220);
}
$('#modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (!isModalOpen()) return;
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key === 'Tab') {                       // focus trap
    const focusables = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', overlay)
      .filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }
});

/* ============================================================
   TOAST (small helper for misc messages)
   ============================================================ */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
