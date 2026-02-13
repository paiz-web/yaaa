// ===== SPA (Single Page Application) FUNCTIONS =====
function showPage(pageId) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Tampilkan halaman yang dipilih
    document.getElementById(pageId).classList.add('active');
    
    // Update navbar active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Aktifkan link yang sesuai
    const activeLink = document.querySelector(`.nav-link[onclick*="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL hash
    window.location.hash = pageId;
    
    // Load challenge jika halaman game
    if (pageId === 'game') {
        loadChallenge();
    }
}

// Fungsi untuk toggle mode gelap/terang
function setupThemeToggle() {
    const themeToggle = document.getElementById('navbarThemeToggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        
        if (currentTheme === 'light') {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('theme', 'dark');
              updateNavbarLogo('dark');
        } else {
            htmlElement.setAttribute('data-bs-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateNavbarLogo('light'); 
        }
    });
}

// Cek preferensi tema saat halaman dimuat
function setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        updateNavbarLogo(savedTheme); // ✅ TAMBAHAN
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            updateNavbarLogo('dark'); // ✅ TAMBAHAN
        } else {
            updateNavbarLogo('light'); // ✅ TAMBAHAN
        }
    }
}


// ===== CHALLENGE GAME LOGIC =====
let currentLevel = 0;

const challenges = [
    {
        title: "Level 1",
        desc: "Buat judul <b>\"Coding Class CCP\"</b> menggunakan tag <code>&lt;h1&gt;</code>.",
        category: "HTML Dasar",
        badge: "Badge HTML Beginner",
        check: (html) => {
            const clean = html.replace(/\s+/g, "").toLowerCase();
            if (/<h1>codingclassccp<\/h1>/.test(clean)) {
                return { ok: true };
            }
            return {
                ok: false,
                msg: "❌ Gunakan tag &lt;h1&gt; dengan teks: Coding Class CCP"
            };
        }
    },
    {
        title: "Level 2",
        desc: "Buat paragraf <b>\"Belajar coding itu asyik\"</b> menggunakan <code>&lt;p&gt;</code>.",
        category: "HTML Dasar",
        badge: "Badge HTML Explorer",
        check: (html) => {
            const clean = html.replace(/\s+/g, "").toLowerCase();
            if (/<p>belajarcodingituasyik<\/p>/.test(clean)) {
                return { ok: true };
            }
            return {
                ok: false,
                msg: "❌ Gunakan tag &lt;p&gt; dengan teks yang benar"
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
                msg: "❌ Gunakan tag &lt;img&gt; dengan atribut src"
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

    // Reset editor
    const htmlCode = document.getElementById("htmlCode");
    const cssCode = document.getElementById("cssCode");
    const previewFrame = document.getElementById("previewFrame");
    const resultBox = document.getElementById("challengeResult");
    
    if (htmlCode) htmlCode.value = "";
    if (cssCode) cssCode.value = "";
    if (previewFrame) previewFrame.srcdoc = "";
    if (resultBox) resultBox.style.display = "none";
}

function runChallenge() {
    const htmlCode = document.getElementById("htmlCode");
    const cssCode = document.getElementById("cssCode");
    const previewFrame = document.getElementById("previewFrame");
    
    if (!htmlCode || !cssCode || !previewFrame) return;
    
    const preview = `
        <!doctype html>
        <html>
        <head>
            <style>
                body {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                ${cssCode.value}
            </style>
        </head>
        <body>
            ${htmlCode.value}
        </body>
        </html>
    `;
    previewFrame.srcdoc = preview;
}

function checkChallenge() {
    const htmlCode = document.getElementById("htmlCode");
    const cssCode = document.getElementById("cssCode");
    const resultBox = document.getElementById("challengeResult");
    
    if (!htmlCode || !cssCode || !resultBox) return;
    
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
            document.getElementById("progressText").innerText = 
                `Progress: ${challenges.length} / ${challenges.length} (Selesai!)`;
            document.getElementById("progressBar").style.width = "100%";
        }
    } else {
        resultBox.innerHTML = result.msg;
    }
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulasi pengiriman
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.');
        }, 1500);
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Setup tema
    setupTheme();
    setupThemeToggle();
    
    // Setup form kontak
    setupContactForm();
    
    // cek hash URL untuk halaman default
    const hash = window.location.hash.substring(1);
    if (hash && ['beranda', 'game', 'tentang', 'kontak'].includes(hash)) {
        showPage(hash);
    }
    
    // Load challenge jika langsung ke halaman game
    if (window.location.hash === '#game') {
        setTimeout(loadChallenge, 100);
    }
});

// Global functions untuk onclick
window.runChallenge = runChallenge;
window.checkChallenge = checkChallenge;

// berubah logo pada saat mode terang/gelap
function updateNavbarLogo(theme) {
    const logo = document.getElementById('navbarLogo');
    if (!logo) return;

    logo.src = theme === 'dark'
        ? 'logo_smamda_putih2.png'
        : 'logo_hitam2.png';
}



