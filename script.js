document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════════════════
       CINEMATIC INTRO
    ══════════════════════════════════════════ */
    const intro = document.getElementById('intro');
    if (intro) {
        // Wait for bar animation + brief hold, then exit
        setTimeout(() => {
            intro.classList.add('intro-exit');
            // Remove from DOM after transition
            setTimeout(() => {
                intro.style.display = 'none';
            }, 700);
        }, 3000);
    }

    /* ══════════════════════════════════════════
       NAVBAR SCROLL EFFECT
    ══════════════════════════════════════════ */
    const nav = document.getElementById('nav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ══════════════════════════════════════════
       MOBILE HAMBURGER
    ══════════════════════════════════════════ */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            mobileNav.classList.toggle('open', !isOpen);
            mobileNav.style.display = isOpen ? 'none' : 'flex';
            hamburger.setAttribute('aria-expanded', String(!isOpen));
        });
        // Close on link click
        mobileNav.querySelectorAll('.mob-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                mobileNav.style.display = 'none';
            });
        });
    }

    /* ══════════════════════════════════════════
       SCROLL-TRIGGERED SECTION ANIMATIONS
    ══════════════════════════════════════════ */
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.section-anim').forEach(el => {
        sectionObserver.observe(el);
    });

    /* ══════════════════════════════════════════
       MISSION CARD PROGRESS BARS
       Animate widths when cards become visible
    ══════════════════════════════════════════ */
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.mc-fill');
                if (fill) {
                    const target = fill.style.width;
                    fill.style.width = '0%';
                    requestAnimationFrame(() => {
                        setTimeout(() => { fill.style.width = target; }, 100);
                    });
                }
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.mission-card').forEach(card => barObserver.observe(card));

    /* ══════════════════════════════════════════
       3D TILT EFFECT
    ══════════════════════════════════════════ */
    const tiltTargets = [
        '.hero-card',
        '.mission-card',
        '.skill-group',
        '.minor-card',
        '.cert-card',
        '.jt-content'
    ];

    tiltTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rx = ((y - cy) / cy) * -6;
                const ry = ((x - cx) / cx) * 6;
                el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.015, 1.015, 1.015)`;
                el.style.transition = 'none';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
                el.style.transition = 'transform 0.5s cubic-bezier(0.25,1,0.5,1)';
            });
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'transform 0.15s cubic-bezier(0.25,1,0.5,1)';
            });
        });
    });

    /* ══════════════════════════════════════════
       ACTIVE NAV LINK (scroll spy)
    ══════════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => {
                    a.classList.toggle(
                        'active',
                        a.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(s => spyObserver.observe(s));

    /* ══════════════════════════════════════════
       SMOOTH MAGNETIC BUTTON EFFECT
    ══════════════════════════════════════════ */
    document.querySelectorAll('.btn-primary, .nav-cta, .csoc').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ══════════════════════════════════════════
       HERO MOUSE-FOLLOW SPOTLIGHT
    ══════════════════════════════════════════ */
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            hero.style.setProperty('--mx', `${x}%`);
            hero.style.setProperty('--my', `${y}%`);
        });
    }

    /* ══════════════════════════════════════════
       STAGGERED REVEAL FOR CHILD ELEMENTS
    ══════════════════════════════════════════ */
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    child.style.animationDelay = `${i * 0.08}s`;
                    child.classList.add('stagger-in');
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.mission-grid, .skills-grid, .cert-cards, .projects-minor-grid').forEach(el => {
        staggerObserver.observe(el);
    });

});

/* CSS for stagger animation — injected from JS */
const style = document.createElement('style');
style.textContent = `
.stagger-in {
    animation: staggerReveal 0.6s cubic-bezier(0.25, 1, 0.5, 1) both;
}
@keyframes staggerReveal {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
.nav-links a.active {
    color: var(--text) !important;
}
.nav-links a.active::after {
    width: 100%;
}
`;
document.head.appendChild(style);