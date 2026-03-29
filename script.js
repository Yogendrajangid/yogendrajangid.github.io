/* ===== DOM ELEMENTS START ===== */
/* Cache references to frequently accessed DOM elements for performance */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navbar = document.querySelector('.navbar');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
/* ===== DOM ELEMENTS END ===== */


/* ===== HAMBURGER MENU START ===== */
/* Toggle mobile navigation menu open/close on hamburger button click */
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    /* Close mobile menu when any navigation link is clicked */
    navAnchors.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}
/* ===== HAMBURGER MENU END ===== */


/* ===== NAVBAR SCROLL EFFECT START ===== */
/* Add shadow to navbar when user scrolls past 50px threshold */
if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}
/* ===== NAVBAR SCROLL EFFECT END ===== */


/* ===== ACTIVE NAV LINK ON SCROLL START ===== */
/* Highlight the nav link matching the currently visible section as user scrolls */
if (navAnchors.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}
/* ===== ACTIVE NAV LINK ON SCROLL END ===== */


/* ===== SCROLL ANIMATIONS START ===== */
/* Use IntersectionObserver to trigger fade-in animations when elements enter viewport.
   Elements with data-animate attribute start hidden and become visible with CSS transitions.
   Optional data-delay attribute adds staggered timing in milliseconds. */
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.05
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

/* For elements already in viewport on load, trigger immediately.
   For off-screen elements, register them with the observer. */
document.querySelectorAll('[data-animate]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
            el.classList.add('visible');
        }, parseInt(delay) + 100);
    } else {
        observer.observe(el);
    }
});
/* ===== SCROLL ANIMATIONS END ===== */


/* ===== COUNTER ANIMATION START ===== */
/* Animate stat numbers counting up from 0 to their target value (set via data-target).
   Uses requestAnimationFrame for smooth 60fps counting over 2 seconds.
   Only triggers when the stats section scrolls into view. */
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const update = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target;
                    }
                };

                update();
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsCol = document.querySelector('.stats-col');
if (statsCol) {
    counterObserver.observe(statsCol);
}
/* ===== COUNTER ANIMATION END ===== */


/* ===== SMOOTH SCROLL START ===== */
/* Override default anchor link behavior with smooth animated scrolling.
   Accounts for fixed navbar height (70px offset) so sections aren't hidden behind it. */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
/* ===== SMOOTH SCROLL END ===== */


/* ===== FORM SUBMIT START ===== */
/* Handle contact form submission with visual feedback.
   Prevents page reload, shows "Sent!" confirmation for 2 seconds,
   then resets the form and button to original state. */
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-send');
        const originalText = btn.textContent;
        btn.textContent = 'Sent!';
        btn.style.background = 'var(--text-primary)';
        btn.style.color = 'var(--bg-primary)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'transparent';
            btn.style.color = 'var(--text-primary)';
            form.reset();
        }, 2000);
    });
}
/* ===== FORM SUBMIT END ===== */


/* ===== MAGNETIC HOVER EFFECT START ===== */
/* Apply a subtle 3D tilt effect to service cards on mouse movement.
   Calculates the mouse position relative to the card center and applies
   rotateX/rotateY transforms proportional to the offset for a magnetic feel. */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        card.style.transform = `translateY(-5px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
});
/* ===== MAGNETIC HOVER EFFECT END ===== */


/* ===== PARALLAX ON HERO IMAGE START ===== */
/* Create a subtle parallax scrolling effect on the hero profile image.
   Moves the image downward at 15% of the scroll speed for depth perception. */
window.addEventListener('scroll', () => {
    const heroImg = document.querySelector('.hero-image');
    if (heroImg) {
        const scrolled = window.scrollY;
        heroImg.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});
/* ===== PARALLAX ON HERO IMAGE END ===== */


/* ===== TAG STAGGER ANIMATION START ===== */
/* Animate skill tags appearing one by one with staggered delays (80ms apart).
   Tags start invisible and translated down, then fade in and slide up.
   Only triggers once when the skills tags container enters the viewport. */
const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const tags = entry.target.querySelectorAll('.tag');
            tags.forEach((tag, i) => {
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0)';
                }, i * 80);
            });
            tagObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsTags = document.querySelector('.skills-tags');
if (skillsTags) {
    document.querySelectorAll('.tag').forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(15px)';
        tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    tagObserver.observe(skillsTags);
}
/* ===== TAG STAGGER ANIMATION END ===== */


/* ===== DARK THEME TOGGLE START ===== */
/* Toggle between light and dark color schemes.
   Reads saved preference from localStorage on load.
   Toggles data-theme="dark" attribute on <html> element which
   activates the CSS custom property overrides defined in :root.
   Also swaps the toggle icon between moon (light) and sun (dark). */
(() => {
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!toggle || !icon) return;

    /* Load saved theme from localStorage, default to light */
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    /* Toggle theme on button click and persist choice */
    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
})();
/* ===== DARK THEME TOGGLE END ===== */


/* ===== CUSTOM CURSOR WITH TRAIL START ===== */
/* Creates a custom cursor with two elements:
   1. A small dot (6px) that directly follows the mouse, expanding to a
      transparent ring (50px) with thin border when hovering over interactive elements.
   2. A canvas-drawn trailing line that smoothly follows the cursor using
      easing interpolation between 12 trail points connected with quadratic curves.

   The cursor is disabled on touch devices and screens below 1024px.
   Trail color adapts to the current theme via CSS custom property reading. */
(() => {
    const cursor = document.getElementById('customCursor');
    const canvas = document.getElementById('cursorTrail');
    if (!cursor || !canvas) return;

    /* Disable custom cursor on touch-capable devices */
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.style.display = 'none';
        canvas.style.display = 'none';
        document.documentElement.style.cursor = 'auto';
        return;
    }

    const ctx = canvas.getContext('2d');
    let mouseX = -100, mouseY = -100;
    let isVisible = false;

    /* Trail configuration: 12 points with easing factor for smooth deceleration */
    const trail = [];
    const trailLength = 12;
    const ease = 0.45;

    /* Initialize all trail points off-screen */
    for (let i = 0; i < trailLength; i++) {
        trail.push({ x: -100, y: -100 });
    }

    /* Match canvas resolution to viewport size for crisp rendering */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* Update mouse coordinates on every mouse movement */
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            cursor.style.opacity = '1';
        }
    });

    /* Hide cursor when mouse leaves the browser window */
    document.addEventListener('mouseleave', () => {
        isVisible = false;
        cursor.style.opacity = '0';
    });

    /* Show cursor when mouse re-enters the browser window */
    document.addEventListener('mouseenter', () => {
        isVisible = true;
        cursor.style.opacity = '1';
    });

    /* List of interactive element selectors that trigger the hover ring expansion */
    const hoverTargets = 'a, button, input, textarea, .tag, .work-item, .service-card, .btn-download, .btn-send, .btn-view-more, [role="button"]';

    /* Add hover class when mouse enters an interactive element */
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            cursor.classList.add('hover');
        }
    });

    /* Remove hover class when mouse leaves an interactive element */
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            cursor.classList.remove('hover');
        }
    });

    /* Main animation loop running at 60fps via requestAnimationFrame.
       Each frame: move the cursor dot, update trail point positions with easing,
       and draw a smooth curve through all trail points on the canvas. */
    function animate() {
        /* Position the cursor dot element at the current mouse coordinates */
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';

        /* Update trail points: each point eases toward the previous point,
           creating a chain of smoothly following positions */
        trail[0].x += (mouseX - trail[0].x) * ease;
        trail[0].y += (mouseY - trail[0].y) * ease;

        for (let i = 1; i < trailLength; i++) {
            trail[i].x += (trail[i - 1].x - trail[i].x) * (ease * 0.75);
            trail[i].y += (trail[i - 1].y - trail[i].y) * (ease * 0.75);
        }

        /* Clear previous frame and draw the new trail curve */
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isVisible) {
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);

            /* Draw smooth quadratic Bezier curves through trail points.
               Control points are the trail positions, end points are midpoints
               between consecutive trail positions for a flowing organic line. */
            for (let i = 1; i < trailLength - 1; i++) {
                const xc = (trail[i].x + trail[i + 1].x) / 2;
                const yc = (trail[i].y + trail[i + 1].y) / 2;
                ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            }

            /* Read cursor color from CSS custom property to support theme switching */
            const cursorColor = getComputedStyle(document.documentElement).getPropertyValue('--cursor-color').trim();
            ctx.strokeStyle = cursorColor;
            ctx.lineWidth = 0.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
/* ===== CUSTOM CURSOR WITH TRAIL END ===== */
