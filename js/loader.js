/**
 * Header & Footer Loader
 * Loads header.html and footer.html from the learningmap root folder.
 */
(function () {
    'use strict';

    // Absolute paths from domain root — always works from any page depth
    var headerUrl = '/learningmap/header.html';
    var footerUrl = '/learningmap/footer.html';

    console.log('Loader: Loading header from ' + headerUrl);
    console.log('Loader: Loading footer from ' + footerUrl);

    /**
     * Load header
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
     * Load footer
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
     * Initialize navigation after header loads
     */
    function initNavigation() {
        setActiveNav();
        initMobileMenu();
        initDropdowns();
        initTheme();
        initProgressBar();
    }

    /**
     * Highlight current page in nav
     */
    function setActiveNav() {
        var currentPath = window.location.pathname;
        var allLinks = document.querySelectorAll('.nav-menu a[data-page]');
        var bestMatch = null;

        allLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;

            // Build absolute path
            var absolute = new URL(href, window.location.origin + '/learningmap/').pathname;

            if (currentPath === absolute || currentPath === absolute.replace(/\/$/, '')) {
                bestMatch = link;
            }
        });

        if (!bestMatch) {
            bestMatch = document.querySelector('.nav-menu a[data-page="home"]');
        }

        if (bestMatch) {
            bestMatch.classList.add('active');

            var dropdown = bestMatch.closest('.nav-dropdown');
            if (dropdown) {
                var toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        }
    }

    /**
     * Mobile hamburger menu
     */
    function initMobileMenu() {
        var hamburger = document.querySelector('.hamburger');
        var navMenu = document.querySelector('.nav-menu');
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /**
     * Mobile dropdowns
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
     * Dark/light theme
     */
    function initTheme() {
        var html = document.documentElement;
        var themeToggle = document.getElementById('theme-toggle');
        var themeIcon = document.getElementById('theme-icon');
        var savedTheme = localStorage.getItem('theme') || 'dark';

        html.setAttribute('data-theme', savedTheme);

        if (themeIcon) {
            themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                var current = html.getAttribute('data-theme');
                var next = current === 'light' ? 'dark' : 'light';
                html.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                if (themeIcon) {
                    themeIcon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
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
            var total = document.documentElement.scrollHeight - window.innerHeight;
            if (total > 0) {
                bar.style.width = Math.min((window.scrollY / total) * 100, 100) + '%';
            }
        });
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            Promise.all([loadHeader(), loadFooter()]);
        });
    } else {
        Promise.all([loadHeader(), loadFooter()]);
    }
})();