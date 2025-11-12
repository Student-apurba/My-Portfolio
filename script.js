// ---------- Basic UI: menu toggle, active links, sticky header ----------
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
menuIcon && (menuIcon.onclick = () => { menuIcon.classList.toggle('bx-x'); navbar.classList.toggle('active'); });

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
  let top = window.scrollY;
  sections.forEach((sec) => {
    let offset = sec.offsetTop - 140;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');
    if (top >= offset && top < offset + height) {
      navLinks.forEach((l) => l.classList.remove('active'));
      let active = document.querySelector('header nav a[href*=' + id + ']');
      if (active) active.classList.add('active');
    }
  });
  let header = document.querySelector('header');
  header && header.classList.toggle('sticky', window.scrollY > 80);
  menuIcon && menuIcon.classList.remove('bx-x');
  navbar && navbar.classList.remove('active');
});

// ---------- IntersectionObserver reveal ----------
const observerOptions = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-up, .slide-left, .slide-right, .scale-in, .hover-glow, .Skills-box, .project-card, .edu-item')
  .forEach(el => observer.observe(el));

// ---------- Typed.js ----------
if (typeof Typed !== 'undefined') {
  new Typed('.multiple-text', {
    strings: ['Backend Developer', 'Java Enthusiast', 'Spring Boot Developer'],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1400,
    loop: true
  });
}

// ---------- GSAP motions (only for desktop) ----------
if (typeof gsap !== 'undefined' && window.innerWidth >= 768) {
  try {
    gsap.to('.profile-img', { y: -10, duration: 4.4, ease: 'power1.inOut', yoyo: true, repeat: -1 });
  } catch(e){}
  gsap.from('.home-content .intro, .home-content .big-title, .home-content .subtitle, .home-content .role, .home-content .btn', {
    y: 16, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', delay: 0.28
  });
  gsap.to('.footer-iconTap a', { y: -6, repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut' });
}

// ---------- Mobile optimization: remove heavy layers ----------
(function mobileOptimize() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    const canvas = document.getElementById('neon-canvas');
    if (canvas) canvas.remove();
    document.querySelectorAll('.neon-orb, .bg-layer').forEach(el => el.remove());
    // Pause GSAP if present to be extra safe
    try { if (typeof gsap !== 'undefined') gsap.globalTimeline && gsap.globalTimeline.pause(); } catch(e) {}
    console.log('Mobile optimized: heavy visuals removed.');
  }
})();

// ---------- Desktop-only neon canvas & orbs (kept readable) ----------
(function desktopVisuals() {
  if (window.innerWidth < 768) return; // skip on mobile

  // Canvas setup
  const canvas = document.getElementById('neon-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  // Simple low-cost animation (kept low intensity)
  let t = 0;
  let lastTime = 0;
  const fpsInterval = 1000 / 30; // 30fps target
  function draw(now) {
    if (now - lastTime < fpsInterval) { requestAnimationFrame(draw); return; }
    lastTime = now;
    t += 0.01;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const grad = ctx.createRadialGradient(canvas.width*0.3, canvas.height*0.35, 40, canvas.width*0.3, canvas.height*0.35, Math.max(canvas.width, canvas.height));
    grad.addColorStop(0, 'rgba(139,92,246,0.10)');
    grad.addColorStop(0.4, 'rgba(0,230,255,0.05)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // Orbs
  const orbsContainer = document.querySelector('.neon-orbs');
  const colors = ['rgba(0,230,255,0.18)','rgba(139,92,246,0.16)','rgba(255,77,210,0.14)'];
  const orbCount = Math.min(8, Math.round(window.innerWidth / 160));
  for (let i=0;i<orbCount;i++){
    const orb = document.createElement('div');
    orb.className = 'neon-orb';
    const size = Math.random()*180 + 80;
    orb.style.width = size + 'px';
    orb.style.height = size + 'px';
    orb.style.left = (Math.random()*90) + '%';
    orb.style.top = (Math.random()*80) + '%';
    orb.style.background = 'radial-gradient(circle at 30% 30%,' + colors[i%colors.length] + ', transparent 70%)';
    orbsContainer.appendChild(orb);
  }

  let phase = 0;
  function floatOrbs(){ phase += 0.006; document.querySelectorAll('.neon-orb').forEach((el,i)=>{ el.style.transform = 'translateY(' + Math.sin(phase + i) * 8 + 'px)'; }); requestAnimationFrame(floatOrbs); }
  requestAnimationFrame(floatOrbs);
})();

// ---------- Reduced motion respect ----------
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) {
  try { if (typeof gsap !== 'undefined') gsap.killTweensOf('*'); } catch(e) {}
  const canvas = document.getElementById('neon-canvas'); if (canvas) canvas.style.display = 'none';
  document.querySelectorAll('.neon-orb').forEach(n => n.remove());
}
