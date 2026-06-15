/* ================================================
   DIOD STUDIO — script.js
   Performance-first: IntersectionObserver,
   passive listeners, RAF-throttled cursor
================================================ */

/* ── Custom Cursor ── */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    }, { passive: true });

    const lerp = (a, b, t) => a + (b - a) * t;

    function animateCursor() {
        ringX = lerp(ringX, mouseX, 0.13);
        ringY = lerp(ringY, mouseY, 0.13);
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
        rafId = requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll('a, button, .pre-card, .wedding-card, .birthday-card, .reel-card, .pov-card, .service-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
}

/* ── Sticky Nav ── */
const nav = document.querySelector('nav');

const navObserver = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('scrolled', !entry.isIntersecting),
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
);

const heroSection = document.querySelector('.hero');
if (heroSection) navObserver.observe(heroSection);

/* ── Mobile Menu ── */
const toggle     = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (toggle && mobileMenu) {
    function openMenu() {
        toggle.classList.add('open');
        mobileMenu.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () =>
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
    );

    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });
}

/* ── IntersectionObserver Reveal ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-clip, .reveal-fade');

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target); // fire once
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ── Image shimmer: mark loaded ── */
document.querySelectorAll('.pre-card img').forEach(img => {
    if (img.complete) {
        img.closest('.pre-card')?.classList.add('loaded');
    } else {
        img.addEventListener('load', () => img.closest('.pre-card')?.classList.add('loaded'));
    }
});

/* ── Lazy load images ── */
if ('loading' in HTMLImageElement.prototype) {
    // native lazy load — handled in HTML
} else {
    // fallback polyfill via IntersectionObserver
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const lazyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) img.src = img.dataset.src;
                lazyObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });
    lazyImgs.forEach(img => lazyObserver.observe(img));
}

/* ── Count-up numbers ── */
function countUp(el) {
    const target = parseFloat(el.dataset.target || el.textContent) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const value = Math.round(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.count-up');
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

/* ── Marquee pause on hover ── */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
    marqueeTrack.parentElement.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.parentElement.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
    });
}

/* ── Performance: pause off-screen videos ── */
const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('video[autoplay]').forEach(v => videoObserver.observe(v));
