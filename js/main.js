/**
 * Main JavaScript
 * Search, smooth scroll, and scroll animations.
 * Navigation and theme are handled by loader.js.
 */
(function () {
    'use strict';

    /**
     * Initialize search functionality
     */
    function initSearch() {
        var searchInput = document.getElementById('search-input');

        if (!searchInput) {
            return;
        }

        searchInput.addEventListener('input', function () {
            var query = this.value.toLowerCase().trim();
            var cards = document.querySelectorAll('.resource-card');

            cards.forEach(function (card) {
                var text = card.textContent.toLowerCase();
                card.style.display = (query === '' || text.includes(query)) ? '' : 'none';
            });
        });
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (event) {
                event.preventDefault();

                var target = document.querySelector(this.getAttribute('href'));

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Initialize scroll-triggered fade-in animations
     */
    function initScrollAnimations() {
        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Wait for header to load before observing elements
        setTimeout(function () {
            var elements = document.querySelectorAll(
                '.card, .resource-card, .tool-container, .timeline-content'
            );

            elements.forEach(function (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease';
                observer.observe(el);
            });
        }, 500);
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        initSearch();
        initSmoothScroll();
        initScrollAnimations();
    });
})();