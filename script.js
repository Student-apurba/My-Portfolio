// ---------- Basic UI: menu toggle, active links, sticky header ----------
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
menuIcon && (menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
});

// Scroll Sections Active Links
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.addEventListener("scroll", () => {
  let top = window.scrollY;
  sections.forEach((sec) => {
    let offset = sec.offsetTop - 140;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");
    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => links.classList.remove("active"));
      let activeLink = document.querySelector("header nav a[href*=" + id + "]");
      if (activeLink) activeLink.classList.add("active");
    }
  });

  // Sticky header
  let header = document.querySelector("header");
  header && header.classList.toggle("sticky", window.scrollY > 80);

  // remove mobile navbar when scrolling
  menuIcon && menuIcon.classList.remove("bx-x");
  navbar && navbar.classList.remove("active");
});

// ---------- IntersectionObserver reveal ----------
const observerOptions = { root: null, rootMargin: "0px", threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// observe elements
document.querySelectorAll(".fade-in, .fade-up, .slide-left, .slide-right, .scale-in, .hover-glow")
  .forEach(el => observer.observe(el));

// also reveal skills boxes and project cards
document.querySelectorAll(".Skills-box, .project-card, .edu-item").forEach(el => {
  el.classList.add("fade-up");
  observer.observe(el);
});

// ---------- Typed.js ----------
if (typeof Typed !== "undefined") {
  new Typed('.multiple-text', {
    strings: ['Backend Developer', 'Java Enthusiast', 'Spring Boot Developer'],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1400,
    loop: true
  });
}

// ---------- GSAP subtle motions ----------
if (typeof gsap !== "undefined") {
  // smooth float (if reduced motion not requested)
  try {
    gsap.to(".profile-img", { y: -10, duration: 4.4, ease: "power1.inOut", yoyo: true, repeat: -1 });
  } catch(e){/* ignore if gsap missing */ }

  // hero stagger entrance
  gsap && gsap.from(".home-content .intro, .home-content .big-title, .home-content .subtitle, .home-content .role, .home-content .btn", {
    y: 16, opacity: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", delay: 0.28
  });

  // parallax mousemove
  const hero = document.querySelector(".home");
  hero && hero.addEventListener("mousemove", (e) => {
    let rect = hero.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let moveX = (x - rect.width/2) / (rect.width/14);
    let moveY = (y - rect.height/2) / (rect.height/14);
    gsap.to(".profile-img", { x: moveX, y: -10 + moveY, rotation: moveX * 0.6, duration: 0.6, ease: "power2.out" });
  });

  // footer icon bounce
  gsap.to(".footer-iconTap a", { y: -6, repeat: -1, yoyo: true, duration: 1.8, ease: "sine.inOut" });
}

// ---------- ScrollReveal fallback/enhancement ----------
if (typeof ScrollReveal !== "undefined") {
  ScrollReveal().reveal('.heading, .subhead', { origin: 'top', distance: '34px', duration: 760, delay: 110 });
  ScrollReveal().reveal('.about-img, .home-img', { origin: 'left', distance: '24px', duration: 860, delay: 150 });
  ScrollReveal().reveal('.Skills-box', { origin: 'bottom', distance: '28px', duration: 860, interval: 80 });
  ScrollReveal().reveal('.project-card', { origin: 'bottom', distance: '20px', duration: 860, interval: 80 });
}

// ---------- a11y micro-interactions & reduced motion ----------
document.querySelectorAll("a, button, input, textarea").forEach(el => {
  el.addEventListener("focus", () => el.classList.add("in-view"));
  el.addEventListener("blur", () => el.classList.remove("in-view"));
});

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) {
  // stop GSAP if present
  try { gsap && gsap.killTweensOf("*"); } catch(e){}
  document.querySelectorAll(".profile-img").forEach(i => i.style.animation = "none");
}

/* =========================
   ADDITIONAL NEON / CYBERPUNK ENHANCEMENTS
   (NON-DESTRUCTIVE: only appends new behaviours)
   ========================= */

/* Utility: small random helper */
function rand(min, max) { return Math.random() * (max - min) + min; }

/* ---------- Procedural neon orbs (DOM-based) ---------- */
(function createNeonOrbs() {
  const orbsContainer = document.querySelector('.neon-orbs');
  if (!orbsContainer) return;

  const colors = [
    'rgba(0,230,255,0.18)',  // cyan
    'rgba(139,92,246,0.16)', // purple
    'rgba(255,77,210,0.14)', // magenta
    'rgba(0,255,159,0.12)'   // greenish highlight
  ];

  const orbCount = Math.min(10, Math.round(window.innerWidth / 160)); // responsive count
  const fragments = document.createDocumentFragment();

  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement('div');
    orb.className = 'neon-orb';
    const size = rand(80, 320);
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    orb.style.left = `${rand(-10, 90)}%`;
    orb.style.top = `${rand(-15, 85)}%`;
    orb.style.background = `radial-gradient(circle at 30% 30%, ${colors[i % colors.length]}, rgba(255,255,255,0.02) 40%, transparent 60%)`;
    orb.style.opacity = rand(0.06, 0.18);
    orb.style.transform = `translate3d(0,0,0) scale(${rand(0.85, 1.18)})`;
    orb.dataset.speed = rand(6, 22);
    fragments.appendChild(orb);
  }
  orbsContainer.appendChild(fragments);

  // animate orbs with requestAnimationFrame for smooth, subtle drift
  let last = performance.now();
  function animateOrbs(now) {
    const delta = (now - last) / 1000;
    last = now;
    document.querySelectorAll('.neon-orb').forEach((el, idx) => {
      const speed = parseFloat(el.dataset.speed);
      const x = parseFloat(el.dataset.x || 0) + Math.sin((now / 1000) * (0.2 + idx * 0.07)) * (speed * 0.02);
      const y = parseFloat(el.dataset.y || 0) + Math.cos((now / 1000) * (0.14 + idx * 0.05)) * (speed * 0.02);
      el.dataset.x = x;
      el.dataset.y = y;
      // convert to pixel movement relative to viewport size
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 + Math.sin(now/1000 + idx)*0.006})`;
    });
    requestAnimationFrame(animateOrbs);
  }
  requestAnimationFrame(animateOrbs);

  // gentle resize behavior: reposition randomly on orientation/resize to keep composition alive
  window.addEventListener('resize', () => {
    document.querySelectorAll('.neon-orb').forEach((el) => {
      el.style.left = `${rand(-10, 90)}%`;
      el.style.top = `${rand(-15, 85)}%`;
    });
  });
})();

/* ---------- Canvas: animated neon gradient waves & subtle noise ---------- */
(function neonCanvas() {
  const canvas = document.getElementById('neon-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  let t = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  function draw() {
    t += 0.008;
    ctx.clearRect(0, 0, w, h);

    // radial ambient glow behind hero
    const grad = ctx.createRadialGradient(w * 0.15, h * 0.35, 40, w * 0.15, h * 0.35, Math.max(w,h));
    grad.addColorStop(0, 'rgba(139,92,246,0.12)');
    grad.addColorStop(0.35, 'rgba(0,230,255,0.06)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    // layered sin waves (neon ribbons)
    const ribbons = 3;
    for (let i = 0; i < ribbons; i++) {
      const hueA = 190 + i * 40; // cyan->purpleish hue range
      const alpha = 0.08 + (i * 0.03);
      drawWave(i, hueA, alpha);
    }

    // tiny noise speckles for texture
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.02})`;
      ctx.fillRect(Math.random()*w, Math.random()*h, Math.random()*2, Math.random()*2);
    }

    requestAnimationFrame(draw);
  }

  function drawWave(idx, hue, alpha) {
    ctx.beginPath();
    const amplitude = 18 + idx * 18;
    const frequency = 0.0025 + idx * 0.0016;
    const phase = t * (0.6 + idx * 0.4);
    const yOffset = h * (0.3 + idx * 0.1 + Math.sin(t + idx) * 0.02);

    for (let x = -50; x <= w + 50; x += 6) {
      const y = yOffset + Math.sin((x * frequency) + phase) * amplitude;
      if (x === -50) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineWidth = 42 - idx * 10;
    const grad = ctx.createLinearGradient(0, yOffset - 80, w, yOffset + 80);
    grad.addColorStop(0, `hsla(${hue-30}, 90%, 60%, ${alpha})`);
    grad.addColorStop(0.5, `hsla(${hue}, 85%, 60%, ${alpha*1.2})`);
    grad.addColorStop(1, `hsla(${hue+20}, 75%, 60%, ${alpha})`);
    ctx.strokeStyle = grad;
    ctx.shadowBlur = 40;
    ctx.shadowColor = `hsla(${hue}, 85%, 65%, ${alpha*1.6})`;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.closePath();
  }

  // start draw loop
  draw();
})();


/* ---------- Interactive hero parallax color shift (GSAP timeline) ---------- */
(function heroColorShift() {
  if (typeof gsap === 'undefined') return;
  const hero = document.querySelector('.home');
  if (!hero) return;

  const timeline = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 6, ease: "sine.inOut" } });
  timeline.to('body', { '--accent-1': '#7a2cf0', '--accent-2': '#ff5fb3', '--accent-3': '#00ffb2', overwrite: true }, 0);
  timeline.to('body', { '--accent-1': '#8b5cf6', '--accent-2': '#ff4dd2', '--accent-3': '#00ff9f' }, 6);
})();

/* ---------- Small sparkle generator around interactive elements ---------- */
(function sparkleGenerator() {
  const seeds = document.querySelectorAll('.btn, .project-card, .Skills-box, .home-img');
  if (seeds.length === 0) return;
  function spawnSpark(el) {
    const rect = el.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.className = 'neon-spark';
    const left = rect.left + Math.random() * rect.width;
    const top = rect.top + Math.random() * rect.height;
    sparkle.style.left = `${left}px`;
    sparkle.style.top = `${top}px`;
    sparkle.style.transform = `translate3d(0,0,0) scale(${Math.random()*1.1 + 0.6})`;
    document.body.appendChild(sparkle);
    gsap.to(sparkle, { y: -12 - Math.random()*18, opacity: 0, scale: 0.4, duration: 1.2 + Math.random() * 0.7, ease: "power2.out", onComplete: () => sparkle.remove() });
  }

  // occasionally spawn near hovered elements
  seeds.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const r = setInterval(() => spawnSpark(el), 180 + Math.random()*220);
      el._sparkInterval = r;
    });
    el.addEventListener('mouseleave', () => {
      clearInterval(el._sparkInterval);
    });
  });
})();

/* ---------- Respect reduced motion: gracefully disable heavy effects ---------- */
(function respectReducedMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    // remove or reduce intense elements
    try {
      document.querySelectorAll('.neon-orb').forEach(n => n.remove());
      document.querySelectorAll('.cursor-glow, .cursor-ring').forEach(n => n.remove());
      const canvas = document.getElementById('neon-canvas');
      if (canvas) canvas.style.display = 'none';
    } catch (e) { /* ignore */ }
  }
})();
