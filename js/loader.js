/**
 * Header & Footer Loader
 * Dynamically loads shared header and footer components.
 */
(function () {
    'use strict';

    /**
     * Determine the correct relative path to the root folder.
     * Works for GitHub Pages and local development.
     */
    function getRootPath() {
        var path = window.location.pathname;
        var pathParts = path.split('/').filter(function (part) {
            return part.length > 0 && part !== 'index.html';
        });

        var depth = 0;

        // Check if we're inside a subfolder
        if (path.indexOf('/learningmap/') !== -1) {
            var afterLearningmap = path.split('/learningmap/')[1];
            if (afterLearningmap) {
                var parts = afterLearningmap.split('/').filter(function (p) {
                    return p.length > 0 && p !== 'index.html';
                });
                depth = parts.length;
            }
        }

        var rootPath = '';
        for (var i = 0; i < depth; i++) {
            rootPath += '../';
        }

        return rootPath || './';
    }

    var rootPath = getRootPath();

    /**
     * Load the header component
     */
    function loadHeader() {
        var headerUrl = rootPath + 'components/header.html';

        fetch(headerUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Header not found: ' + response.status);
                }
                return response.text();
            })
            .then(function (html) {
                // Replace path placeholder
                var headerHTML = html.replace(/%ROOT%/g, rootPath);

                // Insert at the very beginning of the body
                var body = document.body;
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = headerHTML;

                // Insert nodes one by one at the top of body
                var nodes = Array.prototype.slice.call(tempDiv.childNodes);
                var firstChild = body.firstChild;

                nodes.forEach(function (node) {
                    body.insertBefore(node, firstChild);
                });

                // Initialize navigation after header is loaded
                initNavigation();
            })
            .catch(function (error) {
                console.error('Failed to load header:', error);
                // Show a simple fallback message
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

        fetch(footerUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Footer not found: ' + response.status);
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
                    // Fallback: append to body
                    document.body.insertAdjacentHTML('beforeend', footerHTML);
                }
            })
            .catch(function (error) {
                console.error('Failed to load footer:', error);
            });
    }

    /**
     * Initialize all navigation functionality after header loads
     */
    function initNavigation() {
        // Set active nav link
        var currentPath = window.location.pathname;
        var navLinks = document.querySelectorAll('.nav-menu a[data-page]');
        var foundActive = false;

        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');

            if (href) {
                // Compare the end of the current path with the link's href
                var cleanHref = href.replace(/%ROOT%/g, '').replace(/^\.\.\//g, '');
                var cleanPath = currentPath.replace(/\/$/, '');

                if (cleanPath.indexOf(cleanHref) !== -1 && cleanHref.length > 0) {
                    link.classList.add('active');

                    // Highlight parent dropdown
                    var dropdown = link.closest('.nav-dropdown');
                    if (dropdown) {
                        var toggle = dropdown.querySelector('.dropdown-toggle');
                        if (toggle) {
                            toggle.classList.add('active');
                        }
                    }

                    foundActive = true;
                }
            }
        });

        // Home page special case
        if (!foundActive) {
            var homeLink = document.querySelector('.nav-menu a[data-page="home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }

        // Mobile menu
        var hamburger = document.querySelector('.hamburger');
        var navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu on link click
        document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(function (link) {
            link.addEventListener('click', function () {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            });
        });

        // Mobile dropdown toggle
        document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
            toggle.addEventListener('click', function (event) {
                if (window.innerWidth <= 768) {
                    event.preventDefault();
                    this.parentElement.classList.toggle('open');
                }
            });
        });

        // Initialize theme
        initTheme();

        // Initialize reading progress
        initReadingProgress();
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

    // Start loading
    loadHeader();
    loadFooter();
})();