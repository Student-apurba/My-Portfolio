// ---------- MENU + NAV ----------
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

// ---------- SECTION REVEAL ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

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

// ---------- GSAP ----------
if (typeof gsap !== "undefined") {
  gsap.to(".profile-img", { y: -10, duration: 4.4, ease: "power1.inOut", yoyo: true, repeat: -1 });
  gsap.from(".home-content .intro, .home-content .big-title, .home-content .subtitle, .home-content .role, .home-content .btn", {
    y: 16, opacity: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", delay: 0.28
  });
  gsap.to(".footer-iconTap a", { y: -6, repeat: -1, yoyo: true, duration: 1.8, ease: "sine.inOut" });
}

// ---------- SMOOTH LIGHT BACKGROUND ----------
(function mobileOptimize() {
  const isMobile = window.innerWidth < 800;
  const canvas = document.getElementById("neon-canvas");
  if (!canvas) return;

  if (isMobile) {
    // Completely remove heavy background elements on phone
    canvas.remove();
    document.querySelectorAll(".neon-orb, .bg-layer").forEach(el => el.remove());
    console.log("Mobile optimization: background effects removed for performance.");
  }
})();


// ---------- Accent Color Cycle ----------
(function heroColorShift() {
  if (typeof gsap === "undefined") return;
  const timeline = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 8, ease: "sine.inOut" } });
  timeline.to("body", { "--accent-1": "#7a2cf0", "--accent-2": "#ff5fb3", "--accent-3": "#00ffb2" }, 0);
  timeline.to("body", { "--accent-1": "#8b5cf6", "--accent-2": "#ff4dd2", "--accent-3": "#00ff9f" }, 8);
})();

// ---------- Reduced Motion ----------
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
if (prefersReduced.matches) {
  try { gsap && gsap.killTweensOf("*"); } catch {}
  const canvas = document.getElementById("neon-canvas");
  if (canvas) canvas.style.display = "none";
  document.querySelectorAll(".neon-orb").forEach((o) => o.remove());
}

