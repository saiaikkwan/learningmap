// ===== Header & Footer Loader =====

// Determine page depth relative to root
const pathDepth = (window.location.pathname.match(/\//g) || []).length;
const rootPath = '../'.repeat(Math.max(0, pathDepth - 1)) || './';

// Load header
fetch(rootPath + 'components/header.html')
    .then(res => res.text())
    .then(html => {
        // Replace %ROOT% with correct relative path
        const headerHTML = html.replace(/%ROOT%/g, rootPath);
        
        // Insert after body tag
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        
        // Set active nav link
        setActiveNavLink();
        
        // Re-initialize mobile menu and dropdown listeners
        initNavListeners();
        
        // Re-initialize theme
        initTheme();
    });

// Load footer
fetch(rootPath + 'components/footer.html')
    .then(res => res.text())
    .then(html => {
        const footerHTML = html.replace(/%ROOT%/g, rootPath);
        document.getElementById('footer-placeholder').insertAdjacentHTML('beforebegin', footerHTML);
    });

// Set active class on current page
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a[data-page]');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href.replace(/^.*\//, '/'))) {
            link.classList.add('active');
            
            // Also highlight parent dropdown toggle
            const dropdown = link.closest('.nav-dropdown');
            if (dropdown) {
                dropdown.querySelector('.dropdown-toggle').classList.add('active');
            }
        }
    });
}

// Initialize navbar event listeners
function initNavListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click (not dropdown toggles)
    document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Mobile dropdown toggle
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.parentElement.classList.toggle('open');
            }
        });
    });
}

// Initialize theme
function initTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    if (themeIcon) {
        themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            if (themeIcon) {
                themeIcon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }
}