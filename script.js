/* =====================================================
   PORTFOLIO — SCRIPT.JS
   Professional, clean, well-organized JavaScript
===================================================== */

'use strict';

/* ─────────────────────────────────────────────────
   THEME MANAGEMENT
───────────────────────────────────────────────── */
const ThemeManager = (() => {
    const THEME_KEY = 'portfolio_theme';
    const body = document.body;
    const toggle = document.getElementById('themeToggle');
    const icon = toggle?.querySelector('.theme-icon');

    const apply = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            if (icon) icon.textContent = '☀️';
        } else {
            body.classList.remove('light-theme');
            if (icon) icon.textContent = '🌙';
        }
    };

    const init = () => {
        const saved = localStorage.getItem(THEME_KEY) || 'dark';
        apply(saved);

        toggle?.addEventListener('click', () => {
            const isLight = body.classList.contains('light-theme');
            const next = isLight ? 'dark' : 'light';
            apply(next);
            localStorage.setItem(THEME_KEY, next);
        });
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────── */
const NavManager = (() => {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let lastScroll = 0;
    let ticking = false;

    const updateScrollState = () => {
        const scrollY = window.scrollY;

        // Add scrolled class for background
        if (scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (scrollY > lastScroll && scrollY > 200) {
            navbar?.style && (navbar.style.transform = 'translateY(-100%)');
        } else {
            navbar?.style && (navbar.style.transform = 'translateY(0)');
        }

        lastScroll = scrollY;
        ticking = false;
    };

    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    const init = () => {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollState();
                    updateActiveLink();
                });
                ticking = true;
            }
        }, { passive: true });

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const top = target.offsetTop - 72;
                window.scrollTo({ top, behavior: 'smooth' });

                // Close mobile menu if open
                MobileMenu?.close();
            });
        });
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────────── */
const MobileMenu = (() => {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    let isOpen = false;

    const open = () => {
        isOpen = true;
        menu?.classList.add('open');
        document.body.style.overflow = 'hidden';
        hamburger?.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
        isOpen = false;
        menu?.classList.remove('open');
        document.body.style.overflow = '';
        hamburger?.setAttribute('aria-expanded', 'false');
    };

    const toggle = () => (isOpen ? close() : open());

    const init = () => {
        hamburger?.addEventListener('click', toggle);
        menu?.addEventListener('click', e => {
            if (e.target.tagName === 'A') close();
        });
    };

    return { init, close };
})();


/* ─────────────────────────────────────────────────
   SCROLL REVEAL ANIMATIONS
───────────────────────────────────────────────── */
const ScrollReveal = (() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const init = () => {
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));

        // Reveal anything already in the viewport immediately
        setTimeout(() => {
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('in-view');
                }
            });
        }, 100);
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   PARALLAX BACKGROUND ORBS
───────────────────────────────────────────────── */
const ParallaxOrbs = (() => {
    const orbs = document.querySelectorAll('.orb');

    const init = () => {
        window.addEventListener('mousemove', e => {
            const cx = e.clientX / window.innerWidth - 0.5;
            const cy = e.clientY / window.innerHeight - 0.5;

            orbs.forEach((orb, i) => {
                const factor = (i + 1) * 18;
                orb.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
            });
        }, { passive: true });
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   PROJECT CARD 3D TILT
───────────────────────────────────────────────── */
const CardTilt = (() => {
    const init = () => {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const rx = ((y - r.height / 2) / r.height) * 8;
                const ry = ((r.width / 2 - x) / r.width) * 8;
                card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   RIPPLE EFFECT
───────────────────────────────────────────────── */
const RippleEffect = (() => {
    const createRipple = (btn, e) => {
        const r = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        Object.assign(ripple.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${e.clientX - r.left - size / 2}px`,
            top: `${e.clientY - r.top - size / 2}px`,
        });
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    };

    const init = () => {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', e => createRipple(btn, e));
        });
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   DOWNLOAD CV
───────────────────────────────────────────────── */
const CVDownload = (() => {
    const init = () => {
        const btn = document.getElementById('downloadCV');
        btn?.addEventListener('click', e => {
            e.preventDefault();
            const a = document.createElement('a');
            a.href = 'assets/cv/Abdelrahman_Ezzeldean_Flutter_Developer_Junior.pdf';
            a.download = 'Abdelrahman_Ezzeldean_Flutter_Developer.pdf';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => a.remove(), 100);
        });
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   SKILL TAG INTERACTIONS
───────────────────────────────────────────────── */
const SkillTags = (() => {
    const init = () => {
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.08) translateY(-2px)';
            });
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
            });
        });
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   LOAD ANIMATION
───────────────────────────────────────────────── */
const LoadAnim = (() => {
    const init = () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        window.addEventListener('load', () => {
            requestAnimationFrame(() => {
                document.body.style.opacity = '1';
                document.body.classList.add('loaded');
            });
        });
    };

    return { init };
})();


/* ─────────────────────────────────────────────────
   CONSOLE EASTER EGG
───────────────────────────────────────────────── */
const devGreeting = () => {
    console.log(
        '%c 👋 Hey Developer! ',
        'background: linear-gradient(135deg,#0A84FF,#00D4FF); color:white; font-size:18px; font-weight:bold; border-radius:8px; padding:8px 16px;'
    );
    console.log('%cInterested in how this was built?', 'font-size:14px; color:#8B9DC3;');
    console.log('%c→ github.com/AbdelrahmanAddel', 'font-size:13px; color:#0A84FF; font-weight:600;');
};


/* ─────────────────────────────────────────────────
   BOOT — INIT ALL MODULES
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    LoadAnim.init();
    ThemeManager.init();
    NavManager.init();
    MobileMenu.init();
    ScrollReveal.init();
    ParallaxOrbs.init();
    CardTilt.init();
    RippleEffect.init();
    CVDownload.init();
    SkillTags.init();
    devGreeting();
});