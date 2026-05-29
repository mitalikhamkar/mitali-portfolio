import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from '@emailjs/browser';

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #060612;
  --bg2: #0a0a1c;
  --bg3: #0e0e24;
  --surface: rgba(255,255,255,0.04);
  --surface2: rgba(255,255,255,0.07);
  --border: rgba(120,80,255,0.15);
  --border2: rgba(120,80,255,0.32);
  --violet: #7c4dff;
  --violet-light: #a78bfa;
  --indigo: #5c6bc0;
  --pink: #e91e8c;
  --cyan: #00e5ff;
  --green: #00e676;
  --text: #eeeeff;
  --text2: #9e9ec8;
  --text3: #5a5880;
  --mono: 'DM Mono', monospace;
  --sans: 'Plus Jakarta Sans', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  font-weight: 400;
  line-height: 1.6;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--violet); border-radius: 3px; }
::selection { background: rgba(124,77,255,0.3); color: var(--text); }

#scroll-progress {
  position: fixed; top: 0; left: 0; height: 2px; z-index: 9999;
  background: linear-gradient(90deg, var(--violet), var(--pink), var(--cyan));
  transition: width 0.1s linear;
  box-shadow: 0 0 8px var(--violet);
}

body::before {
  content: '';
  position: fixed; inset: 0; z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.35;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-10px); }
}
@keyframes pulseGlow {
  0%,100% { box-shadow: 0 0 16px rgba(124,77,255,0.35); }
  50%      { box-shadow: 0 0 36px rgba(124,77,255,0.7), 0 0 60px rgba(92,107,192,0.25); }
}
@keyframes gradientShift {
  0%,100% { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to   { transform: rotate(0deg); }
}
@keyframes ripple {
  0%   { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2.2); opacity: 0; }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes blink {
  0%,100% { opacity: 1; } 50% { opacity: 0; }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes barGrow {
  from { width: 0; }
}

.animate-float { animation: float 5s ease-in-out infinite; }

.reveal {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

.glass {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(124,77,255,0.14);
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa 0%, #7c4dff 40%, #e91e8c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section {
  position: relative;
  z-index: 2;
  padding: 96px 24px;
  max-width: 1160px;
  margin: 0 auto;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--violet-light);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.section-label::before {
  content: '';
  display: block;
  width: 20px;
  height: 1px;
  background: var(--violet);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 26px;
  background: linear-gradient(135deg, var(--violet), #5c6bc0);
  border: none;
  border-radius: 8px;
  color: white;
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}
.btn-primary::after {
  content: '';
  position: absolute;
  top: -50%; left: -75%;
  width: 50%; height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transform: skewX(-20deg);
  animation: shimmer 3s ease-in-out infinite;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,77,255,0.45); }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: transparent;
  border: 1px solid rgba(124,77,255,0.45);
  border-radius: 8px;
  color: var(--violet-light);
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}
.btn-ghost:hover {
  background: rgba(124,77,255,0.1);
  border-color: var(--violet);
  transform: translateY(-2px);
  box-shadow: 0 4px 18px rgba(124,77,255,0.18);
}

/* NAV */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  transition: all 0.4s ease;
  padding: 20px 40px;
}
nav.scrolled {
  background: rgba(6,6,18,0.88);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(124,77,255,0.1);
  padding: 13px 40px;
}
.nav-inner {
  max-width: 1160px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}
.nav-logo span { color: var(--violet-light); }
.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
}
.nav-links a {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text2);
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: color 0.25s;
  position: relative;
}
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0;
  width: 0; height: 1px;
  background: var(--violet);
  transition: width 0.3s;
}
.nav-links a:hover { color: var(--violet-light); }
.nav-links a:hover::after { width: 100%; }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--violet-light);
  border-radius: 2px;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  nav { padding: 15px 20px; }
  nav.scrolled { padding: 11px 20px; }
  .hamburger { display: flex; }
  .nav-links {
    position: fixed;
    top: 0; right: -100%;
    height: 100vh; width: 240px;
    flex-direction: column;
    background: rgba(6,6,18,0.97);
    backdrop-filter: blur(30px);
    border-left: 1px solid rgba(124,77,255,0.2);
    justify-content: center;
    gap: 26px;
    transition: right 0.4s ease;
    padding: 40px;
  }
  .nav-links.open { right: 0; }
  .nav-links a { font-size: 13px; }
  .section { padding: 60px 16px; }
}

@media (max-width: 480px) {
  nav { padding: 12px 16px; }
  nav.scrolled { padding: 10px 16px; }
  .nav-inner { justify-content: space-between; }
  .nav-logo { font-size: 16px; }
  .nav-links { width: 100%; }
  .section { padding: 48px 14px; }
  .btn-primary, .btn-ghost { font-size: 12px; padding: 9px 20px; }
  .skill-pill { font-size: 11px; padding: 6px 12px; }
}

/* SKILL PILL */
.skill-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 15px;
  background: rgba(124,77,255,0.07);
  border: 1px solid rgba(124,77,255,0.18);
  border-radius: 6px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text2);
  transition: all 0.3s ease;
  cursor: default;
}
.skill-pill:hover {
  background: rgba(124,77,255,0.14);
  border-color: rgba(124,77,255,0.45);
  color: var(--violet-light);
  transform: translateY(-2px);
}

/* PROJECT CARD */
.project-card {
  position: relative;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(124,77,255,0.11);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s ease;
}
.project-card:hover {
  border-color: rgba(124,77,255,0.38);
  transform: translateY(-5px);
  box-shadow: 0 18px 50px rgba(124,77,255,0.13);
}

/* TILT */
.tilt-card { transform-style: preserve-3d; transition: transform 0.4s ease; }

@media (max-width: 768px) {
  .tilt-card { transform-style: flat; }
}

/* CONTACT INPUT */
.contact-input {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(124,77,255,0.2);
  border-radius: 8px;
  padding: 13px 16px;
  color: var(--text);
  font-family: var(--sans);
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  resize: vertical;
}
.contact-input:focus {
  border-color: var(--violet);
  box-shadow: 0 0 0 3px rgba(124,77,255,0.1);
}
.contact-input::placeholder { color: var(--text3); }

/* SOCIAL ICON */
.social-icon {
  width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(124,77,255,0.18);
  border-radius: 10px;
  color: var(--text2);
  text-decoration: none;
  transition: all 0.3s;
}
.social-icon:hover {
  background: rgba(124,77,255,0.14);
  border-color: var(--violet);
  color: var(--violet-light);
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(124,77,255,0.18);
}

/* TIMELINE */
.timeline-dot {
  width: 11px; height: 11px;
  background: var(--violet);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--violet);
  flex-shrink: 0;
  position: relative;
}
.timeline-dot.active::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(124,77,255,0.4);
  animation: ripple 2s ease-out infinite;
}

/* LOADER */
.loader-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  transition: opacity 0.6s ease, visibility 0.6s ease;
}
.loader-overlay.hidden { opacity: 0; visibility: hidden; }
.loader-ring {
  width: 52px; height: 52px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--violet);
  border-right-color: #5c6bc0;
  animation: spin-slow 0.9s linear infinite;
}
.loader-ring-inner {
  position: absolute;
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-bottom-color: var(--pink);
  animation: spin-reverse 0.7s linear infinite;
}

/* HERO GRID */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(124,77,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124,77,255,0.035) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
}

/* PARTICLE */
#particle-canvas {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
}

.orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px); pointer-events: none;
}

/* CGPI bar animation */
.cgpi-bar { animation: barGrow 1.2s ease both; }

/* RESPONSIVE IMPROVEMENTS */
@media (max-width: 768px) {
  body { font-size: 14px; }
  .section { max-width: 100% !important; }
  .section-label { font-size: 10px; }
}

@media (max-width: 480px) {
  body { font-size: 13px; }
  .hero-grid { opacity: 0.5; }
  .orb { filter: blur(60px); }
}
`;

/* ═══════════════════════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════════════════════ */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,77,255,${p.alpha})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(92,107,192,${0.1 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} id="particle-canvas" />;
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS
═══════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div id="scroll-progress" style={{ width: `${pct}%` }} />;
}

/* ═══════════════════════════════════════════════════════════
   REVEAL HOOK
═══════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ═══════════════════════════════════════════════════════════
   TILT CARD
═══════════════════════════════════════════════════════════ */
function TiltCard({ children, className = "", style = {} }) {
  const cardRef = useRef(null);
  const onMove = useCallback(e => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const mx = (e.clientX - cx);
    const my = (e.clientY - cy);
    const rotY = (mx / (rect.width / 2)) * 7;
    const rotX = -(my / (rect.height / 2)) * 7;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.015)`;
  }, []);
  const onLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
  }, []);
  return (
    <div ref={cardRef} className={`tilt-card ${className}`} style={style}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOADER
═══════════════════════════════════════════════════════════ */
function Loader({ done }) {
  return (
    <div className={`loader-overlay ${done ? "hidden" : ""}`}>
      <div style={{ position: "relative", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loader-ring" />
        <div className="loader-ring-inner" />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--violet)", boxShadow: "0 0 10px var(--violet)" }} />
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--violet)", letterSpacing: "0.22em" }}>LOADING</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["About", "Skills", "Projects", "Education", "Contact"];
  const scroll = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <div className="nav-inner">
        <a href="https://github.com/mitalikhamkar" className="nav-logo">Mitali<span>.</span></a>
        <button className="hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          <span style={{ transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`} onClick={(e) => { e.preventDefault(); scroll(l); }}>{l}</a></li>
          ))}
          <li>
            <a href="#contact" className="btn-primary"
              style={{ padding: "8px 18px", fontSize: 12, borderRadius: 6 }}
              onClick={e => { e.preventDefault(); scroll("contact"); }}>
              Hire Me
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEVELOPER PHOTO
   ─────────────────────────────────────────────────────────
   ACTION REQUIRED: Add your real photo to the public folder.
   Name it exactly: mitali-photo.jpg
   Path will be: public/mitali-photo.jpg
   Any decent photo works — crop to roughly square first.
═══════════════════════════════════════════════════════════ */
function DeveloperPhoto() {
  return (
    <img
      src="/mitali-photo.jpg"
      alt="Mitali Khamkar — Full-Stack Developer"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%",
        maxWidth: "100%",
        filter: "drop-shadow(0 20px 60px rgba(124,77,255,0.3))",
      }}
      loading="lazy"
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div className="hero-grid" />
      <div className="orb" style={{ width: 550, height: 550, background: "radial-gradient(circle, rgba(92,107,192,0.1) 0%, transparent 70%)", top: "-80px", left: "-130px" }} />
      <div className="orb animate-float" style={{ width: 380, height: 380, background: "radial-gradient(circle, rgba(124,77,255,0.09) 0%, transparent 70%)", bottom: "60px", right: "-80px" }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px", width: "100%", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
        {/* LEFT: Text */}
        <div style={{ animation: "fadeInUp 0.85s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 8px #00e676", animation: "pulseGlow 2s infinite" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", letterSpacing: "0.14em" }}>OPEN TO OPPORTUNITIES</span>
          </div>

          <h1 style={{ fontFamily: "var(--sans)", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 14, letterSpacing: "-0.02em" }}>
            Hi, I'm<br />
            <span className="gradient-text">Mitali Khamkar.</span>
          </h1>

          {/* ✅ CHANGE 1: Removed "Aspiring" */}
          <h2 style={{ fontFamily: "var(--sans)", fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 400, color: "var(--text2)", marginBottom: 28, letterSpacing: "0.01em" }}>
            Full-Stack Developer
          </h2>

          <p style={{ color: "var(--text3)", fontSize: "clamp(14px, 1.4vw, 15.5px)", lineHeight: 1.8, maxWidth: 460, marginBottom: 40 }}>
            BSc IT student passionate about building practical real-world applications using the MERN stack. Turning ideas into elegant, performant software.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#projects" className="btn-primary"
              onClick={e => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}>
              View Projects →
            </a>
            <a href="/Mitali_Khamkar_Resume.pdf" download="Mitali_Khamkar_Resume.pdf" className="btn-ghost">
              ↓ Download Resume
            </a>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
            <a href="https://github.com/mitalikhamkar" target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/mitali-khamkar" target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* RIGHT: Real Photo */}
        <div style={{ position: "relative", animation: "fadeIn 1.1s ease both 0.3s" }}>
          <div className="animate-float" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Decorative rings */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(92,107,192,0.12) 0%, transparent 68%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 370, height: 370, borderRadius: "50%", border: "1px dashed rgba(124,77,255,0.18)", animation: "spin-slow 22s linear infinite" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 410, height: 410, borderRadius: "50%", border: "1px dashed rgba(92,107,192,0.1)", animation: "spin-reverse 32s linear infinite" }} />
            {/* Photo container — circular frame */}
            <div style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(124,77,255,0.35)",
              boxShadow: "0 0 40px rgba(124,77,255,0.2), 0 0 80px rgba(92,107,192,0.1)",
              position: "relative",
              zIndex: 2,
            }}>
              <DeveloperPhoto />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.4 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", letterSpacing: "0.18em" }}>SCROLL</span>
        <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, var(--violet), transparent)" }} />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #hero > div { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 768px) {
          #hero { min-height: auto; padding: 90px 0 50px; }
          #hero > div { grid-template-columns: 1fr !important; gap: 28px !important; padding: 0 20px !important; text-align: center; }
          #hero > div > div:last-child { order: 1; max-width: 200px; margin: 0 auto; }
          #hero > div > div:first-child { order: 2; display: flex; flex-direction: column; align-items: center; }
          #hero p { max-width: 100% !important; }
          #hero > div > div:first-child > div:nth-last-child(2) { justify-content: center; }
          #hero > div > div:first-child > div:last-child { justify-content: center; }
          #hero h1 { font-size: clamp(30px, 8vw, 42px) !important; line-height: 1.2; }
          #hero h2 { font-size: 18px !important; }
          #hero p { font-size: 14px !important; line-height: 1.7; }
        }
        @media (max-width: 480px) {
          #hero { padding: 80px 0 40px; }
          #hero > div { gap: 22px !important; padding: 0 16px !important; }
          #hero > div > div:last-child { max-width: 160px; }
          #hero > div > div:last-child > div > div:nth-child(4) { width: 160px !important; height: 160px !important; }
          #hero h1 { font-size: 34px !important; }
          #hero h2 { font-size: 16px !important; }
          #hero p { font-size: 13px !important; margin-bottom: 24px; }
          #hero .btn-primary, #hero .btn-ghost { width: 100%; justify-content: center; font-size: 13px; padding: 12px 16px; }
          #hero > div > div:first-child > div:nth-last-child(2) { width: 100%; flex-direction: column; gap: 12px; }
          #hero > div > div:first-child > div:last-child { margin-top: 20px; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABOUT SECTION
═══════════════════════════════════════════════════════════ */
function About() {
  useReveal();
  const traits = [
    { icon: "🎯", title: "Problem Solver", desc: "Breaking complex problems into clean, maintainable solutions." },
    { icon: "⚡", title: "Fast Learner", desc: "Continuously upskilling across the full stack — UI to database." },
    { icon: "🔨", title: "Builder Mindset", desc: "Love creating products that solve real pain points." },
    { icon: "📐", title: "Detail-Oriented", desc: "Clean code meets thoughtful, polished interfaces." },
  ];

  return (
    <section id="about" style={{ position: "relative", zIndex: 2 }}>
      <div className="section">
        <div className="reveal">
          <div className="section-label">About Me</div>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Who I <span className="gradient-text">Am</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start", marginTop: 48 }}>
          <div>
            <p className="reveal" style={{ color: "var(--text2)", fontSize: 15.5, lineHeight: 1.85, marginBottom: 18 }}>
              I'm a passionate <span style={{ color: "var(--violet-light)", fontWeight: 600 }}>fresher</span> dedicated to building practical real-world web and mobile applications. My journey began with curiosity about how things work — and evolved into a drive to build them.
            </p>
            <p className="reveal reveal-delay-1" style={{ color: "var(--text2)", fontSize: 15.5, lineHeight: 1.85, marginBottom: 18 }}>
              Passionate about full-stack and mobile app development, I build real-world solutions using modern technologies — from React interfaces to Node.js backends — and continuously improve through hands-on projects.
            </p>
            <p className="reveal reveal-delay-2" style={{ color: "var(--text2)", fontSize: 15.5, lineHeight: 1.85, marginBottom: 36 }}>
              I enjoy working across the full stack — designing intuitive UIs with React to architecting scalable backends with Node.js and Express. I care deeply about <span style={{ color: "var(--violet-light)", fontWeight: 600 }}>product quality</span> and user experience.
            </p>

            <div className="reveal reveal-delay-3" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="https://github.com/mitalikhamkar" target="_blank" rel="noreferrer" className="btn-primary">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/mitali-khamkar" target="_blank" rel="noreferrer" className="btn-ghost">LinkedIn ↗</a>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {traits.map((t, i) => (
              <TiltCard key={t.title}>
                <div className={`reveal reveal-delay-${i + 1}`}
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(124,77,255,0.1)", borderRadius: 12, padding: "20px", transition: "all 0.3s", height: "100%" }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{t.icon}</div>
                  <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 14, marginBottom: 7, color: "var(--text)" }}>{t.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.65 }}>{t.desc}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        <style>{`
          @media(max-width:1024px){ #about .section > div:nth-child(2){grid-template-columns:1fr 1fr!important;gap:40px!important;} }
          @media(max-width:768px){
            #about .section > div:nth-child(2){grid-template-columns:1fr!important;gap:24px!important;margin-top: 32px !important;}
            #about h2{font-size:clamp(24px, 5vw, 36px)!important;}
            #about .section > div:nth-child(2) > div:first-child > p{font-size:14px!important;margin-bottom:11px!important;line-height:1.6;}
          }
          @media(max-width:480px){
            #about .section{padding:40px 14px;}
            #about .section > div:nth-child(2) > div:last-child{grid-template-columns:1fr!important;gap:12px!important;}
          }
        `}</style>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKILLS SECTION
═══════════════════════════════════════════════════════════ */
function Skills() {
  useReveal();
  const categories = [
    {
      label: "Frontend",
      color: "#7c4dff",
      skills: [
        { name: "React.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
        { name: "React Native", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
        { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
        { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
        { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
      ],
    },
    {
      label: "Backend",
      color: "#5c6bc0",
      skills: [
        { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
        { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" },
      ],
    },
    {
      label: "Database",
      color: "#00e5ff",
      skills: [
        { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
      ],
    },
    {
      label: "Academic Knowledge",
      color: "#e91e8c",
      skills: [
        { name: "SQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
        { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
      ],
    },
    {
      label: "Tools",
      color: "#00e676",
      skills: [
        { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
        { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
      ],
    },
  ];

  const allSkills = ["React.js", "React Native", "JavaScript", "HTML", "CSS", "Node.js", "Express.js", "MongoDB", "SQL", "C++", "Git", "GitHub", "MERN Stack", "REST APIs"];

  return (
    <section id="skills" style={{ position: "relative", zIndex: 2, background: "rgba(10,10,28,0.5)" }}>
      <div className="section">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Technical Toolkit</div>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            My <span className="gradient-text">Skills</span>
          </h2>
          <p style={{ color: "var(--text3)", marginTop: 14, maxWidth: 460, margin: "14px auto 0", fontSize: 15 }}>
            Technologies I've built real products with, end-to-end.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {categories.map((cat) => (
            <div key={cat.label} className="reveal" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: cat.color, boxShadow: `0 0 12px ${cat.color}` }} />
                <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>{cat.label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 24, paddingLeft: 16 }}>
                {cat.skills.map((skill) => (
                  <div key={skill.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transition: "transform 0.3s ease", cursor: "pointer" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-6px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                    <div style={{ padding: 12, background: "rgba(124,77,255,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={skill.logo} alt={skill.name} style={{ width: 52, height: 52, objectFit: "contain" }} />
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text2)", textAlign: "center", fontWeight: 500 }}>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 44, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {allSkills.map(s => (
            <span key={s} className="skill-pill">{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS SECTION
═══════════════════════════════════════════════════════════ */
function Projects() {
  useReveal();

  const projects = [
    {
      title: "Glamware",
      subtitle: "Virtual Wardrobe & Styling App",
      type: "Android Application",
      badge: "Mobile",
      badgeColor: "#7c4dff",
      icon: "👔",
      /* ✅ ACTION: Add a screenshot of the Glamware app UI to public/glamware-screenshot.png */
      screenshot: "/glamware-screenshot.png",
      desc: "Glamware is a mobile application that allows users to create a digital wardrobe, upload their clothing items, and style outfits virtually using a 3D avatar.",
      tags: ["React Native", "Mobile", "Android", "UI/UX"],
      highlights: ["Avatar Creation", "Avatar Customization", "3D Cloth storing", "Styling clothes on Avatar"],
      links: [
        { label: "APK Download", icon: "↓", url: "https://drive.google.com/file/d/13FktusnJyjwBuCW7rIHNEMRoeptUEWVV/view?usp=drive_link", primary: true, download: "Glamware.apk" },
        { label: "GitHub", icon: "⌨", url: "https://github.com/mitalikhamkar/Glamware-app" },
      ],
      accent: "rgba(124,77,255,0.12)",
      borderAccent: "rgba(124,77,255,0.38)",
    },
    {
      title: "Culina",
      subtitle: "Cook What you Have",
      type: "Web Application",
      badge: "Live",
      badgeColor: "#00e676",
      icon: "🍳",
      /* ✅ ACTION: Take a screenshot of culina-xi.vercel.app and save to public/culina-screenshot.png */
      screenshot: "/culina-screenshot.png",
      desc: "Culina is a full-stack recipe web application where users can explore delicious recipes with beautiful food images, search dishes, and enjoy a clean modern cooking experience.",
      tags: ["React.js", "Node.js", "MongoDB", "Express.js", "REST API"],
      highlights: ["MERN stack", "Live deployment", "Responsive UI", "Recipe discovery"],
      links: [
        { label: "Live Demo", icon: "↗", url: "https://culina-xi.vercel.app/", primary: true },
        { label: "GitHub", icon: "⌨", url: "https://github.com/mitalikhamkar/Culina" },
      ],
      accent: "rgba(0,230,118,0.07)",
      borderAccent: "rgba(0,230,118,0.35)",
    },
    {
      title: "Lead Workflow System",
      subtitle: "Modular Backend Architecture",
      type: "Backend Project",
      badge: "Architecture",
      badgeColor: "#e91e8c",
      icon: "⚙️",
      screenshot: null,
      desc: "A modular, scalable backend system for validation, classification, and action-triggered lead processing. Built with Node.js and Express, showcasing clean architecture and engineering discipline.",
      tags: ["Node.js", "Express.js", "MongoDB", "REST API", "Middleware"],
      highlights: ["Modular architecture", "Lead classification", "Action triggers", "Scalable design"],
      links: [
        { label: "GitHub", icon: "⌨", url: "https://github.com/mitalikhamkar/lead-workflow-system", primary: true },
      ],
      accent: "rgba(233,30,140,0.08)",
      borderAccent: "rgba(233,30,140,0.32)",
    },
  ];

  return (
    <section id="projects" style={{ position: "relative", zIndex: 2 }}>
      <div className="section">
        <div className="reveal" style={{ marginBottom: 56 }}>
          <div className="section-label">Portfolio</div>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p style={{ color: "var(--text3)", marginTop: 14, maxWidth: 460, fontSize: 15 }}>
            Real products built with thoughtful engineering and design.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {projects.map((p, i) => (
            <TiltCard key={p.title}>
              <div className={`project-card reveal reveal-delay-${i + 1}`}>
                <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
                  {/* Left accent panel */}
                  <div style={{ background: p.accent, borderRight: `1px solid ${p.borderAccent}`, padding: "32px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "16px 0 0 16px" }}>
                    <div>
                      <div style={{ fontSize: 48, marginBottom: 14 }}>{p.icon}</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 800, marginBottom: 4, color: "var(--text)", letterSpacing: "-0.01em" }}>{p.title}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text3)", marginBottom: 14 }}>{p.subtitle}</div>
                      <div style={{ display: "inline-block", padding: "3px 11px", borderRadius: 20, background: `${p.badgeColor}1a`, border: `1px solid ${p.badgeColor}40`, fontFamily: "var(--mono)", fontSize: 9.5, color: p.badgeColor, letterSpacing: "0.1em" }}>
                        {p.badge}
                      </div>
                    </div>
                    <div style={{ marginTop: 22 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--text3)", marginBottom: 6, letterSpacing: "0.1em" }}>TYPE</div>
                      <div style={{ fontSize: 12.5, color: "var(--text2)" }}>{p.type}</div>
                    </div>
                  </div>

                  {/* Right content */}
                  <div style={{ padding: "32px 28px" }}>
                    {/* ✅ CHANGE 4: Screenshot preview */}
                    {p.screenshot && (
                      <div style={{ marginBottom: 20, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(124,77,255,0.15)", maxHeight: 180 }}>
                        <img
                          src={p.screenshot}
                          alt={`${p.title} screenshot`}
                          style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 180 }}
                          onError={(e) => { e.target.parentElement.style.display = "none"; }}
                        />
                      </div>
                    )}

                    <p style={{ color: "var(--text2)", fontSize: 14.5, lineHeight: 1.78, marginBottom: 22 }}>{p.desc}</p>

                    <div style={{ marginBottom: 22 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--text3)", marginBottom: 8, letterSpacing: "0.1em" }}>HIGHLIGHTS</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 10px" }}>
                        {p.highlights.map(h => (
                          <div key={h} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--text2)" }}>
                            <span style={{ color: p.badgeColor, fontSize: 9 }}>◆</span>{h}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 26 }}>
                      {p.tags.map(t => (
                        <span key={t} className="skill-pill" style={{ fontSize: 10.5 }}>{t}</span>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {p.links.map(l => (
                        l.primary
                          ? <a key={l.label} href={l.url} target={l.download ? "_self" : "_blank"} rel="noreferrer"
                              download={l.download || undefined} className="btn-primary">{l.icon} {l.label}</a>
                          : <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                              className="btn-ghost">{l.icon} {l.label}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){ .project-card > div { grid-template-columns: 220px 1fr !important; } }
        @media(max-width:768px){
          .project-card > div { grid-template-columns: 1fr !important; }
          .project-card > div > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(124,77,255,0.18); border-radius: 16px 16px 0 0 !important; padding: 24px !important; }
          .project-card > div > div:last-child { padding: 24px !important; }
          #projects h2{font-size:clamp(24px, 5vw, 36px)!important;}
        }
        @media(max-width:480px){
          #projects .section{padding:48px 14px;}
          .project-card > div > div:first-child { padding: 20px 16px !important; }
          .project-card > div > div:last-child { padding: 20px 16px !important; }
          .project-card > div > div:last-child > div:last-child { flex-direction: column; gap: 8px; }
          .project-card > div > div:last-child > div:last-child > a { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EDUCATION SECTION
═══════════════════════════════════════════════════════════ */
function Education() {
  useReveal();

  const cgpiData = [
    { sem: "Sem 1", cgpi: 9.50 },
    { sem: "Sem 2", cgpi: 9.90 },
    { sem: "Sem 3", cgpi: 10.00 },
    { sem: "Sem 4", cgpi: 9.40 },
    { sem: "Sem 5", cgpi: 9.10 },
    { sem: "Sem 6", cgpi: 9.10 },
  ];

  const education = [
    {
      title: "SSC (10th)",
      school: "Shree Ekveera Vidyalaya",
      period: "Completed 2021",
      score: "91.60%",
      icon: "🎓",
      status: "done",
      color: "#5c6bc0",
    },
    {
      title: "HSC — Commerce",
      school: "KES Shroff College, Mumbai",
      period: "2021 – 2023",
      score: "84.83%",
      icon: "📚",
      status: "done",
      color: "#7c4dff",
    },
    {
      title: "BSc Information Technology",
      school: "DG Ruparel College of Science, Commerce and Arts",
      sub: "University of Mumbai",
      period: "2023 – 2026",
      icon: "💻",
      status: "current",
      color: "#a78bfa",
      cgpi: true,
    },
  ];

  return (
    <section id="education" style={{ position: "relative", zIndex: 2, background: "rgba(10,10,28,0.5)" }}>
      <div className="section">
        <div className="reveal" style={{ marginBottom: 56 }}>
          <div className="section-label">Learning Path</div>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Education <span className="gradient-text">Journey</span>
          </h2>
          <p style={{ color: "var(--text3)", marginTop: 14, maxWidth: 460, fontSize: 15 }}>
            Academic milestones that have shaped my technical foundation.
          </p>
        </div>

        <div style={{ position: "relative", paddingLeft: 36 }}>
          <div style={{ position: "absolute", left: 9, top: 8, bottom: 8, width: 2, background: "linear-gradient(to bottom, var(--violet), rgba(124,77,255,0.15))", borderRadius: 2 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {education.map((e, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ position: "relative", flexShrink: 0, marginTop: 5 }}>
                  <div className={`timeline-dot ${e.status === "current" ? "active" : ""}`}
                    style={{ background: e.status === "current" ? e.color : e.color + "bb", boxShadow: `0 0 10px ${e.color}` }} />
                </div>

                <div style={{
                  flex: 1,
                  background: e.status === "current" ? "rgba(124,77,255,0.07)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${e.status === "current" ? "rgba(124,77,255,0.3)" : "rgba(124,77,255,0.09)"}`,
                  borderRadius: 14,
                  padding: "22px 24px",
                  transition: "all 0.3s",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{e.icon}</span>
                      <div>
                        <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 16, color: "var(--text)", letterSpacing: "-0.01em" }}>{e.title}</div>
                        <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>{e.school}{e.sub ? ` · ${e.sub}` : ""}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--violet-light)", letterSpacing: "0.08em" }}>{e.period}</span>
                      {e.score && (
                        <span style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: e.color, fontWeight: 600 }}>{e.score}</span>
                      )}
                      {e.status === "current" && (
                        <span style={{ padding: "2px 9px", borderRadius: 10, background: "rgba(124,77,255,0.18)", fontFamily: "var(--mono)", fontSize: 9, color: "var(--violet-light)", letterSpacing: "0.1em" }}>ONGOING</span>
                      )}
                    </div>
                  </div>

                  {e.cgpi && (
                    <div style={{ marginTop: 18 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 12, letterSpacing: "0.12em" }}>SEMESTER-WISE CGPI</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                        {cgpiData.map((s) => (
                          <div key={s.sem} style={{
                            background: "rgba(124,77,255,0.08)",
                            border: `1px solid ${s.cgpi === 10 ? "rgba(124,77,255,0.5)" : "rgba(124,77,255,0.12)"}`,
                            borderRadius: 9,
                            padding: "10px 14px",
                            textAlign: "center",
                          }}>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--text3)", marginBottom: 6, letterSpacing: "0.08em" }}>{s.sem}</div>
                            <div style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 18, color: s.cgpi === 10 ? "#a78bfa" : "var(--text)", letterSpacing: "-0.01em" }}>{s.cgpi.toFixed(2)}</div>
                            {s.cgpi === 10 && <div style={{ fontSize: 9, color: "#a78bfa", marginTop: 2, fontFamily: "var(--mono)" }}>PERFECT</div>}
                            <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                              <div className="cgpi-bar" style={{
                                height: "100%",
                                width: `${(s.cgpi / 10) * 100}%`,
                                background: s.cgpi === 10 ? "linear-gradient(90deg, #a78bfa, #7c4dff)" : "var(--violet)",
                                borderRadius: 3,
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p style={{ marginTop: 18, fontSize: 13.5, color: "var(--text3)", lineHeight: 1.7, fontStyle: "italic" }}>
                        Currently building real-world projects and continuously learning full-stack development.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT SECTION
═══════════════════════════════════════════════════════════ */
const EMAILJS_SERVICE_ID  = "service_ix9rwi8";
const EMAILJS_TEMPLATE_ID = "template_bgsoe7g";
const EMAILJS_PUBLIC_KEY  = "RlJ_iMP8KQMdXFfVQ";

function Contact() {
  useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const contacts = [
    {
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      ),
      label: "GitHub",
      value: "github.com/mitalikhamkar",
      url: "https://github.com/mitalikhamkar",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      label: "LinkedIn",
      value: "linkedin.com/in/mitali-khamkar",
      url: "https://www.linkedin.com/in/mitali-khamkar",
    },
    {
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      ),
      label: "Phone",
      /* ✅ CHANGE 5: Fixed phone number — removed square brackets */
      value: "8850752240",
      url: "tel:+918850752240",
    },
  ];

  return (
    <section id="contact" style={{ position: "relative", zIndex: 2 }}>
      <div className="section">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Contact</div>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p style={{ color: "var(--text3)", marginTop: 14, maxWidth: 440, margin: "14px auto 0", fontSize: 15 }}>
            Open to internships, full-time roles, and exciting projects. Let's build something great together.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "start" }}>
          <div>
            <h3 className="reveal" style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.01em" }}>Get In Touch</h3>
            <p className="reveal" style={{ color: "var(--text2)", lineHeight: 1.78, fontSize: 14.5, marginBottom: 32 }}>
              Whether you have an opportunity, a project idea, or just want to say hello — my inbox is open. I'll get back to you promptly.
            </p>

            {contacts.map((c, i) => (
              <a key={c.label} href={c.url} target={c.label !== "Phone" ? "_blank" : "_self"} rel="noreferrer"
                className={`reveal reveal-delay-${i + 1}`}
                style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, textDecoration: "none", padding: "13px 18px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(124,77,255,0.09)", borderRadius: 11, transition: "all 0.3s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,77,255,0.32)"; e.currentTarget.style.background = "rgba(124,77,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(124,77,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "rgba(124,77,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--violet-light)", flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--text3)", marginBottom: 2, letterSpacing: "0.1em" }}>{c.label}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)" }}>{c.value}</div>
                </div>
                <span style={{ marginLeft: "auto", color: "var(--violet)", fontSize: 14 }}>↗</span>
              </a>
            ))}
          </div>

          <div className="reveal">
            <TiltCard>
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(124,77,255,0.13)", borderRadius: 16, padding: 30 }}>
                {status === "sent" ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ fontSize: 44, marginBottom: 14 }}>✅</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message Sent!</div>
                    <div style={{ color: "var(--text3)", fontSize: 14 }}>Thanks for reaching out. I'll reply soon!</div>
                  </div>
                ) : status === "error" ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, marginBottom: 6, color: "#e91e8c" }}>Something went wrong</div>
                    <div style={{ color: "var(--text3)", fontSize: 13 }}>Please try again or email me directly.</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 7, letterSpacing: "0.12em" }}>NAME</label>
                      <input className="contact-input" type="text" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 7, letterSpacing: "0.12em" }}>EMAIL</label>
                      <input className="contact-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 7, letterSpacing: "0.12em" }}>MESSAGE</label>
                      <textarea className="contact-input" rows={5} placeholder="Tell me about your opportunity or project..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                    </div>
                    {/* ✅ CHANGE 3: Removed EmailJS debug footer line completely */}
                    <button className="btn-primary" onClick={handleSubmit} disabled={status === "sending"}
                      style={{ width: "100%", justifyContent: "center", opacity: status === "sending" ? 0.7 : 1, cursor: status === "sending" ? "wait" : "pointer" }}>
                      {status === "sending" ? "Sending…" : "Send Message →"}
                    </button>
                  </div>
                )}
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){ #contact .section > div:last-child{grid-template-columns:1fr!important;gap:32px!important;} }
        @media(max-width:768px){
          #contact .section{padding:60px 16px;}
          #contact .section > div:last-child{grid-template-columns:1fr!important;gap:28px!important;}
          #contact h2{font-size:clamp(24px, 5vw, 36px)!important;}
          #contact h3{font-size:18px!important;}
        }
        @media(max-width:480px){
          #contact .section{padding:48px 14px;}
          #contact .section > div:last-child{gap:20px!important;}
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <>
      <footer style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(124,77,255,0.09)", padding: "36px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 3, letterSpacing: "-0.01em" }}>
              Mitali<span style={{ color: "var(--violet-light)" }}>.</span>
            </div>
            {/* ✅ CHANGE 1 (footer): Removed "Aspiring" */}
            <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text3)" }}>Full-Stack Developer</div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a href="https://github.com/mitalikhamkar" target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/mitali-khamkar" target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>

          <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text3)" }}>
            Built with <span style={{ color: "var(--violet-light)" }}>React</span> · Designed with ♥
          </div>
        </div>
      </footer>
      <style>{`
        @media (max-width: 768px) { footer { padding: 28px 16px; } footer > div { flex-direction: column; text-align: center; } }
        @media (max-width: 480px) { footer { padding: 24px 14px; } }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    document.title = "Mitali Khamkar — Full-Stack Developer";
    const t = setTimeout(() => setLoaded(true), 1600);
    return () => { clearTimeout(t); document.head.removeChild(style); };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Loader done={loaded} />
      <ScrollProgress />
      <ParticleCanvas />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}