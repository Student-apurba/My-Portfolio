// ---------- Basic UI: menu toggle, active links, sticky header ----------
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
menuIcon && (menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
});

let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.addEventListener("scroll", () => {
  let top = window.scrollY;
  sections.forEach((sec) => {
    let offset = sec.offsetTop - 140;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");
    if (top >= offset && top < offset + height) {
      navLinks.forEach((l) => l.classList.remove("active"));
      let active = document.querySelector("header nav a[href*=" + id + "]");
      if (active) active.classList.add("active");
    }
  });
  let header = document.querySelector("header");
  header && header.classList.toggle("sticky", window.scrollY > 80);
  menuIcon && menuIcon.classList.remove("bx-x");
  navbar && navbar.classList.remove("active");
});

// ---------- IntersectionObserver reveal ----------
const observerOptions = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in, .fade-up, .slide-left, .slide-right, .scale-in, .hover-glow, .Skills-box, .project-card, .edu-item")
  .forEach(el => observer.observe(el));

// ---------- Typed.js ----------
if (typeof Typed !== "undefined") {
  new Typed(".multiple-text", {
    strings: ["Backend Developer", "Java Enthusiast", "Spring Boot Developer"],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1400,
    loop: true,
  });
}

// ---------- GSAP motions ----------
if (typeof gsap !== "undefined") {
  gsap.to(".profile-img", { y: -10, duration: 4.4, ease: "power1.inOut", yoyo: true, repeat: -1 });
  gsap.from(".home-content .intro, .home-content .big-title, .home-content .subtitle, .home-content .role, .home-content .btn", {
    y: 16, opacity: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", delay: 0.28
  });
  gsap.to(".footer-iconTap a", { y: -6, repeat: -1, yoyo: true, duration: 1.8, ease: "sine.inOut" });
}

// ---------- ScrollReveal fallback ----------
if (typeof ScrollReveal !== "undefined") {
  ScrollReveal().reveal(".heading, .subhead", { origin: "top", distance: "34px", duration: 760, delay: 110 });
  ScrollReveal().reveal(".about-img, .home-img", { origin: "left", distance: "24px", duration: 860, delay: 150 });
  ScrollReveal().reveal(".Skills-box, .project-card", { origin: "bottom", distance: "20px", duration: 860, interval: 80 });
}

// ---------- Neon Orbs + Canvas (optimized for mobile) ----------
(function createNeonOrbs() {
  const isMobile = window.innerWidth < 800;
  const orbsContainer = document.querySelector(".neon-orbs");
  const canvas = document.getElementById("neon-canvas");
  if (!orbsContainer || !canvas) return;

  // reduce count and disable heavy animations on mobile
  const orbCount = isMobile ? 5 : Math.min(10, Math.round(window.innerWidth / 160));
  const colors = [
    "rgba(0,230,255,0.18)",
    "rgba(139,92,246,0.16)",
    "rgba(255,77,210,0.14)",
    "rgba(0,255,159,0.12)"
  ];

  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement("div");
    orb.className = "neon-orb";
    const size = Math.random() * 180 + 100;
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    orb.style.left = `${Math.random() * 90}%`;
    orb.style.top = `${Math.random() * 80}%`;
    orb.style.background = `radial-gradient(circle at 30% 30%, ${colors[i % colors.length]}, transparent 70%)`;
    orbsContainer.appendChild(orb);
  }

  if (isMobile) return; // skip animation loop for phones

  let t = 0;
  function animate() {
    t += 0.015;
    document.querySelectorAll(".neon-orb").forEach((el, i) => {
      el.style.transform = `translateY(${Math.sin(t + i) * 10}px)`;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ---------- Canvas optimized (reduced FPS & disable on phones) ----------
(function neonCanvas() {
  const canvas = document.getElementById("neon-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const isMobile = window.innerWidth < 800;

  if (isMobile) {
    ctx.fillStyle = "rgba(139,92,246,0.08)";
    ctx.fillRect(0, 0, w, h);
    return; // static background only on phones
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  let t = 0;
  let lastTime = 0;
  const fpsInterval = 1000 / 30; // ~30 FPS

  function draw(now) {
    if (now - lastTime < fpsInterval) {
      requestAnimationFrame(draw);
      return;
    }
    lastTime = now;
    t += 0.008;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w * 0.3, h * 0.4, 50, w * 0.3, h * 0.4, w * 0.9);
    grad.addColorStop(0, "rgba(139,92,246,0.10)");
    grad.addColorStop(0.5, "rgba(0,230,255,0.05)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 2; i++) {
      const amp = 18 + i * 12;
      const freq = 0.002 + i * 0.001;
      const phase = t * (0.5 + i * 0.3);
      const yOffset = h * (0.3 + i * 0.15);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 10) {
        const y = yOffset + Math.sin(x * freq + phase) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const color = `hsla(${200 + i * 40}, 90%, 60%, 0.08)`;
      ctx.strokeStyle = color;
      ctx.lineWidth = 30 - i * 10;
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ---------- Hero accent color cycle ----------
(function heroColorShift() {
  if (typeof gsap === "undefined") return;
  const timeline = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 6, ease: "sine.inOut" } });
  timeline.to("body", { "--accent-1": "#7a2cf0", "--accent-2": "#ff5fb3", "--accent-3": "#00ffb2" }, 0);
  timeline.to("body", { "--accent-1": "#8b5cf6", "--accent-2": "#ff4dd2", "--accent-3": "#00ff9f" }, 6);
})();

// ---------- Respect reduced motion ----------
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
if (prefersReduced.matches) {
  try { gsap && gsap.killTweensOf("*"); } catch {}
  const canvas = document.getElementById("neon-canvas");
  if (canvas) canvas.style.display = "none";
  document.querySelectorAll(".neon-orb").forEach((o) => o.remove());
}
