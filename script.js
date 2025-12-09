/* =========================================
   0. BOOT SEQUENCE
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const bootScreen = document.getElementById('boot-screen');
    const terminal = document.getElementById('boot-terminal');
    const progressBar = document.getElementById('boot-bar');
    const memCount = document.getElementById('mem-count');
    
    const bootLog = [
        "Инициализирую систему...",
        "Проверяю наличие подписки на канал... [1/1 OK]",
        "Отслеживаю возможную связь с двачом... [0/1 OK]",
        "Загружаю систему...",
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
    "Хочу Дотторе...", "Платная гемка...", 
    "Фикс на яйца...", "Качаю логи админа-яойщицы",
    "Генерирую рекламу XOUL...", "Ищу бесплатные прокси...",
    "Мут минута", "Елена банит ваш аккаунт...", "Дикий турист detected...",
    "Ваши логи залиты в тгк", "Gooning_protocol_enabled...", "Фармлю примогемы...",
    "Сканирую папку D:/Users/porn", "Устанавливаю SillyTavern...",
    "Ах, А-Яо...", "Ах, Цзюнь У...", "Что такое character.ai...",
    "Диск D отформатирован", "Баню двачеров в чате...",
    "Ах, Джину...", "You know I'm the only one who'll love your sins...",
    "I'll be уour idol...", "feel the way my voice gets underneath your skin...",
    "Покойся с миром, 2.5pro...", "Будем ролить в дипсике...", "Облизываю яблоко🍎...",
    "Опять новый фикс...", "Молюсь на Джи...", "Я знаю, что вы делали этой ночью..."
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
        statusText.innerText = "ВОСПРОИЗВЕДЕНИЕ...";
        statusText.style.color = "var(--neon-green)";
        addLogEntry("АУДИО: НАЧАЧЛО ВОСПРОИЗВЕДЕНИЯ");
    } else {
        audio.pause();
        playerUI.classList.remove('playing');
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        statusText.innerText = "ПАУЗА";
        statusText.style.color = "orange";
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
        statusText.innerText = "ЗАВЕРШЕНО";
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
