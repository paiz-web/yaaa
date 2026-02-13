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



// =============== INITIALIZATION ===============
document.addEventListener('DOMContentLoaded', function() {
    // Load konten semua course
    loadWebContent();
    loadIoTContent();
    loadGameContent();
    
    // Set default active tab ke Web
    setTimeout(() => {
        if (document.getElementById('challengeArena').style.display === 'block') {
            switchCourse('web');
        }
    }, 100);
});

// =============== LOAD CONTENT ===============
function loadWebContent() {
    document.getElementById('webChallenge').innerHTML = generateWebHTML();
}

function loadIoTContent() {
    document.getElementById('iotChallenge').innerHTML = generateIoTHTML();
}

function loadGameContent() {
    document.getElementById('gameChallenge').innerHTML = generateGameHTML();
}

// =============== OPEN COURSE ===============
function openCourse(course) {
    document.getElementById('challengeArena').style.display = 'block';
    switchCourse(course);
    window.scrollTo({
        top: document.getElementById('challengeArena').offsetTop - 100,
        behavior: 'smooth'
    });
}

// =============== SWITCH COURSE ===============
function switchCourse(course) {
    // Update tabs
    document.querySelectorAll('.course-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.course-tab.${course}`).classList.add('active');
    
    // Show selected challenge
    document.querySelectorAll('.challenge-pane').forEach(pane => {
        pane.style.display = 'none';
    });
    document.getElementById(course + 'Challenge').style.display = 'block';
}

// =============== SELECT PILIHAN GANDA ===============
function selectPG(course, question, answer, element) {
    const state = courseState[course];
    
    if (state.answers[question] !== null) {
        alert('⚠️ Kamu sudah menjawab soal ini!');
        return;
    }
    
    state.answers[question] = answer;
    const isCorrect = (answer === state.correctAnswers[question]);
    
    if (isCorrect) {
        state.xp += 20;
        state.correctCount++;
    }
    
    // Reload content to reflect changes
    if (course === 'web') loadWebContent();
    if (course === 'iot') loadIoTContent();
    if (course === 'game') loadGameContent();
    
    // Update progress circle
    updateProgressCircle(course);
    
    // Check if all answered
    checkAllAnswered(course);
}

// =============== SELECT BENAR/SALAH ===============
function selectBS(course, question, answer, element) {
    const state = courseState[course];
    
    if (state.answers[question] !== null) {
        alert('⚠️ Kamu sudah menjawab soal ini!');
        return;
    }
    
    state.answers[question] = answer;
    const isCorrect = (answer === state.correctAnswers[question]);
    
    if (isCorrect) {
        state.xp += 20;
        state.correctCount++;
    }
    
    // Reload content
    if (course === 'web') loadWebContent();
    if (course === 'iot') loadIoTContent();
    if (course === 'game') loadGameContent();
    
    updateProgressCircle(course);
    checkAllAnswered(course);
}

// =============== CHECK ESAI ===============
function checkEsai(course, question, value, keywords) {
    const state = courseState[course];
    
    if (state.answers[question] !== null) {
        alert('⚠️ Kamu sudah menjawab soal ini!');
        return;
    }
    
    const userAnswer = value.toLowerCase().trim();
    let isCorrect = keywords.some(k => userAnswer.includes(k));
    
    state.answers[question] = userAnswer;
    
    if (isCorrect) {
        state.xp += 20;
        state.correctCount++;
    }
    
    // Reload content
    if (course === 'web') loadWebContent();
    if (course === 'iot') loadIoTContent();
    if (course === 'game') loadGameContent();
    
    updateProgressCircle(course);
    checkAllAnswered(course);
}

// =============== CHECK ESAI LONG ===============
function checkEsaiLong(course, question, value, keywords) {
    checkEsai(course, question, value, keywords);
}

// =============== NAVIGATE QUESTION ===============
function navigateQuestion(course, direction) {
    const state = courseState[course];
    
    if (direction === 'next' && state.currentQuestion < state.totalQuestions) {
        state.currentQuestion++;
    } else if (direction === 'prev' && state.currentQuestion > 1) {
        state.currentQuestion--;
    }
    
    // Reload content
    if (course === 'web') loadWebContent();
    if (course === 'iot') loadIoTContent();
    if (course === 'game') loadGameContent();
}

// =============== UPDATE PROGRESS CIRCLE ===============
function updateProgressCircle(course) {
    const state = courseState[course];
    const circle = document.getElementById(`${course}ProgressCircle`);
    if (circle) {
        const percentage = (state.currentQuestion / state.totalQuestions) * 360;
        circle.style.background = `conic-gradient(var(--${course}) ${percentage}deg, #e9eef3 ${percentage}deg)`;
    }
}

// =============== CHECK ALL ANSWERED ===============
function checkAllAnswered(course) {
    const state = courseState[course];
    let allAnswered = true;
    
    for (let i = 1; i <= state.totalQuestions; i++) {
        if (state.answers[i] === null) {
            allAnswered = false;
            break;
        }
    }
    
    if (allAnswered && !state.completed) {
        finishCourse(course);
    }
}

// =============== FINISH COURSE ===============
function finishCourse(course) {
    const state = courseState[course];
    state.completed = true;
    
    const score = Math.round((state.correctCount / state.totalQuestions) * 100);
    const resultCard = document.getElementById(`${course}ResultCard`);
    
    if (resultCard) {
        let badge = '';
        if (score >= 80) badge = 'GOLD MASTER 🏆';
        else if (score >= 60) badge = 'SILVER EXPERT 🥈';
        else if (score >= 40) badge = 'BRONZE LEARNER 🥉';
        else badge = 'TRY AGAIN 📚';
        
        let reviewHtml = '';
        for (let i = 1; i <= 15; i++) {
            let isCorrect = state.answers[i] === state.correctAnswers[i] || 
                           (i >= 11 && state.answers[i] && state.correctAnswers[i] && 
                            state.answers[i].toLowerCase().includes(state.correctAnswers[i].toLowerCase()));
            
            reviewHtml += `<div style="display:flex; align-items:center; gap:1rem; padding:0.5rem; background:${isCorrect ? 'rgba(6,214,160,0.05)' : 'rgba(239,71,111,0.05)'}; border-radius:10px; margin-bottom:0.5rem;">
                                <span style="font-weight:700; min-width:70px;">Soal ${i}</span>
                                <span style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'};">${isCorrect ? '✅' : '❌'}</span>
                                <span style="color:#64748b;">Jawaban: ${state.answers[i] || '-'}</span>
                            </div>`;
        }
        
        resultCard.style.display = 'block';
        resultCard.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-4 text-center">
                    <div class="score-circle" style="background: conic-gradient(var(--${course}) 0deg, var(--${course}) ${score * 3.6}deg, #e2e8f0 ${score * 3.6}deg);">
                        <div class="score-circle-inner">
                            <span class="score-big" style="color: var(--${course});">${score}</span>
                            <span style="color:#64748b;">/100</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <h3 style="color:var(--dark); font-weight:800; margin-bottom:1rem;">
                        <i class="fas ${course === 'web' ? 'fa-code' : course === 'iot' ? 'fa-robot' : 'fa-gamepad'} me-2" style="color: var(--${course});"></i>
                        Hasil ${course === 'web' ? 'Web Development' : course === 'iot' ? 'IoT & Robotics' : 'Game Development'}
                    </h3>
                    <div style="display:flex; gap:2rem;">
                        <div>
                            <span style="color:#64748b;">Benar</span><br>
                            <span style="font-size:2rem; font-weight:800; color:var(--success);">${state.correctCount}</span>
                            <span style="color:#64748b;">/15</span>
                        </div>
                        <div>
                            <span style="color:#64748b;">XP</span><br>
                            <span style="font-size:2rem; font-weight:800; color:var(--warning);">${state.xp}</span>
                            <span style="color:#64748b;">XP</span>
                        </div>
                    </div>
                    <div class="mt-3">
                        <span class="badge p-3" style="background:var(--${course}-gradient); color:white; font-size:1.1rem; border-radius:50px;">
                            <i class="fas fa-trophy me-2"></i> ${badge}
                        </span>
                    </div>
                    <div class="mt-4">
                        <button class="try-again-btn" style="background:var(--${course}-gradient);" onclick="resetCourse('${course}')">
                            <i class="fas fa-redo-alt me-2"></i> Coba Lagi
                        </button>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <h6 style="font-weight:700; margin-bottom:1rem;">📋 Rekap Jawaban:</h6>
                ${reviewHtml}
            </div>
        `;
    }
    
    // Update card status
    const cardStatus = document.getElementById(`${course}CardStatus`);
    if (cardStatus) {
        cardStatus.innerHTML = 'Selesai ✓';
        cardStatus.style.background = 'var(--success)';
        cardStatus.style.color = 'white';
    }
}

// =============== RESET COURSE ===============
function resetCourse(course) {
    const state = courseState[course];
    
    // Reset state
    state.currentQuestion = 1;
    state.answers = {
        1: null, 2: null, 3: null, 4: null, 5: null,
        6: null, 7: null, 8: null, 9: null, 10: null,
        11: null, 12: null, 13: null, 14: null, 15: null
    };
    state.xp = 0;
    state.correctCount = 0;
    state.completed = false;
    
    // Reload content
    if (course === 'web') loadWebContent();
    if (course === 'iot') loadIoTContent();
    if (course === 'game') loadGameContent();
    
    // Update card status
    const cardStatus = document.getElementById(`${course}CardStatus`);
    if (cardStatus) {
        cardStatus.innerHTML = 'Mulai →';
        cardStatus.style.background = `var(--${course}-light)`;
        cardStatus.style.color = `var(--${course})`;
    }
    
    // Reset progress circle
    updateProgressCircle(course);
}

// =============== EXPORT FUNCTIONS TO GLOBAL SCOPE ===============
window.openCourse = openCourse;
window.switchCourse = switchCourse;
window.selectPG = selectPG;
window.selectBS = selectBS;
window.checkEsai = checkEsai;
window.checkEsaiLong = checkEsaiLong;
window.navigateQuestion = navigateQuestion;
window.resetCourse = resetCourse;

// =============== GENERATE WEB HTML ===============
function generateWebHTML() {
    return `
        <div class="quiz-container">
            <div class="quiz-header">
                <div class="d-flex align-items-center gap-3">
                    <div class="progress-circle" id="webProgressCircle">
                        <div class="progress-circle-inner" id="webProgressText" style="color: var(--web);">${courseState.web.currentQuestion}/15</div>
                    </div>
                    <div>
                        <h4 style="color: var(--dark); font-weight: 700; margin-bottom: 0.2rem;">
                            <i class="fab fa-html5 me-2" style="color: #e44d26;"></i>
                            <i class="fab fa-css3-alt me-2" style="color: #264de4;"></i>
                            Web Development
                        </h4>
                        <span style="color: #64748b;">Soal <span id="webCurrentQuestion">${courseState.web.currentQuestion}</span> dari 15</span>
                    </div>
                </div>
                <div>
                    <span class="badge p-3" style="background: var(--web-light); color: var(--web); font-size: 1.1rem; border-radius: 50px;">
                        <i class="fas fa-bolt me-2"></i><span id="webCurrentXP">${courseState.web.xp}</span>/300 XP
                    </span>
                </div>
            </div>

            <div id="webQuestionContainer">
                ${generateWebQuestions()}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2.5rem;">
                <button class="btn-ultimate btn-web" id="webPrevBtn" onclick="navigateQuestion('web', 'prev')" ${courseState.web.currentQuestion === 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left me-2"></i> Sebelumnya
                </button>
                <span id="webQuestionStatus" style="font-size: 1.1rem; font-weight: 600; color: var(--web); background: var(--web-light); padding: 0.5rem 1.5rem; border-radius: 30px;">
                    ${courseState.web.answers[courseState.web.currentQuestion] ? 
                        '<i class="fas fa-check-circle me-2" style="color: var(--success);"></i> Sudah dijawab' : 
                        '<i class="fas fa-hourglass-half me-2"></i> Belum menjawab'}
                </span>
                <button class="btn-ultimate btn-web" id="webNextBtn" onclick="navigateQuestion('web', 'next')" ${courseState.web.currentQuestion === 15 ? 'disabled' : ''}>
                    Selanjutnya <i class="fas fa-arrow-right ms-2"></i>
                </button>
            </div>
        </div>
        <div id="webResultCard" class="result-card" style="display: none;"></div>
    `;
}

function generateWebQuestions() {
    let questions = '';
    for (let i = 1; i <= 15; i++) {
        questions += `<div id="web-q${i}" class="question-item" style="${i !== courseState.web.currentQuestion ? 'display:none;' : ''}">`;
        
        if (i <= 5) {
            questions += `<span class="question-type type-pg"><i class="fas fa-list me-2"></i>PILIHAN GANDA ${i}/5</span>`;
            if (i === 1) {
                questions += `<div class="quiz-question">Apa perbedaan utama antara HTML dan CSS?</div>
                    <div class="code-block html"><span class="code-tag html">HTML</span><pre style="margin:0;">&lt;div&gt;Konten&lt;/div&gt;</pre></div>
                    <div class="code-block css"><span class="code-tag css">CSS</span><pre style="margin:0;">div { color: red; }</pre></div>
                    <div class="pg-option ${courseState.web.answers[1] ? 'locked' : ''} ${courseState.web.answers[1] === 'A' ? 'selected correct' : ''} ${courseState.web.answers[1] && courseState.web.answers[1] !== 'A' ? 'wrong' : ''}" onclick="selectPG('web', 1, 'A', this)">
                        <span class="option-letter">A</span>HTML struktur, CSS tampilan
                    </div>
                    <div class="pg-option ${courseState.web.answers[1] ? 'locked' : ''} ${courseState.web.answers[1] === 'B' ? 'selected wrong' : ''}" onclick="selectPG('web', 1, 'B', this)">
                        <span class="option-letter">B</span>HTML backend, CSS frontend
                    </div>
                    <div class="pg-option ${courseState.web.answers[1] ? 'locked' : ''} ${courseState.web.answers[1] === 'C' ? 'selected wrong' : ''}" onclick="selectPG('web', 1, 'C', this)">
                        <span class="option-letter">C</span>Sama-sama styling
                    </div>
                    <div class="pg-option ${courseState.web.answers[1] ? 'locked' : ''} ${courseState.web.answers[1] === 'D' ? 'selected wrong' : ''}" onclick="selectPG('web', 1, 'D', this)">
                        <span class="option-letter">D</span>HTML database, CSS server
                    </div>`;
            } else if (i === 2) {
                questions += `<div class="quiz-question">Tag HTML untuk heading terbesar?</div>
                    <div class="code-block html"><span class="code-tag html">Heading</span><pre style="margin:0;">&lt;h1&gt;Terbesar&lt;/h1&gt; &lt;h6&gt;Terkecil&lt;/h6&gt;</pre></div>
                    <div class="pg-option ${courseState.web.answers[2] ? 'locked' : ''} ${courseState.web.answers[2] === 'A' ? 'selected wrong' : ''}" onclick="selectPG('web', 2, 'A', this)"><span class="option-letter">A</span>&lt;head&gt;</div>
                    <div class="pg-option ${courseState.web.answers[2] ? 'locked' : ''} ${courseState.web.answers[2] === 'B' ? 'selected wrong' : ''}" onclick="selectPG('web', 2, 'B', this)"><span class="option-letter">B</span>&lt;header&gt;</div>
                    <div class="pg-option ${courseState.web.answers[2] ? 'locked' : ''} ${courseState.web.answers[2] === 'C' ? 'selected correct' : ''}" onclick="selectPG('web', 2, 'C', this)"><span class="option-letter">C</span>&lt;h1&gt;</div>
                    <div class="pg-option ${courseState.web.answers[2] ? 'locked' : ''} ${courseState.web.answers[2] === 'D' ? 'selected wrong' : ''}" onclick="selectPG('web', 2, 'D', this)"><span class="option-letter">D</span>&lt;heading&gt;</div>`;
            } else if (i === 3) {
                questions += `<div class="quiz-question">Simbol CSS untuk class?</div>
                    <div class="code-block css"><span class="code-tag css">Selector</span><pre style="margin:0;">.class {}  #id {}</pre></div>
                    <div class="pg-option ${courseState.web.answers[3] ? 'locked' : ''} ${courseState.web.answers[3] === 'A' ? 'selected wrong' : ''}" onclick="selectPG('web', 3, 'A', this)"><span class="option-letter">A</span># (pagar)</div>
                    <div class="pg-option ${courseState.web.answers[3] ? 'locked' : ''} ${courseState.web.answers[3] === 'B' ? 'selected correct' : ''}" onclick="selectPG('web', 3, 'B', this)"><span class="option-letter">B</span>. (titik)</div>
                    <div class="pg-option ${courseState.web.answers[3] ? 'locked' : ''} ${courseState.web.answers[3] === 'C' ? 'selected wrong' : ''}" onclick="selectPG('web', 3, 'C', this)"><span class="option-letter">C</span>@ (at)</div>
                    <div class="pg-option ${courseState.web.answers[3] ? 'locked' : ''} ${courseState.web.answers[3] === 'D' ? 'selected wrong' : ''}" onclick="selectPG('web', 3, 'D', this)"><span class="option-letter">D</span>$ (dollar)</div>`;
            } else if (i === 4) {
                questions += `<div class="quiz-question">Tag untuk hyperlink?</div>
                    <div class="code-block html"><span class="code-tag html">Link</span><pre style="margin:0;">&lt;a href="url"&gt;Klik&lt;/a&gt;</pre></div>
                    <div class="pg-option ${courseState.web.answers[4] ? 'locked' : ''} ${courseState.web.answers[4] === 'A' ? 'selected wrong' : ''}" onclick="selectPG('web', 4, 'A', this)"><span class="option-letter">A</span>&lt;link&gt;</div>
                    <div class="pg-option ${courseState.web.answers[4] ? 'locked' : ''} ${courseState.web.answers[4] === 'B' ? 'selected wrong' : ''}" onclick="selectPG('web', 4, 'B', this)"><span class="option-letter">B</span>&lt;href&gt;</div>
                    <div class="pg-option ${courseState.web.answers[4] ? 'locked' : ''} ${courseState.web.answers[4] === 'C' ? 'selected correct' : ''}" onclick="selectPG('web', 4, 'C', this)"><span class="option-letter">C</span>&lt;a&gt;</div>
                    <div class="pg-option ${courseState.web.answers[4] ? 'locked' : ''} ${courseState.web.answers[4] === 'D' ? 'selected wrong' : ''}" onclick="selectPG('web', 4, 'D', this)"><span class="option-letter">D</span>&lt;url&gt;</div>`;
            } else if (i === 5) {
                questions += `<div class="quiz-question">Urutan Box Model dari dalam ke luar?</div>
                    <div class="code-block css"><span class="code-tag css">Box Model</span><pre style="margin:0;">padding border margin</pre></div>
                    <div class="pg-option ${courseState.web.answers[5] ? 'locked' : ''} ${courseState.web.answers[5] === 'A' ? 'selected correct' : ''}" onclick="selectPG('web', 5, 'A', this)"><span class="option-letter">A</span>content → padding → border → margin</div>
                    <div class="pg-option ${courseState.web.answers[5] ? 'locked' : ''} ${courseState.web.answers[5] === 'B' ? 'selected wrong' : ''}" onclick="selectPG('web', 5, 'B', this)"><span class="option-letter">B</span>content → margin → border → padding</div>
                    <div class="pg-option ${courseState.web.answers[5] ? 'locked' : ''} ${courseState.web.answers[5] === 'C' ? 'selected wrong' : ''}" onclick="selectPG('web', 5, 'C', this)"><span class="option-letter">C</span>margin → border → padding → content</div>
                    <div class="pg-option ${courseState.web.answers[5] ? 'locked' : ''} ${courseState.web.answers[5] === 'D' ? 'selected wrong' : ''}" onclick="selectPG('web', 5, 'D', this)"><span class="option-letter">D</span>padding → content → margin → border</div>`;
            }
        } else if (i <= 10) {
            let bsNum = i - 5;
            questions += `<span class="question-type type-bs"><i class="fas fa-check-circle me-2"></i>BENAR/SALAH ${bsNum}/5</span>`;
            if (i === 6) {
                questions += `<div class="quiz-question">HTML adalah bahasa pemrograman.</div>
                    <div class="bs-container">
                        <div class="bs-option ${courseState.web.answers[6] ? 'locked' : ''} ${courseState.web.answers[6] === 'benar' ? 'selected wrong' : ''}" onclick="selectBS('web', 6, 'benar', this)">
                            <i class="fas fa-check-circle me-2" style="color:var(--success);"></i> BENAR
                        </div>
                        <div class="bs-option ${courseState.web.answers[6] ? 'locked' : ''} ${courseState.web.answers[6] === 'salah' ? 'selected correct' : ''}" onclick="selectBS('web', 6, 'salah', this)">
                            <i class="fas fa-times-circle me-2" style="color:var(--danger);"></i> SALAH
                        </div>
                    </div>`;
            } else if (i === 7) {
                questions += `<div class="quiz-question">CSS bisa ditulis inline dengan atribut style.</div>
                    <div class="bs-container">
                        <div class="bs-option ${courseState.web.answers[7] ? 'locked' : ''} ${courseState.web.answers[7] === 'benar' ? 'selected correct' : ''}" onclick="selectBS('web', 7, 'benar', this)">
                            <i class="fas fa-check-circle me-2" style="color:var(--success);"></i> BENAR
                        </div>
                        <div class="bs-option ${courseState.web.answers[7] ? 'locked' : ''} ${courseState.web.answers[7] === 'salah' ? 'selected wrong' : ''}" onclick="selectBS('web', 7, 'salah', this)">
                            <i class="fas fa-times-circle me-2" style="color:var(--danger);"></i> SALAH
                        </div>
                    </div>`;
            } else if (i === 8) {
                questions += `<div class="quiz-question">Satu elemen HTML hanya bisa memiliki satu class.</div>
                    <div class="bs-container">
                        <div class="bs-option ${courseState.web.answers[8] ? 'locked' : ''} ${courseState.web.answers[8] === 'benar' ? 'selected wrong' : ''}" onclick="selectBS('web', 8, 'benar', this)">
                            <i class="fas fa-check-circle me-2" style="color:var(--success);"></i> BENAR
                        </div>
                        <div class="bs-option ${courseState.web.answers[8] ? 'locked' : ''} ${courseState.web.answers[8] === 'salah' ? 'selected correct' : ''}" onclick="selectBS('web', 8, 'salah', this)">
                            <i class="fas fa-times-circle me-2" style="color:var(--danger);"></i> SALAH
                        </div>
                    </div>`;
            } else if (i === 9) {
                questions += `<div class="quiz-question">ID dalam HTML harus unik.</div>
                    <div class="bs-container">
                        <div class="bs-option ${courseState.web.answers[9] ? 'locked' : ''} ${courseState.web.answers[9] === 'benar' ? 'selected correct' : ''}" onclick="selectBS('web', 9, 'benar', this)">
                            <i class="fas fa-check-circle me-2" style="color:var(--success);"></i> BENAR
                        </div>
                        <div class="bs-option ${courseState.web.answers[9] ? 'locked' : ''} ${courseState.web.answers[9] === 'salah' ? 'selected wrong' : ''}" onclick="selectBS('web', 9, 'salah', this)">
                            <i class="fas fa-times-circle me-2" style="color:var(--danger);"></i> SALAH
                        </div>
                    </div>`;
            } else if (i === 10) {
                questions += `<div class="quiz-question">Tag &lt;div&gt; adalah tag inline.</div>
                    <div class="bs-container">
                        <div class="bs-option ${courseState.web.answers[10] ? 'locked' : ''} ${courseState.web.answers[10] === 'benar' ? 'selected wrong' : ''}" onclick="selectBS('web', 10, 'benar', this)">
                            <i class="fas fa-check-circle me-2" style="color:var(--success);"></i> BENAR
                        </div>
                        <div class="bs-option ${courseState.web.answers[10] ? 'locked' : ''} ${courseState.web.answers[10] === 'salah' ? 'selected correct' : ''}" onclick="selectBS('web', 10, 'salah', this)">
                            <i class="fas fa-times-circle me-2" style="color:var(--danger);"></i> SALAH
                        </div>
                    </div>`;
            }
        } else {
            let esaiNum = i - 10;
            questions += `<span class="question-type type-esai"><i class="fas fa-pencil-alt me-2"></i>ESAI ${esaiNum}/5</span>`;
            if (i === 11) {
                questions += `<div class="quiz-question">Kepanjangan HTML?</div>
                    <input type="text" class="esai-input ${courseState.web.answers[11] ? 'locked' : ''}" id="web-esai1" placeholder="Tulis jawaban..." value="${courseState.web.answers[11] || ''}" ${courseState.web.answers[11] ? 'disabled' : ''} onchange="checkEsai('web', 11, this.value, ['hypertext markup language'])">`;
            } else if (i === 12) {
                questions += `<div class="quiz-question">Kepanjangan CSS?</div>
                    <input type="text" class="esai-input ${courseState.web.answers[12] ? 'locked' : ''}" id="web-esai2" placeholder="Tulis jawaban..." value="${courseState.web.answers[12] || ''}" ${courseState.web.answers[12] ? 'disabled' : ''} onchange="checkEsai('web', 12, this.value, ['cascading style sheets'])">`;
            } else if (i === 13) {
                questions += `<div class="quiz-question">Fungsi utama HTML?</div>
                    <textarea class="esai-input ${courseState.web.answers[13] ? 'locked' : ''}" id="web-esai3" rows="2" placeholder="Jelaskan..." ${courseState.web.answers[13] ? 'disabled' : ''} onchange="checkEsaiLong('web', 13, this.value, ['struktur', 'kerangka', 'structure'])">${courseState.web.answers[13] || ''}</textarea>`;
            } else if (i === 14) {
                questions += `<div class="quiz-question">Fungsi utama CSS?</div>
                    <textarea class="esai-input ${courseState.web.answers[14] ? 'locked' : ''}" id="web-esai4" rows="2" placeholder="Jelaskan..." ${courseState.web.answers[14] ? 'disabled' : ''} onchange="checkEsaiLong('web', 14, this.value, ['tampilan', 'style', 'styling', 'desain'])">${courseState.web.answers[14] || ''}</textarea>`;
            } else if (i === 15) {
                questions += `<div class="quiz-question">Perbedaan HTML dan CSS?</div>
                    <textarea class="esai-input ${courseState.web.answers[15] ? 'locked' : ''}" id="web-esai5" rows="2" placeholder="Jelaskan..." ${courseState.web.answers[15] ? 'disabled' : ''} onchange="checkEsaiLong('web', 15, this.value, ['struktur', 'tampilan', 'kerangka', 'style'])">${courseState.web.answers[15] || ''}</textarea>`;
            }
        }
        
        // Add explanation div if answered
        if (courseState.web.answers[i]) {
            let expDivId = i <= 5 ? `web-pg${i}-explanation` : (i <= 10 ? `web-bs${i-5}-explanation` : `web-esai${i-10}-explanation`);
            questions += `<div id="${expDivId}" style="display:block;">
                <div class="explanation-card web">
                    <div class="explanation-title">
                        <i class="fas ${courseState.web.answers[i] === courseState.web.correctAnswers[i] || (i >= 11 && courseState.web.answers[i].toLowerCase().includes(courseState.web.correctAnswers[i])) ? 'fa-check-circle' : 'fa-times-circle'}" 
                           style="color: ${courseState.web.answers[i] === courseState.web.correctAnswers[i] || (i >= 11 && courseState.web.answers[i].toLowerCase().includes(courseState.web.correctAnswers[i])) ? 'var(--success)' : 'var(--danger)'};"></i>
                        <span style="color: ${courseState.web.answers[i] === courseState.web.correctAnswers[i] || (i >= 11 && courseState.web.answers[i].toLowerCase().includes(courseState.web.correctAnswers[i])) ? 'var(--success)' : 'var(--danger)'};">
                            ${courseState.web.answers[i] === courseState.web.correctAnswers[i] || (i >= 11 && courseState.web.answers[i].toLowerCase().includes(courseState.web.correctAnswers[i])) ? 'BENAR! +20 XP' : 'SALAH!'}
                        </span>
                    </div>
                    <div>${courseState.web.explanations[i]}</div>
                </div>
            </div>`;
        } else {
            let expDivId = i <= 5 ? `web-pg${i}-explanation` : (i <= 10 ? `web-bs${i-5}-explanation` : `web-esai${i-10}-explanation`);
            questions += `<div id="${expDivId}" style="display:none;"></div>`;
        }
        
        questions += `</div>`;
    }
    return questions;
}

// =============== GENERATE IOT HTML ===============
function generateIoTHTML() {
    // Similar structure to generateWebHTML but for IoT
    // (Kode lengkap untuk IoT ada di file terpisah, saya sertakan di bawah)
    return generateCourseHTML('iot', 'IoT & Robotics', 'fa-microchip', 'var(--iot)');
}

function generateIoTQuestions() {
    return generateCourseQuestions('iot');
}

// =============== GENERATE GAME HTML ===============
function generateGameHTML() {
    // Similar structure to generateWebHTML but for Game
    return generateCourseHTML('game', 'Game Development', 'fa-gamepad', 'var(--game)');
}

function generateGameQuestions() {
    return generateCourseQuestions('game');
}

// =============== GENERIC COURSE HTML GENERATOR ===============
function generateCourseHTML(course, title, icon, color) {
    const state = courseState[course];
    const iconColor = course === 'iot' ? 'var(--iot)' : course === 'game' ? 'var(--game)' : 'var(--web)';
    
    return `
        <div class="quiz-container">
            <div class="quiz-header">
                <div class="d-flex align-items-center gap-3">
                    <div class="progress-circle" id="${course}ProgressCircle">
                        <div class="progress-circle-inner" id="${course}ProgressText" style="color: ${color};">${state.currentQuestion}/15</div>
                    </div>
                    <div>
                        <h4 style="color: var(--dark); font-weight: 700; margin-bottom: 0.2rem;">
                            <i class="fas ${icon} me-2" style="color: ${iconColor};"></i>
                            ${title}
                        </h4>
                        <span style="color: #64748b;">Soal <span id="${course}CurrentQuestion">${state.currentQuestion}</span> dari 15</span>
                    </div>
                </div>
                <div>
                    <span class="badge p-3" style="background: var(--${course}-light); color: var(--${course}); font-size: 1.1rem; border-radius: 50px;">
                        <i class="fas fa-bolt me-2"></i><span id="${course}CurrentXP">${state.xp}</span>/300 XP
                    </span>
                </div>
            </div>

            <div id="${course}QuestionContainer">
                ${course === 'iot' ? generateIoTQuestions() : generateGameQuestions()}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2.5rem;">
                <button class="btn-ultimate btn-${course}" id="${course}PrevBtn" onclick="navigateQuestion('${course}', 'prev')" ${state.currentQuestion === 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left me-2"></i> Sebelumnya
                </button>
                <span id="${course}QuestionStatus" style="font-size: 1.1rem; font-weight: 600; color: var(--${course}); background: var(--${course}-light); padding: 0.5rem 1.5rem; border-radius: 30px;">
                    ${state.answers[state.currentQuestion] ? 
                        '<i class="fas fa-check-circle me-2" style="color: var(--success);"></i> Sudah dijawab' : 
                        '<i class="fas fa-hourglass-half me-2"></i> Belum menjawab'}
                </span>
                <button class="btn-ultimate btn-${course}" id="${course}NextBtn" onclick="navigateQuestion('${course}', 'next')" ${state.currentQuestion === 15 ? 'disabled' : ''}>
                    Selanjutnya <i class="fas fa-arrow-right ms-2"></i>
                </button>
            </div>
        </div>
        <div id="${course}ResultCard" class="result-card" style="display: none;"></div>
    `;
}

// =============== GENERIC COURSE QUESTIONS GENERATOR ===============
function generateCourseQuestions(course) {
    const state = courseState[course];
    let questions = '';
    
    for (let i = 1; i <= 15; i++) {
        questions += `<div id="${course}-q${i}" class="question-item" style="${i !== state.currentQuestion ? 'display:none;' : ''}">`;
        
        if (i <= 5) {
            // PG Questions
            questions += generatePGQuestion(course, i);
        } else if (i <= 10) {
            // BS Questions
            questions += generateBSQuestion(course, i);
        } else {
            // Essay Questions
            questions += generateEssayQuestion(course, i);
        }
        
        // Explanation
        if (state.answers[i]) {
            let isCorrect = state.answers[i] === state.correctAnswers[i] || 
                          (i >= 11 && state.answers[i].toLowerCase().includes(state.correctAnswers[i]));
            let expDivId = i <= 5 ? `${course}-pg${i}-explanation` : 
                          (i <= 10 ? `${course}-bs${i-5}-explanation` : `${course}-esai${i-10}-explanation`);
            
            questions += `<div id="${expDivId}" style="display:block;">
                <div class="explanation-card ${course}">
                    <div class="explanation-title">
                        <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}" 
                           style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'};"></i>
                        <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'};">${isCorrect ? 'BENAR! +20 XP' : 'SALAH!'}</span>
                    </div>
                    <div>${state.explanations[i]}</div>
                </div>
            </div>`;
        } else {
            let expDivId = i <= 5 ? `${course}-pg${i}-explanation` : 
                          (i <= 10 ? `${course}-bs${i-5}-explanation` : `${course}-esai${i-10}-explanation`);
            questions += `<div id="${expDivId}" style="display:none;"></div>`;
        }
        
        questions += `</div>`;
    }
    
    return questions;
}

// =============== HELPER FUNCTIONS FOR QUESTIONS ===============
function generatePGQuestion(course, i) {
    const state = courseState[course];
    let html = `<span class="question-type type-pg"><i class="fas fa-list me-2"></i>PILIHAN GANDA ${i}/5</span>`;
    
    if (course === 'iot') {
        // IoT PG Questions
        if (i === 1) {
            html += `<div class="quiz-question">Fungsi pinMode(13, OUTPUT) pada Arduino?</div>
                <div class="code-block iot"><span class="code-tag iot">Arduino</span><pre style="margin:0;">pinMode(13, OUTPUT);</pre></div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Membaca nilai dari pin 13'},
                    {letter: 'B', text: 'Mengatur pin 13 sebagai output'},
                    {letter: 'C', text: 'Menulis nilai HIGH ke pin 13'},
                    {letter: 'D', text: 'Menonaktifkan pin 13'}
                ])}`;
        } else if (i === 2) {
            html += `<div class="quiz-question">Sensor untuk suhu dan kelembaban?</div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Ultrasonic'},
                    {letter: 'B', text: 'DHT11'},
                    {letter: 'C', text: 'LDR'},
                    {letter: 'D', text: 'PIR'}
                ])}`;
        } else if (i === 3) {
            html += `<div class="quiz-question">ESP8266 adalah modul untuk?</div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Bluetooth'},
                    {letter: 'B', text: 'WiFi'},
                    {letter: 'C', text: 'Sensor suara'},
                    {letter: 'D', text: 'Motor driver'}
                ])}`;
        } else if (i === 4) {
            html += `<div class="quiz-question">digitalWrite(13, HIGH) akan?</div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Membaca nilai pin 13'},
                    {letter: 'B', text: 'Menyalakan LED di pin 13'},
                    {letter: 'C', text: 'Mematikan LED di pin 13'},
                    {letter: 'D', text: 'Mengatur pin sebagai input'}
                ])}`;
        } else if (i === 5) {
            html += `<div class="quiz-question">Platform IoT untuk kontrol via smartphone?</div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Arduino IDE'},
                    {letter: 'B', text: 'Blynk'},
                    {letter: 'C', text: 'Fritzing'},
                    {letter: 'D', text: 'Tinkercad'}
                ])}`;
        }
    } else if (course === 'game') {
        // Game PG Questions
        if (i === 1) {
            html += `<div class="quiz-question">Fungsi Start() dalam script Unity?</div>
                <div class="code-block game"><span class="code-tag game">C#</span><pre style="margin:0;">void Start() { }</pre></div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Dipanggil setiap frame'},
                    {letter: 'B', text: 'Dipanggil sekali saat game dimulai'},
                    {letter: 'C', text: 'Dipanggil saat objek di-destroy'},
                    {letter: 'D', text: 'Dipanggil saat terjadi collision'}
                ])}`;
        } else if (i === 2) {
            html += `<div class="quiz-question">Bahasa pemrograman utama Unity?</div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'C++'},
                    {letter: 'B', text: 'C#'},
                    {letter: 'C', text: 'Python'},
                    {letter: 'D', text: 'Java'}
                ])}`;
        } else if (i === 3) {
            html += `<div class="quiz-question">Fungsi yang dipanggil setiap frame?</div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Start()'},
                    {letter: 'B', text: 'Awake()'},
                    {letter: 'C', text: 'Update()'},
                    {letter: 'D', text: 'FixedUpdate()'}
                ])}`;
        } else if (i === 4) {
            html += `<div class="quiz-question">Komponen untuk deteksi tabrakan?</div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Rigidbody'},
                    {letter: 'B', text: 'Collider'},
                    {letter: 'C', text: 'Transform'},
                    {letter: 'D', text: 'Mesh Renderer'}
                ])}`;
        } else if (i === 5) {
            html += `<div class="quiz-question">Platform publishing game untuk mobile?</div>
                ${generatePGOptions(course, i, [
                    {letter: 'A', text: 'Steam'},
                    {letter: 'B', text: 'Google Play Store'},
                    {letter: 'C', text: 'Epic Games'},
                    {letter: 'D', text: 'Itch.io'}
                ])}`;
        }
    }
    
    return html;
}

function generatePGOptions(course, i, options) {
    const state = courseState[course];
    let html = '';
    
    options.forEach(opt => {
        let isSelected = state.answers[i] === opt.letter;
        let isCorrect = isSelected && opt.letter === state.correctAnswers[i];
        let isWrong = isSelected && opt.letter !== state.correctAnswers[i];
        
        html += `<div class="pg-option ${state.answers[i] ? 'locked' : ''} ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}" 
                       onclick="selectPG('${course}', ${i}, '${opt.letter}', this)">
                    <span class="option-letter">${opt.letter}</span>${opt.text}
                </div>`;
    });
    
    return html;
}

function generateBSQuestion(course, i) {
    const state = courseState[course];
    let bsNum = i - 5;
    let html = `<span class="question-type type-bs"><i class="fas fa-check-circle me-2"></i>BENAR/SALAH ${bsNum}/5</span>`;
    
    let questionText = '';
    if (course === 'iot') {
        if (i === 6) questionText = 'Arduino IDE menggunakan bahasa C++.';
        else if (i === 7) questionText = 'Sensor LDR digunakan untuk mengukur suhu.';
        else if (i === 8) questionText = 'Servo adalah contoh aktuator.';
        else if (i === 9) questionText = 'Bluetooth adalah sensor.';
        else if (i === 10) questionText = 'ESP32 memiliki WiFi dan Bluetooth.';
    } else if (course === 'game') {
        if (i === 6) questionText = 'GameObject adalah objek dasar di Unity.';
        else if (i === 7) questionText = 'FixedUpdate() dipanggil setiap frame.';
        else if (i === 8) questionText = 'Rigidbody digunakan untuk fisika.';
        else if (i === 9) questionText = 'Animation digunakan untuk audio.';
        else if (i === 10) questionText = 'Prefab adalah template objek.';
    }
    
    html += `<div class="quiz-question">${questionText}</div>
        <div class="bs-container">
            <div class="bs-option ${state.answers[i] ? 'locked' : ''} ${state.answers[i] === 'benar' ? 'selected correct' : ''}" onclick="selectBS('${course}', ${i}, 'benar', this)">
                <i class="fas fa-check-circle me-2" style="color:var(--success);"></i> BENAR
            </div>
            <div class="bs-option ${state.answers[i] ? 'locked' : ''} ${state.answers[i] === 'salah' ? 'selected correct' : ''}" onclick="selectBS('${course}', ${i}, 'salah', this)">
                <i class="fas fa-times-circle me-2" style="color:var(--danger);"></i> SALAH
            </div>
        </div>`;
    
    return html;
}

function generateEssayQuestion(course, i) {
    const state = courseState[course];
    let esaiNum = i - 10;
    let html = `<span class="question-type type-esai"><i class="fas fa-pencil-alt me-2"></i>ESAI ${esaiNum}/5</span>`;
    
    if (course === 'iot') {
        if (i === 11) {
            html += `<div class="quiz-question">Apa itu Arduino?</div>
                <textarea class="esai-input ${state.answers[11] ? 'locked' : ''}" id="iot-esai1" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[11] ? 'disabled' : ''} onchange="checkEsaiLong('iot', 11, this.value, ['mikrokontroler', 'microcontroller', 'arduino'])">${state.answers[11] || ''}</textarea>`;
        } else if (i === 12) {
            html += `<div class="quiz-question">Apa fungsi sensor DHT11?</div>
                <textarea class="esai-input ${state.answers[12] ? 'locked' : ''}" id="iot-esai2" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[12] ? 'disabled' : ''} onchange="checkEsaiLong('iot', 12, this.value, ['suhu', 'temperature', 'kelembaban', 'humidity'])">${state.answers[12] || ''}</textarea>`;
        } else if (i === 13) {
            html += `<div class="quiz-question">Apa yang dimaksud dengan sensor?</div>
                <textarea class="esai-input ${state.answers[13] ? 'locked' : ''}" id="iot-esai3" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[13] ? 'disabled' : ''} onchange="checkEsaiLong('iot', 13, this.value, ['input', 'mendeteksi', 'mengukur'])">${state.answers[13] || ''}</textarea>`;
        } else if (i === 14) {
            html += `<div class="quiz-question">Apa yang dimaksud dengan aktuator?</div>
                <textarea class="esai-input ${state.answers[14] ? 'locked' : ''}" id="iot-esai4" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[14] ? 'disabled' : ''} onchange="checkEsaiLong('iot', 14, this.value, ['output', 'menggerakkan', 'motor'])">${state.answers[14] || ''}</textarea>`;
        } else if (i === 15) {
            html += `<div class="quiz-question">Apa fungsi platform Blynk?</div>
                <textarea class="esai-input ${state.answers[15] ? 'locked' : ''}" id="iot-esai5" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[15] ? 'disabled' : ''} onchange="checkEsaiLong('iot', 15, this.value, ['iot', 'smartphone', 'kontrol', 'monitoring'])">${state.answers[15] || ''}</textarea>`;
        }
    } else if (course === 'game') {
        if (i === 11) {
            html += `<div class="quiz-question">Apa itu Unity?</div>
                <textarea class="esai-input ${state.answers[11] ? 'locked' : ''}" id="game-esai1" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[11] ? 'disabled' : ''} onchange="checkEsaiLong('game', 11, this.value, ['game engine', 'unity'])">${state.answers[11] || ''}</textarea>`;
        } else if (i === 12) {
            html += `<div class="quiz-question">Apa itu C#?</div>
                <textarea class="esai-input ${state.answers[12] ? 'locked' : ''}" id="game-esai2" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[12] ? 'disabled' : ''} onchange="checkEsaiLong('game', 12, this.value, ['bahasa pemrograman', 'programming language', 'c sharp'])">${state.answers[12] || ''}</textarea>`;
        } else if (i === 13) {
            html += `<div class="quiz-question">Apa fungsi Update() di Unity?</div>
                <textarea class="esai-input ${state.answers[13] ? 'locked' : ''}" id="game-esai3" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[13] ? 'disabled' : ''} onchange="checkEsaiLong('game', 13, this.value, ['setiap frame', 'per frame', 'loop'])">${state.answers[13] || ''}</textarea>`;
        } else if (i === 14) {
            html += `<div class="quiz-question">Apa fungsi Collider di Unity?</div>
                <textarea class="esai-input ${state.answers[14] ? 'locked' : ''}" id="game-esai4" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[14] ? 'disabled' : ''} onchange="checkEsaiLong('game', 14, this.value, ['tabrakan', 'collision', 'deteksi'])">${state.answers[14] || ''}</textarea>`;
        } else if (i === 15) {
            html += `<div class="quiz-question">Apa itu Transform di Unity?</div>
                <textarea class="esai-input ${state.answers[15] ? 'locked' : ''}" id="game-esai5" rows="2" placeholder="Tulis jawaban..." 
                    ${state.answers[15] ? 'disabled' : ''} onchange="checkEsaiLong('game', 15, this.value, ['posisi', 'rotasi', 'skala', 'position', 'rotation', 'scale'])">${state.answers[15] || ''}</textarea>`;
        }
    }
    
    return html;
}


// =============== GLOBAL STATE ===============
const courseState = {
    web: {
        currentQuestion: 1,
        totalQuestions: 15,
        answers: {
            1: null, 2: null, 3: null, 4: null, 5: null,
            6: null, 7: null, 8: null, 9: null, 10: null,
            11: null, 12: null, 13: null, 14: null, 15: null
        },
        correctAnswers: {
            1: 'A', 2: 'C', 3: 'B', 4: 'C', 5: 'A',
            6: 'salah', 7: 'benar', 8: 'salah', 9: 'benar', 10: 'salah',
            11: 'hypertext markup language', 12: 'cascading style sheets',
            13: 'struktur', 14: 'tampilan', 15: 'perbedaan'
        },
        explanations: {
            1: '✅ <strong>Jawaban: A</strong><br>HTML (HyperText Markup Language) berfungsi untuk membuat STRUKTUR/KERANGKA website. CSS (Cascading Style Sheets) berfungsi untuk membuat TAMPILAN/STYLE website.',
            2: '✅ <strong>Jawaban: C</strong><br>Tag &lt;h1&gt; sampai &lt;h6&gt; digunakan untuk heading. &lt;h1&gt; adalah yang TERBESAR, &lt;h6&gt; yang TERKECIL.',
            3: '✅ <strong>Jawaban: B</strong><br>Dalam CSS, titik (.) digunakan untuk memilih elemen berdasarkan CLASS. Pagar (#) digunakan untuk ID.',
            4: '✅ <strong>Jawaban: C</strong><br>Tag &lt;a&gt; (anchor) digunakan untuk membuat HYPERLINK. Atribut href menentukan tujuan link.',
            5: '✅ <strong>Jawaban: A</strong><br>Box Model CSS dari dalam ke luar: CONTENT (isi) → PADDING (jarak dalam) → BORDER (garis tepi) → MARGIN (jarak luar).',
            6: '❌ <strong>Jawaban: SALAH</strong><br>HTML BUKAN bahasa pemrograman, melainkan bahasa MARKUP (markup language). CSS juga bukan bahasa pemrograman.',
            7: '✅ <strong>Jawaban: BENAR</strong><br>CSS dapat ditulis INLINE dengan atribut style: &lt;p style="color:red;"&gt;. Juga bisa internal (&lt;style&gt;) atau eksternal (.css).',
            8: '❌ <strong>Jawaban: SALAH</strong><br>Satu elemen HTML bisa memiliki LEBIH DARI SATU CLASS, dipisah spasi. Contoh: class="btn btn-primary large"',
            9: '✅ <strong>Jawaban: BENAR</strong><br>ID harus UNIK dalam satu halaman HTML. Tidak boleh ada dua elemen dengan ID yang sama.',
            10: '❌ <strong>Jawaban: SALAH</strong><br>&lt;div&gt; adalah tag BLOCK-LEVEL, membuat baris baru dan mengambil lebar penuh. Tag inline: &lt;span&gt;, &lt;a&gt;, &lt;strong&gt;.',
            11: '✅ <strong>Jawaban: HyperText Markup Language</strong><br>HTML = HyperText Markup Language. HyperText = teks dengan link, Markup = menandai dengan tag, Language = bahasa.',
            12: '✅ <strong>Jawaban: Cascading Style Sheets</strong><br>CSS = Cascading Style Sheets. Cascading = aturan berjenjang, Style = gaya/tampilan, Sheets = lembaran.',
            13: '✅ <strong>Jawaban: Membuat struktur/kerangka website</strong><br>Fungsi utama HTML adalah membangun STRUKTUR dan KERANGKA halaman web. HTML seperti "tulang" yang membentuk layout.',
            14: '✅ <strong>Jawaban: Mengatur tampilan/estetika website</strong><br>Fungsi utama CSS adalah mengatur TAMPILAN, gaya, layout, warna, font, animasi. CSS seperti "pakaian" yang mempercantik website.',
            15: '✅ <strong>Jawaban: HTML untuk struktur, CSS untuk tampilan</strong><br>Perbedaan mendasar: HTML membangun KERANGKA (struktur), CSS mempercantik (presentasi).'
        },
        xp: 0,
        correctCount: 0,
        completed: false
    },
    iot: {
        currentQuestion: 1,
        totalQuestions: 15,
        answers: {
            1: null, 2: null, 3: null, 4: null, 5: null,
            6: null, 7: null, 8: null, 9: null, 10: null,
            11: null, 12: null, 13: null, 14: null, 15: null
        },
        correctAnswers: {
            1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'B',
            6: 'benar', 7: 'salah', 8: 'benar', 9: 'salah', 10: 'benar',
            11: 'arduino', 12: 'dht11', 13: 'sensor', 14: 'aktuator', 15: 'blynk'
        },
        explanations: {
            1: '✅ <strong>Jawaban: B</strong><br>pinMode(13, OUTPUT) = MENGATUR PIN 13 SEBAGAI OUTPUT. Fungsi ini mendeklarasikan apakah pin sebagai INPUT atau OUTPUT.',
            2: '✅ <strong>Jawaban: B</strong><br>DHT11/DHT22 adalah sensor SUHU dan KELEMBABAN. Ultrasonic = jarak, LDR = cahaya, PIR = gerakan.',
            3: '✅ <strong>Jawaban: B</strong><br>ESP8266 adalah modul WIFI. ESP32 = WiFi + Bluetooth.',
            4: '✅ <strong>Jawaban: B</strong><br>digitalWrite(13, HIGH) = MENYALAKAN LED di pin 13. LOW = mematikan.',
            5: '✅ <strong>Jawaban: B</strong><br>Blynk adalah platform IoT untuk KONTROL VIA SMARTPHONE. Arduino IDE = coding, Fritzing = desain rangkaian.',
            6: '✅ <strong>Jawaban: BENAR</strong><br>Arduino IDE menggunakan bahasa C++ yang disederhanakan.',
            7: '❌ <strong>Jawaban: SALAH</strong><br>Sensor LDR (Light Dependent Resistor) untuk CAHAYA, BUKAN suhu.',
            8: '✅ <strong>Jawaban: BENAR</strong><br>Servo adalah AKTUATOR (motor) yang bisa diatur posisinya.',
            9: '❌ <strong>Jawaban: SALAH</strong><br>Bluetooth adalah KONEKSI NIRKABEL, BUKAN sensor.',
            10: '✅ <strong>Jawaban: BENAR</strong><br>ESP32 memiliki WiFi dan Bluetooth dalam satu chip.',
            11: '✅ <strong>Jawaban: Arduino adalah mikrokontroler</strong><br>Arduino adalah platform MIKROKONTROLER open-source.',
            12: '✅ <strong>Jawaban: DHT11 = sensor suhu & kelembaban</strong><br>DHT11 mengukur SUHU dan KELEMBABAN udara.',
            13: '✅ <strong>Jawaban: Sensor = input device (mendeteksi)</strong><br>Sensor adalah perangkat INPUT yang mendeteksi perubahan fisik.',
            14: '✅ <strong>Jawaban: Aktuator = output device (menggerakkan)</strong><br>Aktuator adalah perangkat OUTPUT yang menggerakkan sesuatu.',
            15: '✅ <strong>Jawaban: Blynk = platform IoT</strong><br>Blynk adalah platform IoT untuk kontrol dan monitoring via smartphone.'
        },
        xp: 0,
        correctCount: 0,
        completed: false
    },
    game: {
        currentQuestion: 1,
        totalQuestions: 15,
        answers: {
            1: null, 2: null, 3: null, 4: null, 5: null,
            6: null, 7: null, 8: null, 9: null, 10: null,
            11: null, 12: null, 13: null, 14: null, 15: null
        },
        correctAnswers: {
            1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'B',
            6: 'benar', 7: 'salah', 8: 'benar', 9: 'salah', 10: 'benar',
            11: 'unity', 12: 'c sharp', 13: 'update', 14: 'collider', 15: 'transform'
        },
        explanations: {
            1: '✅ <strong>Jawaban: B</strong><br>Start() = DIPANGGIL SEKALI SAAT GAME DIMULAI. Biasanya untuk inisialisasi.',
            2: '✅ <strong>Jawaban: B</strong><br>C# adalah bahasa pemrograman UTAMA di Unity.',
            3: '✅ <strong>Jawaban: C</strong><br>Update() = DIPANGGIL SETIAP FRAME. Untuk logika game yang berulang.',
            4: '✅ <strong>Jawaban: B</strong><br>Collider = komponen untuk MENDETEKSI TABRAKAN.',
            5: '✅ <strong>Jawaban: B</strong><br>Google Play Store = platform PUBLISHING untuk Android.',
            6: '✅ <strong>Jawaban: BENAR</strong><br>GameObject adalah OBJEK DASAR di Unity. Semua entity adalah GameObject.',
            7: '❌ <strong>Jawaban: SALAH</strong><br>FixedUpdate() untuk FISIKA, dipanggil interval tetap, BUKAN setiap frame.',
            8: '✅ <strong>Jawaban: BENAR</strong><br>Rigidbody = komponen FISIKA (gravitasi, massa, velocity).',
            9: '❌ <strong>Jawaban: SALAH</strong><br>Animation = ANIMASI, BUKAN audio. Audio pakai AudioSource.',
            10: '✅ <strong>Jawaban: BENAR</strong><br>Prefab = TEMPLATE OBJEK yang bisa dipakai berulang.',
            11: '✅ <strong>Jawaban: Unity = game engine</strong><br>Unity adalah GAME ENGINE populer untuk 2D/3D.',
            12: '✅ <strong>Jawaban: C# = bahasa pemrograman</strong><br>C# (C Sharp) adalah bahasa pemrograman utama Unity.',
            13: '✅ <strong>Jawaban: Update() = per frame</strong><br>Update() dipanggil SETIAP FRAME.',
            14: '✅ <strong>Jawaban: Collider = deteksi tabrakan</strong><br>Collider mendeteksi TABRAKAN antar objek.',
            15: '✅ <strong>Jawaban: Transform = posisi, rotasi, skala</strong><br>Transform mengatur POSISI, ROTASI, dan SKALA objek.'
        },
        xp: 0,
        correctCount: 0,
        completed: false
    }
};

// =============== GLOBAL VARIABLES ===============
let activeCourse = null;
