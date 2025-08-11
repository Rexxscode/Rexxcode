function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}

// Highlight navbar aktif saat scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.onscroll = () => {
  let current = "";
  sections.forEach((sec) => {
    const sectionTop = sec.offsetTop;
    if (pageYOffset >= sectionTop - 70) {
      current = sec.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
};

// Smooth scroll untuk semua link internal (tambahan safety)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth"
      });
    }

    // close hamburger on mobile
    document.getElementById("navLinks").classList.remove("show");
  });
});

// TypedJS
var typed = new Typed('#typed', {
  strings: [
    'Fullstack Developer', 
    'UI/UX Designer',
    'AI Enthusiast', 
    'Open Source Contributor',
    'Mobile App Developer',
    'Game Programmer',
    'Cyber Security Learner',
    'Problem Solver',
    'Cloud Enthusiast',
    'Tech Visionary'
  ],
  typeSpeed: 60,
  backSpeed: 30,
  loop: true
});

// Scroll Reveal
ScrollReveal({
  reset: true,
  distance: '60px',
  duration: 1200,
  delay: 200
});

ScrollReveal().reveal('#reveal-left', { origin: 'left' });
ScrollReveal().reveal('#reveal-right', { origin: 'right' });

// AOS Initialization
AOS.init({
  duration: 1000,
  once: true
});

/* ------------------ PARTICLES WITH LINES ------------------ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function initParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particlesArray = [];
  const count = Math.floor((canvas.width * canvas.height) / 90000);
  for (let i = 0; i < Math.max(40, count); i++) {
    particlesArray.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5
    });
  }
}
function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = 'rgba(0,245,255,0.1)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,245,255,0.6)';
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
window.addEventListener('resize', initParticles);
initParticles();
animateParticles();

/* ------------------ PROGRESS BARS ------------------ */
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
  const span = card.querySelector('.progress-bar span');
  const skill = card.getAttribute('data-skill');
  const c1 = card.getAttribute('data-color1');
  const c2 = card.getAttribute('data-color2');
  span.style.background = `linear-gradient(90deg, ${c1}, ${c2})`;

  // Add percentage text
  const pct = document.createElement('div');
  pct.classList.add('pct');
  pct.textContent = skill + '%';
  card.querySelector('.progress-bar').appendChild(pct);
});

/* IntersectionObserver Animation */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const span = card.querySelector('.progress-bar span');
      const skill = card.getAttribute('data-skill');
      const bar = card.querySelector('.progress-bar');
      span.style.width = skill + '%';
      span.style.backgroundPosition = "100% 50%";
      bar.classList.add('show');
      observer.unobserve(card);
    }
  });
}, { threshold: 0.3 });

skillCards.forEach(card => observer.observe(card));

/** particles.js
 * Lightweight particle network with mouse interaction and pause-on-blur
 * Usage: include this file after your DOM elements (or wrap in DOMContentLoaded)
 */

(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Configurable params
  const CONFIG = {
    baseCount: 60,          // target particle count for 1366x768 reference
    connectDistance: 120,   // max distance to draw connecting line
    maxSize: 2.2,
    minSize: 0.8,
    speedRange: 0.6,
    color: { r: 0, g: 245, b: 255 }, // particle color (neon cyan)
    lineAlpha: 0.10,        // line opacity
    particleAlpha: 0.7,
    mouseRadius: 120,       // influence radius from mouse
    repel: true             // repel when mouse moves near particles
  };

  let particles = [];
  let width = 0;
  let height = 0;
  let devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);

  // mouse state
  const mouse = { x: null, y: null, vx: 0, vy: 0, lastX: null, lastY: null, active: false };

  // Pause animation when not visible to save CPU
  let isRunning = true;
  document.addEventListener('visibilitychange', () => {
    isRunning = document.visibilityState === 'visible';
    if (isRunning) loop();
  });

  function resize() {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    // adaptive count: scale with area
    const area = width * height;
    const refArea = 1366 * 768;
    const count = Math.round(CONFIG.baseCount * Math.max(0.5, Math.min(2.2, area / refArea)));

    // recreate particles conservatively if count changes a lot
    if (particles.length === 0) {
      for (let i = 0; i < count; i++) particles.push(createParticle());
    } else if (particles.length < count) {
      for (let i = particles.length; i < count; i++) particles.push(createParticle());
    } else if (particles.length > count * 1.4) {
      particles = particles.slice(0, count);
    }
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: rand(CONFIG.minSize, CONFIG.maxSize),
      vx: (Math.random() - 0.5) * CONFIG.speedRange,
      vy: (Math.random() - 0.5) * CONFIG.speedRange,
      alpha: rand(0.4, CONFIG.particleAlpha)
    };
  }

  function clear() {
    // subtle darkening background so particles glow nicely
    ctx.clearRect(0, 0, width, height);
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${CONFIG.color.r}, ${CONFIG.color.g}, ${CONFIG.color.b}, ${p.alpha})`;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawLine(p1, p2, dist) {
    const alpha = Math.max(0, CONFIG.lineAlpha * (1 - dist / CONFIG.connectDistance));
    ctx.strokeStyle = `rgba(${CONFIG.color.r}, ${CONFIG.color.g}, ${CONFIG.color.b}, ${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // update physics + interactions
  function update() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // apply velocity
      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges (smooth)
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // mouse interaction
      if (mouse.active && mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.mouseRadius) {
          const force = (1 - dist / CONFIG.mouseRadius) * 0.6; // strength
          const dirX = dx / (dist || 1);
          const dirY = dy / (dist || 1);
          if (CONFIG.repel) {
            p.vx += dirX * force;
            p.vy += dirY * force;
          } else {
            p.vx -= dirX * force * 0.15;
            p.vy -= dirY * force * 0.15;
          }
          // clamp velocity
          const vmax = CONFIG.speedRange * 2.2;
          p.vx = Math.max(-vmax, Math.min(vmax, p.vx));
          p.vy = Math.max(-vmax, Math.min(vmax, p.vy));
        }
      }

      // gentle velocity damping to keep everything stable
      p.vx *= 0.995;
      p.vy *= 0.995;
    }
  }

  function render() {
    clear();

    // draw connections first (subtle)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectDistance) drawLine(a, b, dist);
      }
    }

    // draw particles on top
    for (let i = 0; i < particles.length; i++) drawParticle(particles[i]);

    // optional: draw mouse halo (very subtle)
    if (mouse.active && mouse.x !== null) {
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.min(CONFIG.mouseRadius * 1.2, 240));
      grad.addColorStop(0, `rgba(${CONFIG.color.r},${CONFIG.color.g},${CONFIG.color.b},0.08)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, CONFIG.mouseRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // main loop with requestAnimationFrame and pause support
  let animId = null;
  function loop() {
    if (!isRunning) return;
    update();
    render();
    animId = requestAnimationFrame(loop);
  }

  // mouse events (throttled)
  let rafMouse = null;
  function onMouseMove(e) {
    mouse.active = true;
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left);
    mouse.y = (e.clientY - rect.top);
    // compute velocity approx
    if (mouse.lastX !== null) {
      mouse.vx = mouse.x - mouse.lastX;
      mouse.vy = mouse.y - mouse.lastY;
    }
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;

    if (!rafMouse) {
      rafMouse = requestAnimationFrame(() => { rafMouse = null; });
    }
  }
  function onMouseLeave() {
    mouse.active = false;
    mouse.x = null;
    mouse.y = null;
    mouse.lastX = null;
    mouse.lastY = null;
  }

  // touch support (map touch to mouse)
  function onTouchMove(e) {
    if (!e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    onMouseMove(t);
  }
  function onTouchEnd() { onMouseLeave(); }

  // init and listeners
  function bind() {
    window.addEventListener('resize', () => {
      // debounce resize to avoid thrash
      clearTimeout(window._particlesResizeTimer);
      window._particlesResizeTimer = setTimeout(() => {
        resize();
      }, 120);
    });

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });
  }

  // public init
  function init() {
    resize();
    bind();
    loop();
  }

  // kick off
  init();

  // expose for debug/tweaks (optional)
  window._particleSystem = {
    particles, CONFIG, recreate: () => { particles = []; resize(); }
  };
})();

// pastikan dijalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
  const careerEntries = document.querySelectorAll('.career-entry');

  // helper: set data-animated pada semua progress bar di dalam container
  const animateBarsIn = (container) => {
    if (!container || typeof container.querySelectorAll !== 'function') return;
    container.querySelectorAll('.skill-progress-bar').forEach(bar => {
      // opsi validasi: pastikan --value tersedia (opsional)
      const raw = bar.style.getPropertyValue('--value') || bar.getAttribute('data-value') || '';
      // jika perlu sanitasi, lakukan di sini (mis. tambahkan '%' bila perlu)
      bar.setAttribute('data-animated', '1');
    });
  };

  // jika tidak ada entry, hentikan lebih awal (mencegah error)
  if (!careerEntries.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBarsIn(entry.target);
          // jika hanya ingin animasi 1x, unobserve elemen ini
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    careerEntries.forEach(el => {
      if (el instanceof Element) observer.observe(el);
    });
  } else {
    // fallback: langsung animate semua (untuk browser lama)
    careerEntries.forEach(el => animateBarsIn(el));
  }
});

document.querySelectorAll('.stat-number').forEach(num => {
  let target = +num.getAttribute('data-target');
  let count = 0;
  let update = setInterval(() => {
    count++;
    num.textContent = count;
    if (count >= target) clearInterval(update);
  }, 30);
});

// ===== FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    let filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
    });
  });
});

// ===== SEARCH =====
document.getElementById('searchProject').addEventListener('input', e => {
  let val = e.target.value.toLowerCase();
  projectCards.forEach(card => {
    let title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(val) ? 'block' : 'none';
  });
});

// ===== MODAL DETAIL =====
document.querySelectorAll('.view-detail').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = btn.dataset.title;
    document.getElementById('modalClient').textContent = btn.dataset.client;
    document.getElementById('modalDesc').textContent = btn.dataset.desc;
    document.getElementById('modalImg').src = btn.dataset.img;
    document.getElementById('modalDemo').href = btn.dataset.demo;
    document.getElementById('modalSource').href = btn.dataset.source;

    let techHTML = '';
    JSON.parse(btn.dataset.tech).forEach(tech => {
      techHTML += `<span class="tech-badge">${tech}</span>`;
    });
    document.getElementById('modalTech').innerHTML = techHTML;

    document.getElementById('projectModal').classList.add('show');
  });
});
document.querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('projectModal').classList.remove('show');
});