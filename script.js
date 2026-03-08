/* =========================================
   0. BOOT SEQUENCE
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const bootScreen = document.getElementById('boot-screen');
    const terminal = document.getElementById('boot-terminal');
    const progressBar = document.getElementById('boot-bar');
    const memCount = document.getElementById('mem-count');
    
    const bootLog = [
        "Проверяю наличие подписки на канал... [1/1 OK]",
        "Создаю фикс пресета...",
        "На самом деле это не загрузка...",
        "Мне просто хотелось прикольных анимаций на сайте...",
        "Добавляю фикс пресета, пока сайт не загрузился...",
        "Проверяю уровень вашего терпения... [0/100 НЕ OK]",
        "Ускоряю взлом данных на 200%...",
        "Доступ на сайт выдан."
    ];

    let lineIndex = 0;
    let totalMem = 0;

    function addBootLine() {
        if (lineIndex < bootLog.length) {
            const p = document.createElement('div');
            p.className = 'boot-line';
            p.innerHTML = `<span class="prefix">>></span> ${bootLog[lineIndex]} <span class="ok">[OK]</span>`;
            terminal.appendChild(p);
            const percent = Math.round(((lineIndex + 1) / bootLog.length) * 100);
            progressBar.style.width = `${percent}%`;
            lineIndex++;
            const randomDelay = Math.random() * 400 + 100;
            setTimeout(addBootLine, randomDelay);
        } else {
            setTimeout(() => {
                bootScreen.classList.add('loaded');
                setTimeout(() => { bootScreen.remove(); }, 500);
            }, 800);
        }
    }

    const memInterval = setInterval(() => {
        totalMem += 1024;
        memCount.innerText = totalMem;
        if (totalMem >= 69696) clearInterval(memInterval);
    }, 20);

    addBootLine();
});

/* =========================================
   1. ЛОГИКА ТЕРМИНАЛА
   ========================================= */
function runCommand(tabName) {
    document.getElementById('current-path').innerText = `root/home/${tabName}`;
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.remove('active-tab'));
    const cmds = document.querySelectorAll('.cmd-item');
    cmds.forEach(c => c.classList.remove('active'));
    
    const targetTab = document.getElementById(tabName);
    if(targetTab) targetTab.classList.add('active-tab');
    
    const activeCmd = Array.from(cmds).find(c => c.getAttribute('onclick').includes(tabName));
    if(activeCmd) activeCmd.classList.add('active');

    addLogEntry(`ВЫПОЛНИТЬ: ./${tabName}.mod`);
}

/* =========================================
   2. ЛОГЕР
   ========================================= */
const logContainer = document.getElementById('traffic-log');
const logMessages = [
    "Хочу Дотторе...", "Ах, Шино...", "Ах, Астера...",
    "Фикс на яйца...", "Качаю логи админа-яойщицы",
    "Генерирую рекламу XOUL...", "Ищу бесплатные прокси...",
    "Мут минута", "Елена банит ваш аккаунт...",
    "Ваши логи залиты в тгк",
    "Сканирую папку D:/Users/porn",
    "Ах, А-Яо...", "Ах, Цзюнь У...", "Что такое character.ai...",
    "Баню двачеров в чате...",
    "Ах, Джину...", "You know I'm the only one who'll love your sins...",
    "I'll be уour idol...", "feel the way my voice gets underneath your skin...",
    "Облизываю яблоко🍎...",
    "Рисую в тгк...", "Ах, вайбкодинг..."
];

function addLogEntry(text) {
    if(!logContainer) return;
    const div = document.createElement('div');
    const time = new Date().toLocaleTimeString('en-GB', {hour12: false});
    div.innerText = `[${time}] ${text || logMessages[Math.floor(Math.random() * logMessages.length)]}`;
    div.style.borderLeft = "2px solid #333";
    div.style.paddingLeft = "5px";
    div.style.marginBottom = "2px";
    logContainer.prepend(div);
    if(logContainer.children.length > 12) {
        logContainer.lastChild.remove();
    }
}
setInterval(() => addLogEntry(), 1200);

/* =========================================
   3. КОПИРОВАНИЕ
   ========================================= */
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "toast show";
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 300);
        addLogEntry("БУФЕР ОБМЕНА: ДАННЫЕ ВНЕСЕНЫ");
    });
}

/* =========================================
   4. ФОН (CANVAS)
   ========================================= */
const canvas = document.getElementById('cyber-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;
const connectDistance = 120;
const mouseDistance = 150;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouse = { x: null, y: null, radius: (canvas.height/80) * (canvas.width/80) }

window.addEventListener('mousemove', function(event) { mouse.x = event.x; mouse.y = event.y; });

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
    }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouseDistance) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
        }
        this.x += this.directionX; this.y += this.directionY; this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    const colors = ['#ff0055', '#00f3ff', '#ffffff'];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5; let directionY = (Math.random() * 1) - 0.5;
        let color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}
function animate() {
    requestAnimationFrame(animate); ctx.clearRect(0,0,innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
    connect();
}
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (connectDistance * connectDistance)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(255, 0, 85,' + opacityValue + ')';
                ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
            }
        }
    }
}
window.addEventListener('resize', function(){ canvas.width = innerWidth; canvas.height = innerHeight; mouse.radius = ((canvas.height/80) * (canvas.height/80)); init(); });
init(); animate();

/* =========================================
   5. МАТРИЧНЫЙ ВЗРЫВ
   ========================================= */
document.addEventListener('click', function(e) {
    createBinaryExplosion(e.clientX, e.clientY);
});

function createBinaryExplosion(x, y) {
    const particleCount = 15; 
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.innerText = Math.random() > 0.5 ? '1' : '0';
        particle.classList.add('binary-particle');
        if (Math.random() > 0.5) particle.classList.add('pink');
        document.body.appendChild(particle);
        particle.style.left = x + 'px'; particle.style.top = y + 'px';
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150; 
        const tx = Math.cos(angle) * velocity + 'px';
        const ty = Math.sin(angle) * velocity + 'px';
        particle.style.setProperty('--tx', tx); particle.style.setProperty('--ty', ty);
        particle.style.animation = `particleFly 1.5s ease-out forwards`;
        setTimeout(() => { particle.remove(); }, 1500);
    }
}

/* =========================================
   6. ПРИНУДИТЕЛЬНОЕ СКАЧИВАНИЕ
   ========================================= */

function forceDownload(url, fileName) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            console.log(`DOWNLOAD: ${fileName} success`);
        })
        .catch(err => {
            console.error('Ошибка:', err);
            alert("Ошибка загрузки. Проверьте папку file/");
        });
}

/* =========================================
   7. АУДИО ПЛЕЕР
   ========================================= */
const audio = document.getElementById('audio-track');
const playBtn = document.getElementById('play-btn');
const playerUI = document.getElementById('player-ui');
const progressBar = document.getElementById('music-progress');
const currTime = document.getElementById('curr-time');
const totalTime = document.getElementById('total-time');
const statusText = document.getElementById('player-status');

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        playerUI.classList.add('playing');
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        if(statusText) {
            statusText.innerText = "ВОСПРОИЗВЕДЕНИЕ...";
            statusText.style.color = "var(--neon-green)";
        }
        addLogEntry("АУДИО: НАЧАЛО ВОСПРОИЗВЕДЕНИЯ");
    } else {
        audio.pause();
        playerUI.classList.remove('playing');
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if(statusText) {
            statusText.innerText = "ПАУЗА";
            statusText.style.color = "orange";
        }
        addLogEntry("АУДИО: Приостановлено");
    }
}

if(audio) {
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
        currTime.innerText = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        totalTime.innerText = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        playerUI.classList.remove('playing');
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        progressBar.style.width = '0%';
        if(statusText) statusText.innerText = "ЗАВЕРШЕНО";
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/* =========================================
   8. ЛОГИКА ГАЙДА (СКРОЛЛ И ПОДСВЕТКА)
   ========================================= */

// Открытие изображения в полноэкранном режиме
function openFullscreen(img) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        cursor: pointer;
    `;
    
    const fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        box-shadow: 0 0 50px rgba(0, 243, 255, 0.5);
        border: 1px solid var(--neon-blue);
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 40px;
        font-size: 50px;
        color: var(--neon-pink);
        cursor: pointer;
        transition: 0.3s;
    `;
    
    closeBtn.onmouseover = () => { closeBtn.style.transform = 'scale(1.2)'; };
    closeBtn.onmouseout = () => { closeBtn.style.transform = 'scale(1)'; };
    
    overlay.appendChild(fullImg);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    
    overlay.onclick = () => {
        overlay.remove();
        addLogEntry("ПРОСМОТР: ИЗОБРАЖЕНИЕ ЗАКРЫТО");
    };
    
    addLogEntry("ПРОСМОТР: ПОЛНОЭКРАННЫЙ РЕЖИМ");
}

// Плавная прокрутка к началу страницы (железобетонный метод)
function scrollToTop() {
    const screenBody = document.querySelector('.screen-body');
    if (screenBody) {
        // Устанавливаем прокрутку в 0. CSS свойство scroll-behavior: smooth сделает это плавно
        screenBody.scrollTop = 0;
    }
    addLogEntry("НАВИГАЦИЯ: ВОЗВРАТ К НАЧАЛУ");
}

// Плавная прокрутка к якорям и подсветка
document.addEventListener('DOMContentLoaded', () => {
    const tocItems = document.querySelectorAll('.toc-item');
    
    tocItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Скроллим так, чтобы элемент оказался посередине экрана
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center' 
                });

                // Перезапускаем анимацию подсветки
                targetElement.classList.remove('highlight-target');
                void targetElement.offsetWidth; // Магия для перезапуска CSS-анимации
                targetElement.classList.add('highlight-target');
                
                addLogEntry(`НАВИГАЦИЯ: ПЕРЕХОД К ${targetId.toUpperCase()}`);
            }
        });
    });
});

/* =========================================
   9. УБЕГАЮЩАЯ ССЫЛКА С КРЫЛЬЯМИ И НОГАМИ
   ========================================= */
(function() {
    const runawayEl = document.getElementById('runaway-link');
    const runawayBox = document.getElementById('runaway-box');
    if (!runawayEl || !runawayBox) return;

    let activated = false;
    let posX = 0, posY = 10;
    let velX = 0, velY = 0;
    let animFrame = null;
    let sweatInterval = null;
    let wanderInterval = null;
    let mouseX = -9999, mouseY = -9999;
    let lastJumpTime = 0;
    let panicTimeout = null;

    const clones = [];

    // ======== АКТИВАЦИЯ ========
    runawayBox.addEventListener('click', function(e) {
        if (!activated) {
            e.preventDefault();
            e.stopPropagation();
            activated = true;
            runawayEl.classList.add('activated');

            const alertEl = document.createElement('span');
            alertEl.className = 'runaway-alert';
            alertEl.innerText = '❗';
            runawayEl.appendChild(alertEl);
            setTimeout(() => alertEl.remove(), 800);

            addLogEntry("ССЫЛКА: КРЫЛЬЯ РАСПРАВЛЕНЫ, ПОБЕГ АКТИВИРОВАН!");

            setTimeout(() => {
                const rect = runawayEl.getBoundingClientRect();
                posX = rect.left;
                posY = rect.top;

                document.body.appendChild(runawayEl);
                runawayEl.style.position = 'fixed';
                runawayEl.style.left = posX + 'px';
                runawayEl.style.top = posY + 'px';
                runawayEl.style.zIndex = '99999';

                velX = (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 10);
                velY = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 8);
                runawayEl.classList.add('running');
                sweatInterval = setInterval(spawnSweat, 300);
                animFrame = requestAnimationFrame(animate);
                startWandering();
            }, 400);
            return;
        }

        // Попытка поимки — СПАВН КЛОНОВ
        e.preventDefault();
        e.stopPropagation();

        const cloneCount = 8 + Math.floor(Math.random() * 5); 
        addLogEntry(`ССЫЛКА: КРИТИЧЕСКИЙ СТРАХ! МИТОЗ × ${cloneCount} КОПИЙ!`);

        spawnClones(cloneCount);
        spawnFeathers();
        spawnFeathers(); 

        velX += (Math.random() - 0.5) * 40;
        velY += (Math.random() - 0.5) * 40;
        clampSpeed();
        triggerPanic();
        triggerJump();
    });

    // ======== СПАВН КЛОНОВ ========
    function spawnClones(count) {
        for (let i = 0; i < count; i++) {
            const clone = createCloneElement();
            document.body.appendChild(clone.el);

            clone.x = posX + (Math.random() - 0.5) * 30;
            clone.y = posY + (Math.random() - 0.5) * 30;

            const angle = Math.random() * Math.PI * 2;
            const speed = 20 + Math.random() * 24; 
            clone.vx = Math.cos(angle) * speed;
            clone.vy = Math.sin(angle) * speed;

            clone.el.style.left = clone.x + 'px';
            clone.el.style.top = clone.y + 'px';

            clones.push(clone);

            const lifespan = 5000 + Math.random() * 3000;
            setTimeout(() => {
                clone.el.classList.add('fading');
                setTimeout(() => {
                    clone.el.remove();
                    const idx = clones.indexOf(clone);
                    if (idx > -1) clones.splice(idx, 1);
                }, 1000);
            }, lifespan);
        }
    }

    function createCloneElement() {
        const el = document.createElement('div');
        el.className = 'runaway-clone';
        el.innerHTML = `
            <div class="runaway-eyes">😱</div>
            <div class="runaway-body">
                <div class="wing wing-left">
                    <div class="wing-shape">
                        <div class="wing-primary"></div>
                        <div class="wing-membrane"></div>
                        <div class="wing-veins"></div>
                    </div>
                </div>
                <div class="runaway-box">
                    <i class="fa-solid fa-skull-crossbones"></i>
                    <span>КУДА ТЫКАЕШЬ?!</span>
                </div>
                <div class="wing wing-right">
                    <div class="wing-shape">
                        <div class="wing-primary"></div>
                        <div class="wing-membrane"></div>
                        <div class="wing-veins"></div>
                    </div>
                </div>
            </div>
            <div class="legs-container" style="opacity:1;">
                <div class="leg left-leg">
                    <div class="thigh"></div>
                    <div class="shin"></div>
                    <div class="foot"></div>
                </div>
                <div class="leg right-leg">
                    <div class="thigh"></div>
                    <div class="shin"></div>
                    <div class="foot"></div>
                </div>
            </div>
        `;
        el.style.position = 'fixed';
        el.style.zIndex = '99990';
        return { el, x: 0, y: 0, vx: 0, vy: 0 };
    }

    // ======== ФИЗИКА КЛОНОВ ========
    function animateClones() {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        for (const c of clones) {
            const cx = c.x + 60, cy = c.y + 30;
            const dx = cx - mouseX, dy = cy - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 0) {
                c.vx += (dx / dist) * 5;
                c.vy += (dy / dist) * 5;
            }

            if (Math.random() < 0.03) {
                const a = Math.random() * Math.PI * 2;
                c.vx += Math.cos(a) * 8;
                c.vy += Math.sin(a) * 8;
            }

            c.x += c.vx;
            c.y += c.vy;
            c.vx *= 0.95;
            c.vy *= 0.95;

            const maxSpd = 40;
            const spd = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
            if (spd > maxSpd) { c.vx = (c.vx / spd) * maxSpd; c.vy = (c.vy / spd) * maxSpd; }

            const w = c.el.offsetWidth || 120, h = c.el.offsetHeight || 60;
            if (c.x < 5) { c.x = 5; c.vx = Math.abs(c.vx) * 0.8 + 3; }
            if (c.x > screenW - w - 5) { c.x = screenW - w - 5; c.vx = -Math.abs(c.vx) * 0.8 - 3; }
            if (c.y < 5) { c.y = 5; c.vy = Math.abs(c.vy) * 0.8 + 3; }
            if (c.y > screenH - h - 5) { c.y = screenH - h - 5; c.vy = -Math.abs(c.vy) * 0.8 - 3; }

            const tilt = Math.min(Math.max(c.vx * 3, -40), 40);
            c.el.style.left = c.x + 'px';
            c.el.style.top = c.y + 'px';
            c.el.style.transform = `rotate(${tilt}deg)`;
        }
    }

    // ======== РАНДОМНОЕ БЛУЖДАНИЕ ОРИГИНАЛА ========
    function startWandering() {
        function wander() {
            if (!activated) return;
            const angle = Math.random() * Math.PI * 2;
            const force = 4 + Math.random() * 8;
            velX += Math.cos(angle) * force;
            velY += Math.sin(angle) * force;
            clampSpeed();
            wanderInterval = setTimeout(wander, 800 + Math.random() * 1700);
        }
        wanderInterval = setTimeout(wander, 1000);
    }

    function clampSpeed() {
        const maxSpeed = 22;
        const spd = Math.sqrt(velX * velX + velY * velY);
        if (spd > maxSpeed) { velX = (velX / spd) * maxSpeed; velY = (velY / spd) * maxSpeed; }
    }

    function triggerPanic() {
        runawayEl.classList.add('panicking');
        clearTimeout(panicTimeout);
        panicTimeout = setTimeout(() => runawayEl.classList.remove('panicking'), 2500);
    }

    function triggerJump() {
        const now = Date.now();
        if (now - lastJumpTime < 400) return;
        lastJumpTime = now;
        runawayEl.classList.remove('jumping');
        void runawayEl.offsetWidth;
        runawayEl.classList.add('jumping');
        setTimeout(() => runawayEl.classList.remove('jumping'), 350);
    }

    function spawnFeathers() {
        const items = ['💷', '💶', '⚓️', '💴', '💴', '💵'];
        for (const txt of items) {
            const f = document.createElement('span');
            f.className = 'feather';
            f.innerText = txt;
            f.style.left = (posX + (Math.random() - 0.5) * 60) + 'px';
            f.style.top = (posY + (Math.random() - 0.5) * 30) + 'px';
            f.style.setProperty('--fx', (Math.random() - 0.5) * 120 + 'px');
            f.style.setProperty('--fr', Math.random() * 360 + 'deg');
            document.body.appendChild(f);
            setTimeout(() => f.remove(), 1500);
        }
    }

    function spawnSweat() {
        const drop = document.createElement('span');
        drop.className = 'sweat-drop';
        drop.style.position = 'fixed';
        drop.innerText = Math.random() > 0.5 ? '💧' : '💦';
        drop.style.left = (posX + runawayEl.offsetWidth / 2 + (Math.random() - 0.5) * 20) + 'px';
        drop.style.top = (posY + 5) + 'px';
        drop.style.zIndex = '99998';
        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), 700);
    }

    // ======== ОСНОВНОЙ ЦИКЛ АНИМАЦИИ ========
    function animate() {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const elW = runawayEl.offsetWidth || 200;
        const elH = runawayEl.offsetHeight || 80;

        const elCX = posX + elW / 2, elCY = posY + elH / 2;
        const dx = elCX - mouseX, dy = elCY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 220 && dist > 0) {
            triggerPanic();
            triggerJump();
            velX += (dx / dist) * 7 * 0.35;
            velY += (dy / dist) * 7 * 0.35;
            clampSpeed();
            if (dist < 120 && Math.random() > 0.85) spawnFeathers();
        }

        posX += velX;
        posY += velY;
        velX *= 0.96;
        velY *= 0.96;

        const m = 5;
        if (posX < m) { posX = m; velX = Math.abs(velX) * 0.8 + 2; }
        if (posX > screenW - elW - m) { posX = screenW - elW - m; velX = -Math.abs(velX) * 0.8 - 2; }
        if (posY < m) { posY = m; velY = Math.abs(velY) * 0.8 + 2; }
        if (posY > screenH - elH - m) { posY = screenH - elH - m; velY = -Math.abs(velY) * 0.8 - 2; }

        const tilt = Math.min(Math.max(velX * 2.5, -35), 35);
        runawayEl.style.left = posX + 'px';
        runawayEl.style.top = posY + 'px';
        runawayEl.style.transform = `rotate(${tilt}deg)`;

        animateClones();

        animFrame = requestAnimationFrame(animate);
    }

    // ======== МЫШЬ ========
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (t) { mouseX = t.clientX; mouseY = t.clientY; }
    }, { passive: true });
    document.addEventListener('touchend', () => { mouseX = -9999; mouseY = -9999; });

    window.addEventListener('resize', () => {
        if (!activated) return;
        if (posX > window.innerWidth - 200) posX = window.innerWidth - 200;
        if (posY > window.innerHeight - 80) posY = window.innerHeight - 80;
    });
})();