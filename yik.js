
let starCreationInterval;


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


function initializeDarkMode() {
    const darkModeBtn = document.getElementById('themeToggle');
    if (darkModeBtn) {
        console.log('✅ Found dark mode button');
        
        // Set initial state
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeBtn.textContent = '☀️';
            createRealisticStars(); 
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
                
   
                setTimeout(() => {
                    createRealisticStars();
                }, 300);
            } else {
                this.textContent = '🌙';
                localStorage.setItem('theme', 'light');
                console.log('Changed to LIGHT mode');
                
   
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
            

            const spans = menuBtn.querySelectorAll('span');
            if (spans.length === 3) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
        

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


function initializePageNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    console.log(`✅ Found ${navLinks.length} navigation links`);
    
    navLinks.forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            console.log('🔗 Navigating to:', pageName);
            

            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            

            const targetPage = document.getElementById(pageName);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
  
            const mobileNav = document.getElementById('mobileNav');
            const overlay = document.getElementById('navOverlay');
            const menuBtn = document.getElementById('menuToggle');
            
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                

                const spans = menuBtn?.querySelectorAll('span');
                if (spans && spans.length === 3) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
            

            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            return false;
        };
    });
}


function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('✅ Found contact form');
        
        contactForm.onsubmit = function(e) {
            e.preventDefault();
            console.log('📧 Form submitted');
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
            submitBtn.disabled = true;
            

            setTimeout(() => {
                this.reset();

                const successMsg = document.getElementById('successMessage');
                if (successMsg) {
                    successMsg.classList.add('show');
                    setTimeout(() => {
                        successMsg.classList.remove('show');
                    }, 5000);
                }
                

                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                console.log('✅ Form submitted successfully');
            }, 1500);
            
            return false;
        };
    }
}


function initializeStars() {

    if (document.body.classList.contains('dark-mode')) {
        createRealisticStars();
    }
    

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
    

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    

    const backgroundStarCount = isMobile ? 100 : (isTablet ? 150 : 250);
    
    console.log(`⭐ Creating ${backgroundStarCount} stars for ${isMobile ? 'Mobile' : (isTablet ? 'Tablet' : 'Desktop')}`);
    
    starField.innerHTML = '';

    for (let i = 0; i < backgroundStarCount; i++) {
        const star = document.createElement('div');
        const sizes = ['tiny', 'small', 'medium', 'large'];
        const colors = ['color-white', 'color-blue', 'color-yellow', 'color-orange'];
        
        star.className = `star ${sizes[Math.floor(Math.random() * sizes.length)]} ${colors[Math.floor(Math.random() * colors.length)]}`;
        

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        

        star.style.animationDelay = `${Math.random() * 10}s`;
        star.style.animationDuration = `${3 + Math.random() * 4}s`;
        

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


function initializePlanetSystem() {
    const planet = document.querySelector('.main-planet');
    if (!planet) return;
    

    if (window.innerWidth >= 1024) {
        planet.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        planet.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        

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

            planetSystem.style.display = 'block';
        } else {

            planetSystem.style.display = 'none';
        }
    }

    checkScreenSize();
    
    // Check on resize
    window.addEventListener('resize', checkScreenSize);
}


function injectCSSFixes() {
    const style = document.createElement('style');
    style.textContent = `

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
        

        .mode-btn:active, .menu-toggle:active {
            transform: scale(0.95);
            transition: transform 0.1s;
        }
        

        .star-field {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            pointer-events: none !important;
            z-index: 1 !important;
        }
        

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
        

        @media (max-width: 768px) {
            .star.tiny { width: 1px; height: 1px; }
            .star.small { width: 1.5px; height: 1.5px; }
            .star.medium { width: 2px; height: 2px; }
            .star.large { width: 2.5px; height: 2.5px; }
            
   
            .star.glow {
                filter: drop-shadow(0 0 1px currentColor);
            }
        }
        

        @media (min-width: 769px) and (max-width: 1024px) {
            .star.tiny { width: 1.5px; height: 1.5px; }
            .star.small { width: 2px; height: 2px; }
            .star.medium { width: 2.5px; height: 2.5px; }
            .star.large { width: 3px; height: 3px; }
        }
        

        .pcloud {
            opacity: 0.3 !important;
        }
        
        .dark-mode .pixel-clouds {
            display: none;
        }

        .hero-content {
            position: relative;
            z-index: 10;
        }
        

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
        

        .form-control:focus, .form-select:focus {
            border-color: var(--primary-color) !important;
            box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25) !important;
        }
        

        .btn-light:hover {
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
        

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



let currentLevel = 0;

const challenges = [
  {
    title: "Level 1",
    desc: "Buat judul <b>“Coding Class CCP”</b> menggunakan tag <code>&lt;h1&gt;</code>.",
    category: "HTML Dasar",
    badge: "Badge HTML Beginner",
    check: (html) => {
      const clean = html.replace(/\s+/g, "").toLowerCase();
      if (/<h1>codingclassccp<\/h1>/.test(clean)) {
        return { ok: true };
      }
      return {
        ok: false,
        msg: "❌ Gunakan tag <h1> dengan teks: Coding Class CCP"
      };
    }
  },
  {
    title: "Level 2",
    desc: "Buat paragraf <b>“Belajar coding itu asyik”</b> menggunakan <code>&lt;p&gt;</code>.",
    category: "HTML Dasar",
    badge: "Badge HTML Explorer",
    check: (html) => {
      const clean = html.replace(/\s+/g, "").toLowerCase();
      if (/<p>belajarcodingituasyik<\/p>/.test(clean)) {
        return { ok: true };
      }
      return {
        ok: false,
        msg: "❌ Gunakan tag <p> dengan teks yang benar"
      };
    }
  },
  {
    title: "Level 3",
    desc: "Tampilkan gambar menggunakan tag <code>&lt;img&gt;</code>.",
    category: "HTML Media",
    badge: "Badge Media Creator",
    check: (html) => {
      if (/<img[^>]*src=/.test(html)) {
        return { ok: true };
      }
      return {
        ok: false,
        msg: "❌ Gunakan tag <img> dengan atribut src"
      };
    }
  },
  {
    title: "Level 4",
    desc: "Ubah warna teks menjadi <b>merah</b> menggunakan CSS.",
    category: "CSS Dasar",
    badge: "Badge CSS Beginner",
    check: (html, css) => {
      if (/color\s*:\s*red/i.test(css)) {
        return { ok: true };
      }
      return {
        ok: false,
        msg: "❌ Gunakan CSS color: red"
      };
    }
  },
  {
    title: "Level 5",
    desc: "Ubah background halaman menjadi <b>biru</b> menggunakan CSS.",
    category: "CSS Styling",
    badge: "Badge Styling Master",
    check: (html, css) => {
      if (/background(-color)?\s*:\s*(blue|#0000ff)/i.test(css)) {
        return { ok: true };
      }
      return {
        ok: false,
        msg: "❌ Gunakan background-color: blue"
      };
    }
  }
];

const htmlCode = document.getElementById("htmlCode");
const cssCode = document.getElementById("cssCode");
const previewFrame = document.getElementById("previewFrame");
const resultBox = document.getElementById("challengeResult");

function loadChallenge() {
  const c = challenges[currentLevel];

  document.getElementById("levelTitle").innerHTML =
    `<i class="fas fa-flag-checkered me-2"></i>${c.title}`;

  document.getElementById("challengeDesc").innerHTML = c.desc;

  document.getElementById("challengeCategory").innerHTML =
    `<i class="fas fa-layer-group"></i> ${c.category}`;

  document.getElementById("rewardBadge").innerHTML =
    `<i class="fas fa-medal"></i> ${c.badge}`;

  document.getElementById("progressText").innerText =
    `Progress: ${currentLevel + 1} / ${challenges.length}`;

  document.getElementById("progressBar").style.width =
    ((currentLevel + 1) / challenges.length * 100) + "%";

  htmlCode.value = "";
  cssCode.value = "";
  previewFrame.srcdoc = "";
  resultBox.style.display = "none";
}

function runChallenge() {
  const preview = `
    <!doctype html>
    <html>
    <head>
      <style>${cssCode.value}</style>
    </head>
    <body>
      ${htmlCode.value}
    </body>
    </html>
  `;
  previewFrame.srcdoc = preview;
}

function checkChallenge() {
  const c = challenges[currentLevel];
  const result = c.check(htmlCode.value, cssCode.value);

  resultBox.style.display = "block";

  if (result.ok) {
    resultBox.innerHTML = "✅ Benar! Lanjut ke level berikutnya.";
    currentLevel++;

    if (currentLevel < challenges.length) {
      setTimeout(loadChallenge, 900);
    } else {
      resultBox.innerHTML = "🏆 Semua challenge selesai! Kamu luar biasa!";
    }
  } else {
    resultBox.innerHTML = result.msg;
  }
}
window.addEventListener("DOMContentLoaded", loadChallenge);
