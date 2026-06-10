/**
 * Header & Footer Loader
 * Dynamically loads shared header and footer components.
 * Works for all page depths within the learningmap folder.
 */
(function () {
    'use strict';

    /**
     * Determine the correct relative path to the root folder.
     */
    function getRootPath() {
        var path = window.location.pathname;

        // Remove trailing slash and index.html
        path = path.replace(/\/$/, '').replace(/\/index\.html$/, '');

        // Find the learningmap folder position
        var learningmapIndex = path.indexOf('/learningmap');

        if (learningmapIndex === -1) {
            // Not inside learningmap folder
            return './';
        }

        // Get everything after /learningmap/
        var afterLearningmap = path.substring(learningmapIndex + '/learningmap'.length);

        // Remove leading slash
        afterLearningmap = afterLearningmap.replace(/^\//, '');

        // If empty, we're at the root
        if (afterLearningmap.length === 0) {
            return './';
        }

        // Count subfolders
        var parts = afterLearningmap.split('/');
        var depth = parts.length;

        // Build relative path
        var rootPath = '';
        for (var i = 0; i < depth; i++) {
            rootPath += '../';
        }

        return rootPath;
    }

    /**
     * Log the detected path for debugging
     */
    function debugPath() {
        var path = window.location.pathname;
        var rootPath = getRootPath();
        console.log('Loader: Current path = ' + path);
        console.log('Loader: Root path = ' + rootPath);
        console.log('Loader: Header URL = ' + rootPath + 'components/header.html');
        console.log('Loader: Footer URL = ' + rootPath + 'components/footer.html');
    }

    var rootPath = getRootPath();
    debugPath();

    /**
     * Load the header component
     */
    function loadHeader() {
        var headerUrl = rootPath + 'components/header.html';

        return fetch(headerUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Header not found: HTTP ' + response.status + ' at ' + headerUrl);
                }
                return response.text();
            })
            .then(function (html) {
                var headerHTML = html.replace(/%ROOT%/g, rootPath);
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = headerHTML;

                var nodes = Array.prototype.slice.call(tempDiv.childNodes);
                var firstChild = document.body.firstChild;

                nodes.forEach(function (node) {
                    document.body.insertBefore(node, firstChild);
                });

                initNavigation();
                console.log('Loader: Header loaded successfully');
            })
            .catch(function (error) {
                console.error('Loader: Header load failed - ' + error.message);
                document.body.insertAdjacentHTML('afterbegin',
                    '<div style="background: var(--danger); color: white; text-align: center; padding: 0.5rem; font-size: 0.85rem;">' +
                    'Navigation failed to load. <a href="' + rootPath + 'index.html" style="color: white; text-decoration: underline;">Go to Home</a>' +
                    '</div>'
                );
            });
    }

    /**
     * Load the footer component
     */
    function loadFooter() {
        var footerUrl = rootPath + 'components/footer.html';

        return fetch(footerUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Footer not found: HTTP ' + response.status + ' at ' + footerUrl);
                }
                return response.text();
            })
            .then(function (html) {
                var footerHTML = html.replace(/%ROOT%/g, rootPath);
                var placeholder = document.getElementById('footer-placeholder');

                if (placeholder) {
                    placeholder.insertAdjacentHTML('beforebegin', footerHTML);
                    placeholder.remove();
                } else {
                    document.body.insertAdjacentHTML('beforeend', footerHTML);
                }

                console.log('Loader: Footer loaded successfully');
            })
            .catch(function (error) {
                console.error('Loader: Footer load failed - ' + error.message);
            });
    }

    /**
     * Initialize navigation, theme, and progress bar
     */
    function initNavigation() {
        setActiveNavLink();
        initMobileMenu();
        initDropdowns();
        initTheme();
        initReadingProgress();
    }

    /**
     * Set the active class on the current page's nav link
     */
    function setActiveNavLink() {
        var currentPath = window.location.pathname;
        var allLinks = document.querySelectorAll('.nav-menu a[data-page]');
        var foundActive = false;

        // First pass: exact match
        allLinks.forEach(function (link) {
            var href = link.getAttribute('href');

            if (!href) return;

            // Build the absolute path this link points to
            var absolutePath = resolvePath(rootPath, href);

            if (currentPath === absolutePath || currentPath === absolutePath.replace(/\/$/, '')) {
                activateLink(link);
                foundActive = true;
            }
        });

        // Second pass: partial match (for index pages)
        if (!foundActive) {
            allLinks.forEach(function (link) {
                var href = link.getAttribute('href');

                if (!href) return;

                var absolutePath = resolvePath(rootPath, href);

                if (currentPath.indexOf(absolutePath.replace(/\/index\.html$/, '').replace(/\/$/, '')) !== -1 &&
                    absolutePath.length > 1) {
                    activateLink(link);
                    foundActive = true;
                }
            });
        }

        // Fallback: highlight Home
        if (!foundActive) {
            var homeLink = document.querySelector('.nav-menu a[data-page="home"]');
            if (homeLink) {
                activateLink(homeLink);
            }
        }
    }

    /**
     * Activate a nav link and its parent dropdown
     */
    function activateLink(link) {
        link.classList.add('active');

        var dropdown = link.closest('.nav-dropdown');
        if (dropdown) {
            var toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.classList.add('active');
            }
        }
    }

    /**
     * Resolve a relative path to an absolute path
     */
    function resolvePath(basePath, relativePath) {
        // Remove %ROOT% placeholder if present
        var cleanRelative = relativePath.replace(/%ROOT%/g, '');

        // If it starts with ../ or ./, resolve relative to rootPath
        if (cleanRelative.indexOf('../') === 0 || cleanRelative.indexOf('./') === 0) {
            var combined = basePath + cleanRelative;
            // Normalize path
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

        return cleanRelative;
    }

    /**
     * Initialize mobile hamburger menu
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
     * Initialize dropdown toggles for mobile
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

                if (windowHeight > 0) {
                    var scrolled = (window.scrollY / windowHeight) * 100;
                    progressBar.style.width = Math.min(scrolled, 100) + '%';
                }
            }
        });
    }

    /**
     * Wait for DOM to be ready, then load components
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                Promise.all([loadHeader(), loadFooter()]).then(function () {
                    console.log('Loader: All components loaded');
                });
            });
        } else {
            Promise.all([loadHeader(), loadFooter()]).then(function () {
                console.log('Loader: All components loaded');
            });
        }
    }

    init();
})();