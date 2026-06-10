/**
 * Header & Footer Loader
 * Loads header.html and footer.html from the learningmap root folder.
 * Initializes navigation, theme, mobile menu, and reading progress.
 */
(function () {
    'use strict';

    // Absolute paths from domain root — always works from any page depth
    var headerUrl = '/learningmap/header.html';
    var footerUrl = '/learningmap/footer.html';

    console.log('Loader: Loading header from ' + headerUrl);
    console.log('Loader: Loading footer from ' + footerUrl);

    /**
     * Load header component
     */
    function loadHeader() {
        return fetch(headerUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Header not found: HTTP ' + response.status);
                }
                return response.text();
            })
            .then(function (html) {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                var nodes = Array.prototype.slice.call(tempDiv.childNodes);
                var firstChild = document.body.firstChild;

                nodes.forEach(function (node) {
                    document.body.insertBefore(node, firstChild);
                });

                initNavigation();
                console.log('Loader: Header loaded');
            })
            .catch(function (error) {
                console.error('Loader: ' + error.message);
            });
    }

    /**
     * Load footer component
     */
    function loadFooter() {
        return fetch(footerUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Footer not found: HTTP ' + response.status);
                }
                return response.text();
            })
            .then(function (html) {
                var placeholder = document.getElementById('footer-placeholder');

                if (placeholder) {
                    placeholder.insertAdjacentHTML('beforebegin', html);
                    placeholder.remove();
                } else {
                    document.body.insertAdjacentHTML('beforeend', html);
                }

                console.log('Loader: Footer loaded');
            })
            .catch(function (error) {
                console.error('Loader: ' + error.message);
            });
    }

    /**
     * Initialize all navigation functionality after header loads
     */
    function initNavigation() {
        setActiveNav();
        initMobileMenu();
        initDropdowns();
        initTheme();
        initProgressBar();
    }

    /**
     * Highlight current page in the navigation
     */
    function setActiveNav() {
        var currentPath = window.location.pathname;
        var allLinks = document.querySelectorAll('.nav-menu a[data-page]');
        var bestMatch = null;

        allLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;

            // Build absolute path from the href
            var absolute = new URL(href, window.location.origin + '/learningmap/').pathname;

            if (currentPath === absolute || currentPath === absolute.replace(/\/$/, '')) {
                bestMatch = link;
            }
        });

        // Fallback to home link
        if (!bestMatch) {
            bestMatch = document.querySelector('.nav-menu a[data-page="home"]');
        }

        if (bestMatch) {
            bestMatch.classList.add('active');

            // Highlight parent dropdown toggle
            var dropdown = bestMatch.closest('.nav-dropdown');
            if (dropdown) {
                var toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.classList.add('active');
                }
            }
        }
    }

    /**
     * Mobile hamburger menu toggle
     */
    function initMobileMenu() {
        var hamburger = document.querySelector('.hamburger');
        var navMenu = document.querySelector('.nav-menu');

        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a non-dropdown link
        document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /**
     * Mobile dropdown toggle (click instead of hover)
     */
    function initDropdowns() {
        document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
            toggle.addEventListener('click', function (event) {
                if (window.innerWidth <= 768) {
                    event.preventDefault();
                    this.parentElement.classList.toggle('open');
                }
            });
        });
    }

    /**
     * Dark/light theme toggle with rotation animation
     */
    function initTheme() {
        var html = document.documentElement;
        var themeToggle = document.getElementById('theme-toggle');
        var themeIcon = document.getElementById('theme-icon');
        var savedTheme = localStorage.getItem('theme') || 'dark';

        // Apply saved theme
        html.setAttribute('data-theme', savedTheme);

        // Set initial icon
        if (themeIcon) {
            themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Toggle click handler
        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                var current = html.getAttribute('data-theme');
                var next = current === 'light' ? 'dark' : 'light';

                // Trigger rotation animation
                themeToggle.classList.add('rotating');

                // Remove rotation class after animation completes
                setTimeout(function () {
                    themeToggle.classList.remove('rotating');
                }, 500);

                // Apply new theme
                html.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);

                // Swap icon at halfway point of rotation
                if (themeIcon) {
                    setTimeout(function () {
                        themeIcon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
                    }, 250);
                }
            });
        }
    }

    /**
     * Reading progress bar
     */
    function initProgressBar() {
        window.addEventListener('scroll', function () {
            var bar = document.getElementById('reading-progress');

            if (!bar) return;

            var totalHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (totalHeight > 0) {
                var scrolled = (window.scrollY / totalHeight) * 100;
                bar.style.width = Math.min(scrolled, 100) + '%';
            }
        });
    }

    /**
     * Start loading components when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                Promise.all([loadHeader(), loadFooter()]);
            });
        } else {
            Promise.all([loadHeader(), loadFooter()]);
        }
    }

    init();
})();