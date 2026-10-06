// Sound & Music System (Web Audio API Synthesizer)
class AudioSystem {
    constructor() {
        this.ctx = null;
        this.isPlayingBGM = false;
        this.bgmTimer = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playNote(freq, type = 'sine', duration = 0.3, vol = 0.5) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.error(e);
        }
    }

    playClickSound() {
        this.init();
        this.playNote(523.25, 'triangle', 0.15, 0.4); // C5
    }

    playLockpadSound() {
        this.init();
        this.playNote(659.25, 'sine', 0.1, 0.5); // E5
    }

    playFlowerSound() {
        this.init();
        this.playNote(783.99, 'sine', 0.4, 0.6); // G5
        setTimeout(() => this.playNote(1046.50, 'sine', 0.5, 0.6), 150); // C6
    }

    playCardFlip() {
        this.init();
        this.playNote(440, 'sine', 0.1, 0.3);
    }

    startBGM() {
        this.init();
        if (this.isPlayingBGM) return;
        this.isPlayingBGM = true;

        // Soft melodic piano pattern (Canon inspired)
        const notes = [
            523.25, 659.25, 783.99, 1046.50, // C E G C
            392.00, 493.88, 587.33, 783.99,  // G B D G
            440.00, 523.25, 659.25, 880.00,  // A C E A
            329.63, 392.00, 493.88, 659.25,  // E G B E
            349.23, 440.00, 523.25, 698.46,  // F A C F
            261.63, 329.63, 392.00, 523.25   // C E G C
        ];
        
        let step = 0;
        this.bgmTimer = setInterval(() => {
            if (!this.isPlayingBGM) return;
            const freq = notes[step % notes.length];
            // Play note with 100% full volume sound profile
            this.playNote(freq, 'triangle', 1.2, 0.8);
            step++;
        }, 500);
    }

    toggleBGM() {
        if (this.isPlayingBGM) {
            this.isPlayingBGM = false;
            if (this.bgmTimer) clearInterval(this.bgmTimer);
            return false;
        } else {
            this.startBGM();
            return true;
        }
    }
}

const audio = new AudioSystem();

// Confetti System
function fireConfetti(type) {
    if (typeof confetti !== 'function') return;

    if (type === 'cute') {
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFB6C1', '#FFE4E1', '#E6E6FA']
        });
    } else if (type === 'jasmine') {
        confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#FFFFFF', '#FFF9C4', '#E8F5E9'],
            shapes: ['circle']
        });
    } else if (type === 'teddybear') {
        confetti({
            particleCount: 55,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#D7CCC8', '#FFCC80', '#FFE0B2']
        });
    } else if (type === 'love') {
        confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FF1744', '#FF80AB', '#FF4081']
        });
    } else if (type === 'riddles') {
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#80DEEA', '#B39DDB', '#FFE082']
        });
    } else if (type === 'angel') {
        confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.4 },
            colors: ['#FFFFFF', '#E0F7FA', '#FFF9C4']
        });
    }
}

// Global App State
const state = {
    currentPage: 1,
    userName: 'Kaka',
    lockpadInput: '',
    whispersRead: [false, false, false, false, false],
    currentWhisperNote: null,
    riddle1Solved: false,
    riddle2Solved: false,
    activeRiddleNote: null,
    quizAnswers: {},
    quizScore: 0,
    kakaAnswers: {},
    memoryCards: ['🧸', '🧸', '🌸', '🌸', '👼', '👼', '💖', '💖'],
    memoryFlipped: [],
    memoryMatched: []
};

// Application Router & Page Renderers
function renderPage(pageNum) {
    state.currentPage = pageNum;
    const app = document.getElementById('app');
    
    // Auto-trigger BGM on first interaction
    if (!audio.isPlayingBGM) {
        audio.startBGM();
        const bgmBtn = document.getElementById('bgm-toggle-btn');
        if (bgmBtn) bgmBtn.innerText = "🎵 Pause Music";
    }

    switch (pageNum) {
        case 1:
            fireConfetti('cute');
            app.innerHTML = `
                <div class="page-card">
                    <div class="decor-icon">🧸🌸👼</div>
                    <h1 class="main-title">About you and me : How close are you?</h1>
                    <h2 class="sub-title">Tentang kaka dan Ami : Seberapa deket sih kita?</h2>
                    <button class="btn-primary" onclick="nextPage(2)">Start a games 💖</button>
                </div>
            `;
            break;

        case 2:
            state.lockpadInput = '';
            app.innerHTML = renderLockpadPage({
                title: "Lockpad 1",
                question: "Masih inget kode lockpad kemarin?",
                correctCode: "101110",
                nextPageNum: 3,
                confettiType: 'jasmine'
            });
            break;

        case 3:
            app.innerHTML = `
                <div class="page-card">
                    <h1 class="main-title">Titipan Ami buat kaka</h1>
                    <div style="margin: 15px 0;">
                        <button class="envelope-flower-btn" onclick="openLetterContent()">🌸</button>
                        <p style="font-size:0.85rem; color:#888;">Ketuk ikon bunga untuk membuka surat</p>
                    </div>
                    <div id="letter-content" style="display:none;" class="envelope-container">
                        <p class="content-text">
                        "Hi kaka! Ami punya surat nih buat kaka! Mungkin ini keliatannya cuma sebuah website kecil yang isinya beberapa halaman and pertanyaan - pertanyaan random. Tapi sebenernya, ada sedikit cerita dari Ami yang masukin ke dalem setiap bagian di sini. Ami bikin ini bukan karena Ami jago coding, malah awalnya Ami sendiri sempat bingung harus pencet apa, harus mulai dari mana, and beberapa kali hampir nyerah karena ribet. Tapi Ami tetap lanjutin. Ami ngga tau nanti kaka bakal bereaksi kaya apa abis buka semuanya. Yang jelas, setiap halaman di sini Ami buat dengan niat and Ami pikirin satu-satu. Jadi, sebelum kaka lanjut ke halaman berikutnya, Ami cuma mau bilang terima kasih udah jadi seseorang yang cukup berarti sampe Ami rela duduk berjam-jam di depan laptop dapur buat bikin beginian. Sekarang, jangan cuma baca suratnya. Lanjutin sampe akhir, karena masih ada beberapa hal yang sengaja Ami sembunyiin di dalemnya.<br><br>Have fun, kaka!"
                        </p>
                    </div>
                    <button class="btn-primary" onclick="fireConfetti('jasmine'); nextPage(4)">Next page</button>
                </div>
            `;
            break;

        case 4:
            state.lockpadInput = '';
            app.innerHTML = renderLockpadPage({
                title: "Lockpad 2",
                question: "Do you remember your date of birth?",
                correctCode: "02092007",
                nextPageNum: 5,
                confettiType: 'teddybear'
            });
            break;

        case 5:
            renderSecretWhispersPage();
            break;

        case 6:
            renderRiddlesPage();
            break;

        case 7:
            state.lockpadInput = '';
            app.innerHTML = renderLockpadPage({
                title: "Lockpad 3",
                question: "Masih inget angka favorite Ami?",
                correctCode: "030661",
                nextPageNum: 8,
                confettiType: 'angel'
            });
            break;

        case 8:
            app.innerHTML = `
                <div class="page-card">
                    <div class="decor-icon">📝✨</div>
                    <div class="note-box" style="text-align:center;">
                        <h2 style="font-family:var(--font-heading); color:var(--dark-pink);">"Okay! Next to the question random!"</h2>
                    </div>
                    <button class="btn-primary" onclick="nextPage(9)">Next to the quest</button>
                </div>
            `;
            break;

        case 9:
            app.innerHTML = `
                <div class="page-card">
                    <h1 class="main-title">Sebelum Mulai Kuis</h1>
                    <p class="content-text">Masukkan nama kaka dulu yaa!</p>
                    <input type="text" id="user-name-input" class="custom-input" placeholder="Enter your name here" value="${state.userName !== 'Kaka' ? state.userName : ''}">
                    <button class="btn-primary" onclick="saveNameAndStart()">Simpan & Mulai Kuis 🚀</button>
                </div>
            `;
            break;

        // Quiz Questions 1 to 10 (Pages 10 to 19)
        case 10:
            renderQuizPage(10, "1. Kalau Ami jadi hewan, menurut kaka Ami bakal jadi apa?", [
                { text: "a. Kucing", correct: false },
                { text: "b. Anjing", correct: false },
                { text: "c. Babi", correct: false },
                { text: "d. Ga mau semuanya", correct: true }
            ]);
            break;

        case 11:
            renderQuizPage(11, "2. Ami lebih pilih pantai atau pegunungan?", [
                { text: "a. Pantai", correct: false },
                { text: "b. Pegunungan", correct: false },
                { text: "c. Dua - duanya Ami pilih", correct: false },
                { text: "d. G dua - duanya karna Ami gasuka alam", correct: true }
            ]);
            break;

        case 12:
            renderQuizPage(12, "3. Menurut kaka, siapa yang lebih gampang cemburu, Ami atau kaka?", [
                { text: "a. Ami", correct: true },
                { text: "b. Kaka", correct: true },
                { text: "c. Dua - duanya", correct: true },
                { text: "d. Ga dua - duanya", correct: true }
            ]);
            break;

        case 13:
            renderQuizPage(13, "4. Ami suka warna apa?", [
                { text: "a. Pink", correct: false },
                { text: "b. Pinky Sweet", correct: false },
                { text: "c. Pink Pastel", correct: true },
                { text: "d. Pink Soft", correct: false }
            ]);
            break;

        case 14:
            renderQuizPage(14, "5. \"Ami tuh cewe atau cowo?\"", [
                { text: "a. Cewe", correct: false },
                { text: "b. Cowo", correct: false },
                { text: "c. All role", correct: false },
                { text: "d. Non gender", correct: true }
            ]);
            break;

        case 15:
            renderQuizPage(15, "6. Apa kebiasaan buruk Ami?", [
                { text: "a. Ngga sayang barang/benda", correct: true },
                { text: "b. Boros belanja", correct: true },
                { text: "c. Ngga bisa jaga ucapan", correct: true },
                { text: "d. Physical Attack", correct: true }
            ]);
            break;

        case 16:
            renderQuizPage(16, "7. Masih inget makanan kesukaan Ami?", [
                { text: "a. Pie Cherry", correct: false },
                { text: "b. Eclaire", correct: false },
                { text: "c. Blueberry Cheesecake", correct: true },
                { text: "d. Croissant", correct: false }
            ]);
            break;

        case 17:
            renderQuizPage(17, "8. \"Setiap Ami sekolah, beberapa orang mencium aroma bunga mistis dari tubuh Ami\" yang dimaksud 'bunga mistis' yaitu bunga..", [
                { text: "a. Lavender", correct: false },
                { text: "b. Melati", correct: true },
                { text: "c. Tulip", correct: false },
                { text: "d. Lili", correct: false }
            ]);
            break;

        case 18:
            renderQuizPage(18, "9. Ami suka bunga apa?", [
                { text: "a. Bougenville", correct: false },
                { text: "b. Peoni", correct: false },
                { text: "c. Amarilis", correct: false },
                { text: "d. Melati", correct: true }
            ]);
            break;

        case 19:
            renderQuizPage(19, "10. Dari kesekian banyaknya bunga, kenapa Ami pilih bunga Melati (Melur/Yasmin)?", [
                { text: "a. Aromanya harum", correct: true },
                { text: "b. Simbol cinta dan kasih sayang", correct: true },
                { text: "c. Tanda pangkat perwira menengah dalam ketentaraan dan kepolisian", correct: true },
                { text: "d. Simbol kesucian dan kejujuran", correct: true }
            ]);
            break;

        case 20:
            fireConfetti('jasmine');
            renderScoreboardPage();
            break;

        case 21:
            app.innerHTML = `
                <div class="page-card">
                    <div class="decor-icon">💌</div>
                    <div class="note-box" style="text-align:center;">
                        <h2 style="font-family:var(--font-heading); color:var(--dark-pink);">"Hai kaka! sekarang giliran Ami yang nanya soal diri kaka."</h2>
                    </div>
                    <button class="btn-primary" onclick="nextPage(22)">Next ➡️</button>
                </div>
            `;
            break;

        // Open-ended Questions 1 to 10 (Pages 22 to 31)
        case 22: renderKakaQuestionPage(22, "1. \"Kaka suka warna apa?\""); break;
        case 23: renderKakaQuestionPage(23, "2. \"Makanan kesukaan kaka apa sih?\""); break;
        case 24: renderKakaQuestionPage(24, "3. \"Kalo kaka badmood, kaka suka ngapain?\""); break;
        case 25: renderKakaQuestionPage(25, "4. \"Apa yang kaka suka dari Ami?\""); break;
        case 26: renderKakaQuestionPage(26, "5. \"Kaka cemburuan ngga?\""); break;
        case 27: renderKakaQuestionPage(27, "6. \"Kaka tau ga Ami judes ke semua orang yang ga dikenal karna apa?\""); break;
        case 28: renderKakaQuestionPage(28, "7. \"Biasanya, kaka suka menyendiri dimana?\""); break;
        case 29: renderKakaQuestionPage(29, "8. \"Hal yang kaka suka apa sih?\""); break;
        case 30: renderKakaQuestionPage(30, "9. \"Kaka punya barang/benda kesayangan ga? Apa itu?\""); break;
        case 31: renderKakaQuestionPage(31, "10. \"Apa hal yang kaka takutin?\""); break;

        case 32:
            renderKakaSummaryPage();
            break;

        case 33:
            app.innerHTML = `
                <div class="page-card">
                    <div class="decor-icon">🎉🥳</div>
                    <div class="note-box" style="text-align:center;">
                        <p class="content-text">
                        "Hi kakaa! congrats yaw, kaka dah sampe ujung web nih. huhuuu capee benerr Ami coding ini sampe subuh. Tapi seru wkwk. Eh.. Ami tambahin lagi deh, kali ini bukan kuis lagi ko ehehe.<br><b>Let's play the game!</b>"
                        </p>
                    </div>
                    <button class="btn-primary" onclick="nextPage(34)">Play Game 🎮</button>
                </div>
            `;
            break;

        case 34:
            renderMemoryGamePage();
            break;

        case 35:
            app.innerHTML = `
                <div class="page-card">
                    <div class="decor-icon">🧸💖🌸</div>
                    <div class="note-box" style="text-align:center;">
                        <p class="content-text">
                        "Okay, tiba di ujung web. Thanks, untuk kaka yang udah selesain semua kuis and hal hal random lainnya. Web ini buat kaka, boleh disimpen juga buat pribadi. So.. Let's end this and.. bye bye!"
                        </p>
                    </div>
                    <button class="btn-primary" onclick="nextPage(36)">Selesai ❤️</button>
                </div>
            `;
            break;

        case 36:
            app.innerHTML = `
                <div class="page-card">
                    <div class="decor-icon">👼🌸✨</div>
                    <h1 class="main-title">Terima Kasih, Kaka!</h1>
                    <p class="content-text" style="margin-top:15px;">Dibuat dengan penuh niat oleh Ami 💕</p>
                    <button class="btn-primary" onclick="nextPage(1)">Ulangi Dari Awal 🔄</button>
                </div>
            `;
            break;
    }
}

function nextPage(pageNum) {
    audio.playClickSound();
    renderPage(pageNum);
}

// Lockpad Helper Renderer
function renderLockpadPage({ title, question, correctCode, nextPageNum, confettiType }) {
    return `
        <div class="page-card">
            <h1 class="main-title">${title}</h1>
            <p class="content-text">${question}</p>
            <div id="lockpad-val" class="lockpad-display">******</div>
            <div class="lockpad-grid">
                ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="lockpad-btn" onclick="pressLockpad('${n}', '${correctCode}',${nextPageNum}, '${confettiType}')">${n}</button>`).join('')}
                <button class="lockpad-btn" onclick="clearLockpad()">C</button>
                <button class="lockpad-btn" onclick="pressLockpad('0', '${correctCode}', ${nextPageNum}, '${confettiType}')">0</button>
                <button class="lockpad-btn" onclick="checkLockpad('${correctCode}', ${nextPageNum}, '${confettiType}')">OK</button>
            </div>
        </div>
    `;
}

function pressLockpad(digit, correctCode, nextPageNum, confettiType) {
    audio.playLockpadSound();
    if (state.lockpadInput.length < 8) {
        state.lockpadInput += digit;
        const disp = document.getElementById('lockpad-val');
        if (disp) disp.innerText = '*'.repeat(state.lockpadInput.length);
    }
    if (state.lockpadInput === correctCode) {
        setTimeout(() => checkLockpad(correctCode, nextPageNum, confettiType), 150);
    }
}

function clearLockpad() {
    audio.playClickSound();
    state.lockpadInput = '';
    const disp = document.getElementById('lockpad-val');
    if (disp) disp.innerText = '******';
}

function checkLockpad(correctCode, nextPageNum, confettiType) {
    if (state.lockpadInput === correctCode) {
        fireConfetti(confettiType);
        nextPage(nextPageNum);
    } else {
        audio.playClickSound();
        alert("Kode salah, coba lagi ya kaka!");
        clearLockpad();
    }
}

// Envelope / Letter trigger
function openLetterContent() {
    audio.playFlowerSound();
    const content = document.getElementById('letter-content');
    if (content) content.style.display = 'block';
}

// Secret Whispers Renderer (Page 5)
function renderSecretWhispersPage() {
    const app = document.getElementById('app');
    if (state.currentWhisperNote !== null) {
        let title = "";
        let text = "";
        switch (state.currentWhisperNote) {
            case 0:
                title = "Things I like about you";
                text = "Hal yang Ami suka dari kaka :<br>1. Senyum kaka<br>2. Cara kaka memperlakukan Ami<br>3. Sifat kaka yang apa adanya<br>4. Cara kaka bikin Ami nyaman<br>5. Diri kaka yang sekarang";
                break;
            case 1:
                title = "When we first met";
                text = "Awal kenal, kaka tegur Ami di lorong perpustakaan Negroe. Ami bingung, kenapa kaka bisa kenal Ami? Kita memang satu SD, tapi itu bukan berarti kita saling kenal. Kaka inget dm an pertama kaka di ig? kalo Ami ga bales hari itu.. kayanya kita gaakan sedeket ini wkwk :)";
                break;
            case 2:
                title = "How did I fall in love?";
                text = "Mau tau? Jadi gini, awalnya mungkin cuma karena sering ngobrol di ig, becanda, atau karna Ami mulai terbiasa sama kehadiran kaka. Tapi, semakin lama Ami mulai sadar kalau ada sesuatu yang beda. Hal - hal sederhana yang kaka lakukan ternyata perlahan punya tempat sendiri di pikiran Ami.";
                break;
            case 3:
                title = "My efforts to get you";
                text = "Ami mulai ngejar kaka, dengan nyimpen screenshot an kontak wa kaka yang terdapat nomor wa kaka sendiri. Disitu Ami langsung save nomor kaka setelah lost contact di ig. Chat dimulai dari modus hingga pertanyaan - pertanyaan nyeleneh. Yeah, u know.. Kalo Ami suka duluan, bakal Ami kejar sampai targetnya ikut jatuh hati.";
                break;
            case 4:
                title = "My Conclusion";
                text = "Ami bersyukur pernah ketemu kaka.<br>Dari awal yang mungkin terlihat biasa aja, ternyata banyak hal kecil tentang kaka yang perlahan membuat Ami nyaman, senang, dan akhirnya jatuh hati. Kaka pernah menjadi seseorang yang memberikan warna di hari-hari Ami, and untuk itu Ami bener - bener menghargai kaka.";
                break;
        }

        app.innerHTML = `
            <div class="page-card">
                <h1 class="main-title">${title}</h1>
                <div class="note-box">
                    <p class="content-text" style="margin:0;">${text}</p>
                </div>
                <button class="btn-primary" onclick="closeWhisperNote()">Back to the secret whispers page</button>
            </div>
        `;
        return;
    }

    const allRead = state.whispersRead.every(v => v === true);

    app.innerHTML = `
        <div class="page-card">
            <h1 class="main-title">Secret Whispers</h1>
            <div class="whisper-list">
                <button class="whisper-btn ${state.whispersRead[0] ? 'read' : ''}" onclick="openWhisperNote(0)">Things I like about you</button>
                <button class="whisper-btn ${state.whispersRead[1] ? 'read' : ''}" onclick="openWhisperNote(1)">When we first met</button>
                <button class="whisper-btn ${state.whispersRead[2] ? 'read' : ''}" onclick="openWhisperNote(2)">How did I fall in love?</button>
                <button class="whisper-btn ${state.whispersRead[3] ? 'read' : ''}" onclick="openWhisperNote(3)">My efforts to get you</button>
                <button class="whisper-btn ${state.whispersRead[4] ? 'read' : ''}" onclick="openWhisperNote(4)">My Conclusion</button>
            </div>
            ${allRead ? `<button class="btn-primary" onclick="fireConfetti('love'); nextPage(6)">Next ➡️</button>` : `<p style="font-size:0.85rem; color:#888; margin-top:10px;">Baca kelima bisikan di atas untuk melanjutkan</p>`}
        </div>
    `;
}

function openWhisperNote(idx) {
    audio.playClickSound();
    state.whispersRead[idx] = true;
    state.currentWhisperNote = idx;
    renderSecretWhispersPage();
}

function closeWhisperNote() {
    audio.playClickSound();
    state.currentWhisperNote = null;
    renderSecretWhispersPage();
}

// Riddles Renderer (Page 6)
function renderRiddlesPage() {
    const app = document.getElementById('app');

    if (state.activeRiddleNote === 1) {
        app.innerHTML = `
            <div class="page-card">
                <h1 class="main-title">Riddles 1</h1>
                <div class="note-box">
                    <p class="content-text">
                    "Aku selalu dekat denganmu,<br>tapi tidak bisa engkau sentuh.<br>Aku bisa membuatmu tersenyum,<br>bahkan tanpa mengatakan apa - apa.<br>Siapakah aku?"
                    </p>
                </div>
                <div class="quiz-options">
                    <button class="quiz-opt-btn" onclick="answerRiddle(1, 'a')">a. Kenangan</button>
                    <button class="quiz-opt-btn" onclick="answerRiddle(1, 'b')">b. Luka</button>
                    <button class="quiz-opt-btn" onclick="answerRiddle(1, 'c')">c. Kebahagiaan</button>
                    <button class="quiz-opt-btn" onclick="answerRiddle(1, 'd')">d. Achievement</button>
                </div>
            </div>
        `;
        return;
    }

    if (state.activeRiddleNote === 2) {
        app.innerHTML = `
            <div class="page-card">
                <h1 class="main-title">Riddles 2</h1>
                <div class="note-box">
                    <p class="content-text">
                    "Aku tidak punya suara,<br>tapi bisa membuat hati berdebar.<br>Aku tidak punya tangan,<br>tapi bisa membuatmu merasa dipeluk.<br>Aku tidak bisa dilihat,<br>tapi keberadaanku bisa dirasakan.<br>Apakah aku?"
                    </p>
                </div>
                <div class="quiz-options">
                    <button class="quiz-opt-btn" onclick="answerRiddle(2, 'a')">a. Luka</button>
                    <button class="quiz-opt-btn" onclick="answerRiddle(2, 'b')">b. Perasaan</button>
                    <button class="quiz-opt-btn" onclick="answerRiddle(2, 'c')">c. Kehidupan</button>
                    <button class="quiz-opt-btn" onclick="answerRiddle(2, 'd')">d. Perjalanan hidup</button>
                </div>
            </div>
        `;
        return;
    }

    const bothSolved = state.riddle1Solved && state.riddle2Solved;

    app.innerHTML = `
        <div class="page-card">
            <h1 class="main-title">Riddles</h1>
            <div class="whisper-list">
                ${!state.riddle1Solved ? 
                    `<button class="whisper-btn" onclick="openRiddle(1)">Riddles 1</button>` : 
                    `<button class="whisper-btn read" disabled>Riddles 1 (Selesai ✨)</button>`}
                
                ${!state.riddle2Solved ? 
                    `<button class="whisper-btn" onclick="openRiddle(2)">Riddles 2</button>` : 
                    `<button class="whisper-btn read" disabled>Riddles 2 (Selesai ✨)</button>`}
            </div>
            ${bothSolved ? `<button class="btn-primary" onclick="fireConfetti('riddles'); nextPage(7)">Next ➡️</button>` : ''}
        </div>
    `;
}

function openRiddle(num) {
    audio.playClickSound();
    state.activeRiddleNote = num;
    renderRiddlesPage();
}

function answerRiddle(num, choice) {
    audio.playClickSound();
    if (num === 1) {
        if (choice === 'a') {
            state.riddle1Solved = true;
            state.activeRiddleNote = null;
            renderRiddlesPage();
        } else {
            alert("Jawaban salah! Coba lagi ya kaka 😄");
        }
    } else if (num === 2) {
        if (choice === 'b') {
            state.riddle2Solved = true;
            state.activeRiddleNote = null;
            renderRiddlesPage();
        } else {
            alert("Jawaban salah! Coba lagi ya kaka 😄");
        }
    }
}

// Name capture
function saveNameAndStart() {
    audio.playClickSound();
    const val = document.getElementById('user-name-input').value.trim();
    if (val) {
        state.userName = val;
    } else {
        state.userName = "Kaka";
    }
    nextPage(10);
}

// Multiple Choice Quiz Renderer
function renderQuizPage(pageNum, questionText, options) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="page-card">
            <h1 class="main-title">Random Question</h1>
            <p class="content-text" style="font-weight:700;">${questionText}</p>
            <div class="quiz-options">
                ${options.map((opt, i) => `
                    <button class="quiz-opt-btn" onclick="submitQuizAnswer(${pageNum},${opt.correct}, '${opt.text}')">${opt.text}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function submitQuizAnswer(pageNum, isCorrect, textSelected) {
    audio.playClickSound();
    state.quizAnswers[pageNum] = {
        isCorrect: isCorrect,
        text: textSelected
    };
    if (isCorrect) state.quizScore += 10;

    nextPage(pageNum + 1);
}

// Scoreboard Renderer (Page 20)
function renderScoreboardPage() {
    const app = document.getElementById('app');
    
    let itemsHTML = '';
    for (let p = 10; p <= 19; p++) {
        const qNum = p - 9;
        const ans = state.quizAnswers[p];
        const isRight = ans ? ans.isCorrect : false;
        itemsHTML += `
            <div class="score-item ${isRight ? 'correct' : 'wrong'}">
                <span>Soal ${qNum}: ${isRight ? 'Benar ✨' : 'Salah ❌'}</span>
            </div>
        `;
    }

    app.innerHTML = `
        <div class="page-card">
            <h1 class="main-title">Papan Skor</h1>
            <p class="content-text">Nama: <b>${state.userName}</b><br>Nilai Kuis: <b>${state.quizScore} / 100</b></p>
            <div class="score-list">
                ${itemsHTML}
            </div>
            <p style="font-size:0.85rem; color:#888; margin:10px 0;">Jangan lupa screenshot, Ami pengen tau juga ehehe</p>
            <button class="btn-primary" onclick="nextPage(21)">Lanjut ➡️</button>
        </div>
    `;
}

// Open-ended Question Page Renderer
function renderKakaQuestionPage(pageNum, questionText) {
    const app = document.getElementById('app');
    const existingVal = state.kakaAnswers[pageNum] || '';
    app.innerHTML = `
        <div class="page-card">
            <h1 class="main-title">Question</h1>
            <p class="content-text" style="font-weight:700;">${questionText}</p>
            <input type="text" id="kaka-ans-input" class="custom-input" placeholder="Tulis jawaban kaka..." value="${existingVal}">
            <button class="btn-primary" onclick="submitKakaAnswer(${pageNum})">Next ➡️</button>
        </div>
    `;
}

function submitKakaAnswer(pageNum) {
    audio.playClickSound();
    const val = document.getElementById('kaka-ans-input').value.trim();
    state.kakaAnswers[pageNum] = val || '(Tidak diisi)';
    nextPage(pageNum + 1);
}

// Answers Summary Renderer (Page 32)
function renderKakaSummaryPage() {
    const app = document.getElementById('app');
    
    const questions = [
        "1. Kaka suka warna apa?",
        "2. Makanan kesukaan kaka apa sih?",
        "3. Kalo kaka badmood, kaka suka ngapain?",
        "4. Apa yang kaka suka dari Ami?",
        "5. Kaka cemburuan ngga?",
        "6. Kaka tau ga Ami judes ke semua orang...",
        "7. Biasanya, kaka suka menyendiri dimana?",
        "8. Hal yang kaka suka apa sih?",
        "9. Kaka punya barang/benda kesayangan ga?",
        "10. Apa hal yang kaka takutin?"
    ];

    let listHTML = '';
    for (let i = 0; i < 10; i++) {
        const pageNum = 22 + i;
        const ans = state.kakaAnswers[pageNum] || '-';
        listHTML += `
            <div style="text-align:left; font-size:0.88rem; margin-bottom:8px; border-bottom:1px dashed #FFB6C1; padding-bottom:4px;">
                <b>${questions[i]}</b><br>
                <span style="color:var(--dark-pink);">${ans}</span>
            </div>
        `;
    }

    app.innerHTML = `
        <div class="page-card">
            <h1 class="main-title">Jawaban Kaka</h1>
            <div class="score-list" style="max-height:260px;">
                ${listHTML}
            </div>
            <p style="font-size:0.85rem; color:#888; margin:10px 0;">Jangan lupa screenshot hasil jawabannya ke Ami ya! Ami juga kepo :)</p>
            <button class="btn-primary" onclick="nextPage(33)">Lanjut ➡️</button>
        </div>
    `;
}

// Memory Match Game Renderer (Page 34)
function renderMemoryGamePage() {
    const app = document.getElementById('app');

    if (state.memoryCards.length === 8 && state.memoryFlipped.length === 0 && state.memoryMatched.length === 0) {
        state.memoryCards.sort(() => Math.random() - 0.5);
    }

    const cardsHTML = state.memoryCards.map((symbol, idx) => {
        const isFlipped = state.memoryFlipped.includes(idx) || state.memoryMatched.includes(idx);
        return `
            <div class="memory-card ${isFlipped ? 'flipped' : ''}" onclick="flipMemoryCard(${idx})">
                ${isFlipped ? symbol : '❓'}
            </div>
        `;
    }).join('');

    const isWin = state.memoryMatched.length === state.memoryCards.length;

    app.innerHTML = `
        <div class="page-card">
            <h1 class="main-title">Memory Match Game</h1>
            <p class="content-text">Cari pasangan kartu yang sama ya!</p>
            <div class="memory-grid">
                ${cardsHTML}
            </div>
            ${isWin ? `<button class="btn-primary" onclick="fireConfetti('cute'); nextPage(35)">Lanjut ➡️</button>` : ''}
        </div>
    `;
}

function flipMemoryCard(idx) {
    if (state.memoryFlipped.length >= 2) return;
    if (state.memoryFlipped.includes(idx) || state.memoryMatched.includes(idx)) return;

    audio.playCardFlip();
    state.memoryFlipped.push(idx);
    renderMemoryGamePage();

    if (state.memoryFlipped.length === 2) {
        const [first, second] = state.memoryFlipped;
        if (state.memoryCards[first] === state.memoryCards[second]) {
            state.memoryMatched.push(first, second);
            state.memoryFlipped = [];
            renderMemoryGamePage();
        } else {
            setTimeout(() => {
                state.memoryFlipped = [];
                renderMemoryGamePage();
            }, 800);
        }
    }
}

// DOM Setup
window.addEventListener('DOMContentLoaded', () => {
    // Setup Music Toggle Button
    const bgmBtn = document.getElementById('bgm-toggle-btn');
    if (bgmBtn) {
        bgmBtn.addEventListener('click', () => {
            const isPlaying = audio.toggleBGM();
            bgmBtn.innerText = isPlaying ? "🎵 Pause Music" : "🎵 Play Music";
        });
    }

    // Initial Render
    renderPage(1);
});
