/**
 * Header & Footer Loader
 * Dynamically loads the shared header and footer components
 * and initializes navigation, theme, and reading progress.
 */
(function () {
    'use strict';

    // Determine relative path to root based on current page depth
    const pathDepth = (window.location.pathname.match(/\//g) || []).length;
    const rootPath = '../'.repeat(Math.max(0, pathDepth - 1)) || './';

    /**
     * Load header component
     */
    function loadHeader() {
        fetch(rootPath + 'components/header.html')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load header: ' + response.status);
                }
                return response.text();
            })
            .then(function (html) {
                var headerHTML = html.replace(/%ROOT%/g, rootPath);
                document.body.insertAdjacentHTML('afterbegin', headerHTML);
                setActiveNavLink();
                initNavListeners();
                initTheme();
                initReadingProgress();
            })
            .catch(function (error) {
                console.error('Header load error:', error);
            });
    }

    /**
     * Load footer component
     */
    function loadFooter() {
        fetch(rootPath + 'components/footer.html')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load footer: ' + response.status);
                }
                return response.text();
            })
            .then(function (html) {
                var footerHTML = html.replace(/%ROOT%/g, rootPath);
                var placeholder = document.getElementById('footer-placeholder');

                if (placeholder) {
                    placeholder.insertAdjacentHTML('beforebegin', footerHTML);
                    placeholder.remove();
                }
            })
            .catch(function (error) {
                console.error('Footer load error:', error);
            });
    }

    /**
     * Highlight the current page in the navigation
     */
    function setActiveNavLink() {
        var currentPath = window.location.pathname;
        var navLinks = document.querySelectorAll('.nav-menu a[data-page]');
        var foundActive = false;

        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');

            if (href && currentPath.endsWith(href.replace(/^.*\//, '/').replace(/\/$/, ''))) {
                link.classList.add('active');

                // Highlight parent dropdown toggle
                var dropdown = link.closest('.nav-dropdown');
                if (dropdown) {
                    dropdown.querySelector('.dropdown-toggle').classList.add('active');
                }

                foundActive = true;
            }
        });

        // Home page special case
        if (!foundActive && (
            currentPath.endsWith('index.html') ||
            currentPath.endsWith('learningmap/') ||
            currentPath.endsWith('learningmap')
        )) {
            var homeLink = document.querySelector('.nav-menu a[data-page="home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }

    /**
     * Initialize mobile menu and dropdown listeners
     */
    function initNavListeners() {
        var hamburger = document.querySelector('.hamburger');
        var navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking a non-dropdown link
        document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(function (link) {
            link.addEventListener('click', function () {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            });
        });

        // Mobile dropdown toggle (click instead of hover)
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
     * Initialize dark/light theme
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
     * Initialize reading progress bar
     */
    function initReadingProgress() {
        window.addEventListener('scroll', function () {
            var progressBar = document.getElementById('reading-progress');

            if (progressBar) {
                var windowHeight = document.documentElement.scrollHeight - window.innerHeight;
                var scrolled = (window.scrollY / windowHeight) * 100;
                progressBar.style.width = Math.min(scrolled, 100) + '%';
            }
        });
    }

    // Start loading components
    loadHeader();
    loadFooter();
})();