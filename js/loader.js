/**
 * Header & Footer Loader
 * Dynamically loads shared components from the correct relative path.
 */
(function () {
    'use strict';

    /**
     * Calculate the relative path to the learningmap root
     */
    function getRootPath() {
        var path = window.location.pathname;

        // Normalize
        path = path.replace(/\/index\.html$/, '').replace(/\/$/, '');

        // Find /learningmap position
        var learningmapIndex = path.indexOf('/learningmap');

        if (learningmapIndex === -1) {
            return './';
        }

        // Get everything after /learningmap
        var after = path.substring(learningmapIndex + '/learningmap'.length);
        after = after.replace(/^\//, '');

        if (after.length === 0) {
            return './';
        }

        // Count directories
        var parts = after.split('/').filter(function (p) {
            return p.length > 0;
        });

        var rootPath = '';
        for (var i = 0; i < parts.length; i++) {
            rootPath += '../';
        }

        console.log('Loader: path=' + path + ' | after=' + after + ' | depth=' + parts.length + ' | root=' + rootPath);
        return rootPath || './';
    }

    var rootPath = getRootPath();
    var headerUrl = rootPath + 'components/header.html';
    var footerUrl = rootPath + 'components/footer.html';

    console.log('Loader: Header URL = ' + headerUrl);
    console.log('Loader: Footer URL = ' + footerUrl);

    /**
     * Load header
     */
    function loadHeader() {
        return fetch(headerUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Header not found: HTTP ' + response.status + ' — ' + headerUrl);
                }
                return response.text();
            })
            .then(function (html) {
                var finalHTML = html.replace(/%ROOT%/g, rootPath);
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = finalHTML;

                var nodes = Array.prototype.slice.call(tempDiv.childNodes);
                var firstChild = document.body.firstChild;

                nodes.forEach(function (node) {
                    document.body.insertBefore(node, firstChild);
                });

                // Init nav after header is in DOM
                initNavigation();
                console.log('Loader: Header loaded ✓');
            })
            .catch(function (error) {
                console.error('Loader: ' + error.message);
                document.body.insertAdjacentHTML('afterbegin',
                    '<div style="background:var(--danger);color:#fff;text-align:center;padding:0.75rem;font-size:0.85rem;">' +
                    '⚠ Navigation failed to load. <a href="' + rootPath + 'index.html" style="color:#fff;text-decoration:underline;">Go to Home</a>' +
                    '</div>'
                );
            });
    }

    /**
     * Load footer
     */
    function loadFooter() {
        return fetch(footerUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Footer not found: HTTP ' + response.status + ' — ' + footerUrl);
                }
                return response.text();
            })
            .then(function (html) {
                var finalHTML = html.replace(/%ROOT%/g, rootPath);
                var placeholder = document.getElementById('footer-placeholder');

                if (placeholder) {
                    placeholder.insertAdjacentHTML('beforebegin', finalHTML);
                    placeholder.remove();
                } else {
                    document.body.insertAdjacentHTML('beforeend', finalHTML);
                }

                console.log('Loader: Footer loaded ✓');
            })
            .catch(function (error) {
                console.error('Loader: ' + error.message);
            });
    }

    /**
     * Initialize everything after header loads
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
        var currentPath = window.location.pathname.replace(/\/$/, '');
        var allLinks = document.querySelectorAll('.nav-menu a[data-page]');
        var bestMatch = null;

        allLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;

            // Build what this link actually points to
            var resolved = resolveUrl(rootPath, href).replace(/\/$/, '');

            if (currentPath === resolved) {
                bestMatch = link;
            }
        });

        // If no exact match, try home
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
     * Resolve a relative URL to absolute
     */
    function resolveUrl(base, relative) {
        var combined = base + relative.replace(/%ROOT%/g, '');
        var parts = combined.split('/');
        var result = [];

        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === '..') {
                result.pop();
            } else if (parts[i] !== '.' && parts[i] !== '') {
                result.push(parts[i]);
            }
        }

        return '/' + result.join('/');
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
     * Mobile dropdown toggles
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

    /**
     * Start loading when DOM is ready
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