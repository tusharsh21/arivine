// ═══════════════════════════════════════════════════════════════
// ARIVINE — Interaction & Performance Script
// Philosophy: Smooth, Silent, Intentional
// ═══════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // Performance: Preload Critical Images
    // ═══════════════════════════════════════════════════════════

    const criticalImages = [
        'hero-woman.jpg',
        'collection-1.jpg',
        'collection-2.jpg',
        'collection-3.jpg'
    ];

    function preloadImages() {
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Logo Reveal: Remove from DOM after animation
    // ═══════════════════════════════════════════════════════════

    function handleLogoReveal() {
        const logoReveal = document.getElementById('logo-reveal');

        setTimeout(() => {
            logoReveal.style.pointerEvents = 'none';

            setTimeout(() => {
                logoReveal.remove();
            }, 800);
        }, 2000);
    }

    // ═══════════════════════════════════════════════════════════
    // Smooth Scroll with Weighted Feel
    // ═══════════════════════════════════════════════════════════

    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);

                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 100;

                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Parallax Effect on Hero Image (Subtle)
    // ═══════════════════════════════════════════════════════════

    function initParallax() {
        const heroImage = document.querySelector('.hero-image');
        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.4;

            if (heroImage && scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Fade-in Sections on Scroll (Intersection Observer)
    // ═══════════════════════════════════════════════════════════

    function initScrollAnimations() {
        const sections = document.querySelectorAll('.section');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(40px)';
            section.style.transition = 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(section);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Navigation Background on Scroll
    // ═══════════════════════════════════════════════════════════

    function initNavigationScroll() {
        const navigation = document.querySelector('.navigation');
        let lastScroll = 0;
        let ticking = false;

        function updateNavigation() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navigation.style.background = 'rgba(10, 10, 10, 0.98)';
                navigation.style.backdropFilter = 'blur(10px)';
            } else {
                navigation.style.background = 'linear-gradient(to bottom, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0) 100%)';
                navigation.style.backdropFilter = 'none';
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateNavigation);
                ticking = true;
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Image Lazy Loading with Fade-in
    // ═══════════════════════════════════════════════════════════

    function initLazyLoading() {
        const images = document.querySelectorAll('img[src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Only apply fade-in if image hasn't loaded yet
                    if (!img.complete) {
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.8s ease-out';

                        img.onload = function () {
                            img.style.opacity = '1';
                        };
                    }

                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Initialize All Functions
    // ═══════════════════════════════════════════════════════════

    function init() {
        preloadImages();
        handleLogoReveal();
        initSmoothScroll();
        initParallax();
        initScrollAnimations();
        initNavigationScroll();
        initLazyLoading();
    }

    // Run on DOM Content Loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
