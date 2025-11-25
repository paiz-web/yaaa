// ============================
// EDUFUTURE - MAIN JAVASCRIPT
// ============================
console.log('🔧 Loading EduFuture JavaScript...');

// Global variables
let starCreationInterval;

// Tunggu sampai DOM siap
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Ready - Initializing application...');
    
    initializeDarkMode();
    initializeMobileMenu();
    initializePageNavigation();
    initializeContactForm();
    initializeStars();
    initializePlanetSystem();
    handlePlanetResponsive();
    injectCSSFixes();
    
    console.log('🎉 All components initialized successfully!');
});

// ==================== DARK MODE FUNCTION ====================
function initializeDarkMode() {
    const darkModeBtn = document.getElementById('themeToggle');
    if (darkModeBtn) {
        console.log('✅ Found dark mode button');
        
        // Set initial state
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeBtn.textContent = '☀️';
            createRealisticStars(); // Create stars immediately if dark mode
        } else {
            darkModeBtn.textContent = '🌙';
        }
        
        // Click event
        darkModeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🌙 Dark mode button clicked!');
            
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                this.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
                console.log('Changed to DARK mode');
                
                // Create stars when switching to dark mode
                setTimeout(() => {
                    createRealisticStars();
                }, 300);
            } else {
                this.textContent = '🌙';
                localStorage.setItem('theme', 'light');
                console.log('Changed to LIGHT mode');
                
                // Clear stars when switching to light mode
                clearStarCreationInterval();
                const starField = document.querySelector('.star-field');
                if (starField) {
                    starField.innerHTML = '';
                }
            }
            return false;
        };
        
        darkModeBtn.style.cursor = 'pointer';
    } else {
        console.log('❌ Dark mode button not found');
    }
}

// ==================== MOBILE MENU FUNCTION ====================
function initializeMobileMenu() {
    const menuBtn = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('navOverlay');
    const closeBtn = document.getElementById('closeBtn');
    
    if (menuBtn && mobileNav && overlay && closeBtn) {
        console.log('✅ Found all mobile menu elements');
        
        function openMenu() {
            console.log('📱 Opening menu');
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Hamburger to X animation
            const spans = menuBtn.querySelectorAll('span');
            if (spans.length === 3) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            }
        }
        
        function closeMenu() {
            console.log('📱 Closing menu');
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // X to hamburger animation
            const spans = menuBtn.querySelectorAll('span');
            if (spans.length === 3) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
        
        // Event listeners
        menuBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (mobileNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
            return false;
        };
        
        closeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            return false;
        };
        
        overlay.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            return false;
        };
        
        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMenu();
            }
        });
        
        menuBtn.style.cursor = 'pointer';
        closeBtn.style.cursor = 'pointer';
        
    } else {
        console.log('❌ Missing mobile menu elements');
    }
}

// ==================== PAGE NAVIGATION FUNCTION ====================
function initializePageNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    console.log(`✅ Found ${navLinks.length} navigation links`);
    
    navLinks.forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            console.log('🔗 Navigating to:', pageName);
            
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show target page
            const targetPage = document.getElementById(pageName);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // Close mobile menu if open
            const mobileNav = document.getElementById('mobileNav');
            const overlay = document.getElementById('navOverlay');
            const menuBtn = document.getElementById('menuToggle');
            
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Reset hamburger animation
                const spans = menuBtn?.querySelectorAll('span');
                if (spans && spans.length === 3) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            return false;
        };
    });
}

// ==================== CONTACT FORM FUNCTION ====================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('✅ Found contact form');
        
        contactForm.onsubmit = function(e) {
            e.preventDefault();
            console.log('📧 Form submitted');
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                const successMsg = document.getElementById('successMessage');
                if (successMsg) {
                    successMsg.classList.add('show');
                    setTimeout(() => {
                        successMsg.classList.remove('show');
                    }, 5000);
                }
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                console.log('✅ Form submitted successfully');
            }, 1500);
            
            return false;
        };
    }
}

// ==================== STAR SYSTEM FUNCTIONS ====================
function initializeStars() {
    // Create stars immediately if in dark mode
    if (document.body.classList.contains('dark-mode')) {
        createRealisticStars();
    }
    
    // Recreate stars on window resize
    window.addEventListener('resize', function() {
        if (document.body.classList.contains('dark-mode')) {
            setTimeout(createRealisticStars, 300);
        }
    });
}

function createRealisticStars() {
    const starField = document.querySelector('.star-field');
    if (!starField) {
        console.log('❌ Star field not found');
        return;
    }
    
    // Detect screen size
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // Adjust star count based on screen size
    const backgroundStarCount = isMobile ? 100 : (isTablet ? 150 : 250);
    
    console.log(`⭐ Creating ${backgroundStarCount} stars for ${isMobile ? 'Mobile' : (isTablet ? 'Tablet' : 'Desktop')}`);
    
    starField.innerHTML = '';
    
    // Create background stars dengan jumlah sesuai device
    for (let i = 0; i < backgroundStarCount; i++) {
        const star = document.createElement('div');
        const sizes = ['tiny', 'small', 'medium', 'large'];
        const colors = ['color-white', 'color-blue', 'color-yellow', 'color-orange'];
        
        star.className = `star ${sizes[Math.floor(Math.random() * sizes.length)]} ${colors[Math.floor(Math.random() * colors.length)]}`;
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay dan duration
        star.style.animationDelay = `${Math.random() * 10}s`;
        star.style.animationDuration = `${3 + Math.random() * 4}s`;
        
        // Adjust glow chance based on device
        const glowChance = isMobile ? 0.2 : 0.3;
        if (Math.random() > (1 - glowChance)) {
            star.classList.add('glow');
        }
        
        starField.appendChild(star);
    }
    
    console.log('✅ Stars created successfully');
}

function clearStarCreationInterval() {
    if (starCreationInterval) {
        clearInterval(starCreationInterval);
        starCreationInterval = null;
    }
}

// ==================== PLANET SYSTEM FUNCTIONS ====================
function initializePlanetSystem() {
    const planet = document.querySelector('.main-planet');
    if (!planet) return;
    
    // Add hover effect (hanya di desktop)
    if (window.innerWidth >= 1024) {
        planet.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        planet.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Click effect
        planet.addEventListener('click', function() {
            this.style.animation = 'planetPulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
            
            createPlanetParticles();
        });
    }
}

function createPlanetParticles() {
    const planetSystem = document.querySelector('.planet-system');
    if (!planetSystem) return;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'planet-particle';
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100;
        
        particle.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #4F46E5, #06B6D4);
            border-radius: 50%;
            animation: particleEmit 1s ease-out forwards;
            --angle: ${angle}rad;
            --distance: ${distance}px;
        `;
        
        planetSystem.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

function handlePlanetResponsive() {
    const planetSystem = document.querySelector('.planet-system');
    if (!planetSystem) return;
    
    function checkScreenSize() {
        const isDesktop = window.innerWidth >= 1024;
        
        if (isDesktop) {
            // Enable planet animations on desktop
            planetSystem.style.display = 'block';
        } else {
            // Disable planet on mobile/tablet
            planetSystem.style.display = 'none';
        }
    }
    
    // Check on load
    checkScreenSize();
    
    // Check on resize
    window.addEventListener('resize', checkScreenSize);
}

// ==================== UTILITY FUNCTIONS ====================
function injectCSSFixes() {
    const style = document.createElement('style');
    style.textContent = `
        /* Ensure buttons are clickable */
        .mode-btn, .menu-toggle, #themeToggle, #menuToggle {
            cursor: pointer !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 1000 !important;
        }
        
        /* Prevent any parent from blocking clicks */
        .nav-controls, .d-flex {
            pointer-events: none !important;
        }
        
        .nav-controls > *, .d-flex > * {
            pointer-events: auto !important;
        }
        
        /* Button active states */
        .mode-btn:active, .menu-toggle:active {
            transform: scale(0.95);
            transition: transform 0.1s;
        }
        
        /* Star field improvements */
        .star-field {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            pointer-events: none !important;
            z-index: 1 !important;
        }
        
        /* Planet particle animations */
        @keyframes planetPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.15); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes particleEmit {
            0% {
                transform: translate(-50%, -50%) translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: 
                    translate(-50%, -50%) 
                    translate(
                        calc(cos(var(--angle)) * var(--distance)),
                        calc(sin(var(--angle)) * var(--distance))
                    ) 
                    scale(0);
                opacity: 0;
            }
        }
        
        .planet-particle {
            pointer-events: none;
        }
        
        /* Responsive star adjustments */
        @media (max-width: 768px) {
            .star.tiny { width: 1px; height: 1px; }
            .star.small { width: 1.5px; height: 1.5px; }
            .star.medium { width: 2px; height: 2px; }
            .star.large { width: 2.5px; height: 2.5px; }
            
            /* Kurangi glow effect di mobile */
            .star.glow {
                filter: drop-shadow(0 0 1px currentColor);
            }
        }
        
        /* Tablet adjustments */
        @media (min-width: 769px) and (max-width: 1024px) {
            .star.tiny { width: 1.5px; height: 1.5px; }
            .star.small { width: 2px; height: 2px; }
            .star.medium { width: 2.5px; height: 2.5px; }
            .star.large { width: 3px; height: 3px; }
        }
        
        /* Cloud opacity reduction */
        .pcloud {
            opacity: 0.3 !important;
        }
        
        .dark-mode .pixel-clouds {
            display: none;
        }
        
        /* Hero content protection */
        .hero-content {
            position: relative;
            z-index: 10;
        }
        
        /* Page transitions */
        .page {
            display: none;
        }
        
        .page.active {
            display: block;
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Success message animation */
        .success-message {
            display: none;
            animation: slideIn 0.5s ease;
        }
        
        .success-message.show {
            display: block;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Fix untuk form elements */
        .form-control:focus, .form-select:focus {
            border-color: var(--primary-color) !important;
            box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25) !important;
        }
        
        /* Fix untuk button hover effects */
        .btn-light:hover {
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
        
        /* Fix untuk feature cards */
        .feature-card {
            transition: all 0.3s ease !important;
        }
        
        .feature-card:hover {
            transform: translateY(-10px) !important;
        }
    `;
    document.head.appendChild(style);
}

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('⚡ DOM already ready, initializing now...');
    setTimeout(() => {
        initializeDarkMode();
        initializeMobileMenu();
        initializePageNavigation();
        initializeContactForm();
        initializeStars();
        initializePlanetSystem();
        handlePlanetResponsive();
        injectCSSFixes();
    }, 100);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
});

console.log('👋 EduFuture JS loaded successfully!');