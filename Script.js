/* ============================================================
   SOUMYA SHEKHAR DEB — PORTFOLIO SCRIPT
   ============================================================ */

'use strict';

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1400);
});

/* ---- CUSTOM CURSOR ---- */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function followCursor() {
  fx += (mx - fx) * 0.14;
  fy += (my - fy) * 0.14;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(followCursor);
})();

/* ---- SCROLL PROGRESS ---- */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
});

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

/* ---- MOBILE MENU ---- */
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks   = document.querySelectorAll('.mob-link');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobLinks.forEach(l => l.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ---- BACK TO TOP ---- */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backTop.classList.add('visible');
  else backTop.classList.remove('visible');
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- REVEAL ON SCROLL ---- */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

/* ---- SKILL BARS ---- */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.pct + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(el => skillObserver.observe(el));

/* ---- TYPED TEXT ---- */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Computer Lab Instructor',
  'Economics Graduate',
  'MAEC (Pursuing)',
  'Banking Aspirant',
  'Event Organiser',
  'Tech Enthusiast',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
setTimeout(typeLoop, 1800);

/* ---- PARTICLE CANVAS ---- */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = Math.min(Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 10000), 80);

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  particles = Array.from({ length: COUNT }, mkParticle);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
      ctx.fill();
    });
    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.07 * (1 - dist/90)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- EVENTS ACCORDION ---- */
document.querySelectorAll('.event-card').forEach(card => {
  const desc    = card.querySelector('.event-desc');
  const toggle  = card.querySelector('.event-toggle');
  desc.textContent = card.dataset.desc;

  card.addEventListener('click', () => {
    const isOpen = desc.classList.contains('open');
    // close all
    document.querySelectorAll('.event-desc').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.event-toggle').forEach(t => t.textContent = 'Read More ↓');
    if (!isOpen) {
      desc.classList.add('open');
      toggle.textContent = 'Read Less ↑';
    }
  });
});

/* ---- HOBBY MODAL ---- */
const modal       = document.getElementById('hobbyModal');
const modalClose  = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

const hobbyData = {
  editing: {
    title: 'Editing',
    subtitle: 'Visual Design & Motion Graphics',
    desc: 'From poster design to motion graphics, editing is where creativity meets technology. I craft visuals that tell stories — transforming raw footage into polished, impactful content.',
    buildExtra(el) {
      el.innerHTML = `
        <div class="editing-workspace">
          <div class="timeline-editor">
            <div class="tl-editor-label">🎬 Video Timeline</div>
            <div class="tl-tracks">
              <div class="tl-track">
                <span class="tl-track-name">Video 1</span>
                <div class="tl-track-lane">
                  <div class="tl-clip" style="background:linear-gradient(90deg,#C9A84C,#E8C97A);animation-delay:0s"></div>
                </div>
              </div>
              <div class="tl-track">
                <span class="tl-track-name">Video 2</span>
                <div class="tl-track-lane">
                  <div class="tl-clip" style="background:linear-gradient(90deg,#9A7433,#C9A84C);animation-delay:0.4s"></div>
                </div>
              </div>
              <div class="tl-track">
                <span class="tl-track-name">Audio</span>
                <div class="tl-track-lane">
                  <div class="tl-clip" style="background:linear-gradient(90deg,#4a90d9,#7bb3f0);animation-delay:0.2s"></div>
                </div>
              </div>
              <div class="tl-track">
                <span class="tl-track-name">FX</span>
                <div class="tl-track-lane">
                  <div class="tl-clip" style="background:linear-gradient(90deg,#e74c3c,#f1948a);animation-delay:0.6s"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="tl-editor-label" style="margin-bottom:8px">🎨 Colour Palette</div>
          <div class="color-palette">
            ${['#C9A84C','#E8C97A','#9A7433','#4a90d9','#e74c3c','#2ecc71','#9b59b6','#f39c12']
              .map((c,i)=>`<div class="palette-swatch" style="background:${c};animation-delay:${i*0.07}s"></div>`).join('')}
          </div>
        </div>`;
    }
  },
  webdev: {
    title: 'Web Development',
    subtitle: 'HTML · CSS · JavaScript · Python',
    desc: 'Building interactive experiences from scratch. Every project is a chance to solve a new puzzle and create something that genuinely helps people.',
    buildExtra(el) {
      el.innerHTML = `<canvas id="codeRainCanvas"></canvas>`;
      setTimeout(startCodeRain, 50);
    }
  },
  biking: {
    title: 'Bike Riding',
    subtitle: 'Freedom on Two Wheels',
    desc: 'The open road, the wind, the hum of an engine — biking is my reset button. Every ride clears the mind and fuels the soul.',
    buildExtra(el) {
      el.innerHTML = `
        <div class="bike-scene">
          <div class="speed-line" style="top:30%;animation-delay:0s;width:35%"></div>
          <div class="speed-line" style="top:50%;animation-delay:0.3s;width:25%"></div>
          <div class="speed-line" style="top:70%;animation-delay:0.15s;width:40%"></div>
          <div class="road-line"></div>
          <div class="road-surface"></div>
          <div class="bike-rider">🏍️</div>
        </div>
        <div class="bike-stats">
          <div class="bike-stat"><span class="bike-stat-val">120</span><span class="bike-stat-label">km/h</span></div>
          <div class="bike-stat"><span class="bike-stat-val">∞</span><span class="bike-stat-label">Freedom</span></div>
          <div class="bike-stat"><span class="bike-stat-val">🛣️</span><span class="bike-stat-label">Open Road</span></div>
        </div>`;
    }
  },
  music: {
    title: 'Music',
    subtitle: 'Rhythm & Soul',
    desc: 'Music is always in the background — powering focus, fueling workouts, and setting the mood for every moment.',
    buildExtra(el) {
      const tracks = [
        { name: 'Lo-Fi Beats', artist: 'Chill Vibes', icon: '🎧' },
        { name: 'Hip-Hop Bangers', artist: 'Street Sound', icon: '🔥' },
        { name: 'Rock Anthems', artist: 'Electric Soul', icon: '🎸' },
      ];
      let t = 0;
      const track = tracks[t];
      el.innerHTML = `
        <div class="music-player">
          <div class="music-player-top">
            <div class="music-disc"><div class="music-disc-inner"></div></div>
            <div class="music-track-info">
              <div class="music-track-name" id="mpTrackName">${track.name}</div>
              <div class="music-track-artist" id="mpArtist">${track.artist}</div>
            </div>
            <span style="font-size:1.6rem">${track.icon}</span>
          </div>
          <div class="music-progress-bar"><div class="music-progress-fill"></div></div>
          <div class="music-controls">
            <button class="mc-btn" id="mpPrev">⏮</button>
            <button class="mc-btn play" id="mpPlay">▶</button>
            <button class="mc-btn" id="mpNext">⏭</button>
          </div>
          <div class="equalizer">
            ${Array.from({length:10},()=>`<div class="eq-bar"></div>`).join('')}
          </div>
          <div class="music-notes" id="musicNotes"></div>
        </div>`;
      // floating notes
      const notes = ['♩','♪','♫','♬','🎵','🎶'];
      const notesEl = el.querySelector('#musicNotes');
      let noteInterval = setInterval(() => {
        if (!document.getElementById('hobbyModal').classList.contains('open')) { clearInterval(noteInterval); return; }
        const n = document.createElement('span');
        n.className = 'music-note';
        n.textContent = notes[Math.floor(Math.random()*notes.length)];
        n.style.left = Math.random()*90 + '%';
        n.style.animationDelay = '0s';
        n.style.animationDuration = (1.8+Math.random()*1.2) + 's';
        n.style.color = `hsl(${40+Math.random()*20},80%,${55+Math.random()*20}%)`;
        notesEl.appendChild(n);
        setTimeout(() => n.remove(), 3000);
      }, 350);
      // track switching
      function setTrack(i) {
        const tk = tracks[i];
        el.querySelector('#mpTrackName').textContent = tk.name;
        el.querySelector('#mpArtist').textContent = tk.artist;
      }
      el.querySelector('#mpNext').addEventListener('click', () => { t=(t+1)%tracks.length; setTrack(t); });
      el.querySelector('#mpPrev').addEventListener('click', () => { t=(t-1+tracks.length)%tracks.length; setTrack(t); });
    }
  },
  movies: {
    title: 'Movies',
    subtitle: 'Cinema Enthusiast',
    desc: 'From Marvel\'s universe-spanning epics to Nolan\'s mind-bending narratives — I live for stories that leave you thinking long after the credits roll.',
    buildExtra(el) {
      const films = [
        { icon:'🦾', title:'Avengers: Endgame', year:'2019' },
        { icon:'🌌', title:'Interstellar', year:'2014' },
        { icon:'🕷️', title:'Spider-Man: NWH', year:'2021' },
        { icon:'⚡', title:'Avengers: IW', year:'2018' },
      ];
      el.innerHTML = `
        <div class="cinema-screen">
          <div class="cinema-title">🎬 NOW SHOWING</div>
          <div class="cinema-stars">
            ${Array.from({length:5},(_,i)=>`<span class="cinema-star" style="animation-delay:${i*0.2}s">⭐</span>`).join('')}
          </div>
          <div class="film-strip" id="filmStrip">
            ${films.map(f=>`<div class="film-frame" title="${f.title}">${f.icon}</div>`).join('')}
            ${films.map(f=>`<div class="film-frame">${f.icon}</div>`).join('')}
          </div>
        </div>
        <div class="modal-items" style="margin-top:14px">
          ${films.map((f,i)=>`
            <div class="modal-item" style="animation-delay:${i*0.1}s">
              <div class="mi-icon">${f.icon}</div>
              <div style="font-size:0.8rem;font-weight:600">${f.title}</div>
              <div style="font-size:0.7rem;color:var(--gold)">${f.year}</div>
            </div>`).join('')}
        </div>`;
    }
  },
  anime: {
    title: 'Anime',
    subtitle: 'Japanese Animation',
    desc: 'Anime storytelling blends epic action, deep philosophy, and emotional resonance unlike anything else. These series shaped my perspective on perseverance and ambition.',
    buildExtra(el) {
      const series = [
        { emoji:'🍃', name:'Naruto', tag:'Shinobi · Action', colors:['#f39c12','#e67e22'], delay:0 },
        { emoji:'⚓', name:'One Piece', tag:'Adventure · Epic', colors:['#e74c3c','#c0392b'], delay:0.1 },
        { emoji:'⚔️', name:'Bleach', tag:'Shinigami · Dark', colors:['#2c3e50','#4a90d9'], delay:0.2 },
        { emoji:'🔮', name:'Dragon Ball', tag:'Power · Legacy', colors:['#f39c12','#f1c40f'], delay:0.3 },
      ];
      el.innerHTML = `
        <div class="anime-grid">
          ${series.map(s=>`
            <div class="anime-card" style="animation-delay:${s.delay}s;border-color:${s.colors[0]}33">
              <span class="anime-emoji">${s.emoji}</span>
              <div class="anime-name">${s.name}</div>
              <div class="anime-tag">${s.tag}</div>
              <div class="anime-chakra">
                ${Array.from({length:5},(_,i)=>`
                  <div class="chakra-dot" style="background:${s.colors[i%2]};animation-delay:${i*0.15}s"></div>`).join('')}
              </div>
            </div>`).join('')}
        </div>`;
    }
  },
  gaming: {
    title: 'Gaming',
    subtitle: 'Mobile Battle Royale & Strategy',
    desc: 'Gaming sharpens reflexes, strategy, and teamwork. Whether dropping into a battle royale or building a base, I\'m always up for a match.',
    buildExtra(el) {
      const games = [
        { logo:'🔫', name:'BGMI', genre:'Battle Royale', status:'Active', delay:0 },
        { logo:'🪂', name:'PUBG Mobile', genre:'Battle Royale', status:'Active', delay:0.1 },
        { logo:'🏰', name:'Clash of Clans', genre:'Strategy', status:'Builder', delay:0.2 },
        { logo:'🔥', name:'Free Fire', genre:'Battle Royale', status:'Active', delay:0.3 },
      ];
      el.innerHTML = `
        <div class="gaming-arena">
          ${games.map(g=>`
            <div class="game-card" style="animation-delay:${g.delay}s">
              <span class="game-logo">${g.logo}</span>
              <div class="game-info">
                <div class="game-name">${g.name}</div>
                <div class="game-genre">${g.genre}</div>
              </div>
              <span class="game-status">${g.status}</span>
            </div>`).join('')}
          <div class="game-hp-bar"><div class="game-hp-fill"></div></div>
        </div>`;
    }
  },
  gym: {
    title: 'Gym',
    subtitle: 'Strength & Fitness',
    desc: 'The gym is where discipline is built. Consistent training teaches patience, resilience, and the value of showing up — lessons that transfer to every area of life.',
    buildExtra(el) {
      const lifts = [
        { label:'Bench Press', pct:'75%', delay:'0s' },
        { label:'Deadlift',    pct:'80%', delay:'0.15s' },
        { label:'Squats',      pct:'70%', delay:'0.3s' },
        { label:'Consistency', pct:'95%', delay:'0.45s' },
      ];
      el.innerHTML = `
        <div class="gym-stats">
          <div class="gym-stat" style="animation-delay:0s"><span class="gym-stat-icon">🏋️</span><span class="gym-stat-val">2+</span><span class="gym-stat-label">Years</span></div>
          <div class="gym-stat" style="animation-delay:0.1s"><span class="gym-stat-icon">💪</span><span class="gym-stat-val">5×</span><span class="gym-stat-label">Per Week</span></div>
          <div class="gym-stat" style="animation-delay:0.2s"><span class="gym-stat-icon">🔥</span><span class="gym-stat-val">100%</span><span class="gym-stat-label">Dedication</span></div>
        </div>
        <div class="gym-progress-list" style="margin-top:16px">
          ${lifts.map(l=>`
            <div class="gym-prog-item">
              <div class="gym-prog-label"><span>${l.label}</span><span>${l.pct}</span></div>
              <div class="gym-track">
                <div class="gym-fill" style="width:${l.pct};animation-delay:${l.delay}"></div>
              </div>
            </div>`).join('')}
        </div>`;
    }
  },
};

document.querySelectorAll('.hobby-card').forEach(card => {
  card.addEventListener('click', () => {
    const key  = card.dataset.hobby;
    const data = hobbyData[key];
    if (!data) return;

    modalContent.innerHTML = `
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-subtitle">${data.subtitle}</p>
      <p class="modal-desc">${data.desc}</p>
      <div id="hobbyExtra"></div>
    `;

    if (data.buildExtra) {
      data.buildExtra(document.getElementById('hobbyExtra'));
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  codeRainRunning = false;
  modalContent.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* Code rain effect */
let codeRainRunning = false;
function startCodeRain() {
  const canvas = document.getElementById('codeRainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight || 140;

  const cols = Math.floor(canvas.width / 14);
  const drops = Array(cols).fill(0);
  const chars = 'HTMLCSSPYTHONJAVASCRIPTWEBDEV01'.split('');
  codeRainRunning = true;

  function draw() {
    if (!codeRainRunning) return;
    ctx.fillStyle = 'rgba(13,13,13,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '11px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      ctx.fillStyle = `rgba(201,168,76,${Math.random() * 0.7 + 0.3})`;
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y * 14);
      if (y * 14 > canvas.height && Math.random() > 0.97) drops[i] = 0;
      else drops[i]++;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ---- CONTACT FORM ---- */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = '✓ Message received! I\'ll be in touch soon.';
  this.reset();
  setTimeout(() => note.textContent = '', 5000);
});

/* ---- SMOOTH ANCHOR SCROLLING ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
