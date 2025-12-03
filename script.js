/* =========================================
   1. ЛОГИКА ТЕРМИНАЛА
   ========================================= */
function runCommand(tabName) {
    // Обновляем путь в заголовке
    document.getElementById('current-path').innerText = `root/home/${tabName}`;

    // Переключаем контент
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.remove('active-tab'));

    // Переключаем активную команду в меню
    const cmds = document.querySelectorAll('.cmd-item');
    cmds.forEach(c => c.classList.remove('active'));

    // Показываем нужную вкладку
    const targetTab = document.getElementById(tabName);
    if(targetTab) targetTab.classList.add('active-tab');

    // Подсвечиваем кнопку меню
    const activeCmd = Array.from(cmds).find(c => c.getAttribute('onclick').includes(tabName));
    if(activeCmd) activeCmd.classList.add('active');

    addLogEntry(`ВЫПОЛНИТЬ: ./${tabName}.mod`);
}

/* =========================================
   2. ЛОГЕР ТРАФИКА
   ========================================= */
const logContainer = document.getElementById('traffic-log');
const logMessages = [
    "Вас взломали", "Хочу Дотторе", "Пинг: 696969 ms", 
    "Фикс на яйца...", "Качаю логи админа-яойщицы", "Взлом базы данных...",
    "Генерирую рекламу XOUL...", "Ищу бесплатные прокси...", "///СИСТЕМА ВЗЛОМАНА///",
    "Мут минута", "Елена банит ваш аккаунт...", "Дикий турист detected",
    "Диск С очищен", "Ваши логи залиты в тгк", "TGCF...",
    "Селия любит вас...", "Gooning_protocol_enabled", "Фармлю примогемы...",
    "Сканирую папку D:/Users/{{user}}/porn", "Устанавливаю SillyTavern...", "MDZS...",
    "Ах, А-Яо...", "Ваши логи залиты в тгк", "Что такое character.ai...",
    "Диск D отформатирован", "Баню двачеров в чате..."
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
    if(logContainer.children.length > 5) {
        logContainer.lastChild.remove();
    }
}
// Запускаем автоматический лог
setInterval(() => addLogEntry(), 2200);

/* =========================================
   3. КОПИРОВАНИЕ В БУФЕР
   ========================================= */
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "toast show";
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
        addLogEntry("БУФЕР ОБМЕНА: ДАННЫЕ ВНЕСЕНЫ");
    });
}

/* =========================================
   4. ФОНОВЫЕ СОЗВЕЗДИЯ (CANVAS)
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
   5. ИСПРАВЛЕННЫЙ МАТРИЧНЫЙ ВЗРЫВ
   ========================================= */
document.addEventListener('click', function(e) {
    // Передаем координаты клика (X и Y относительно окна браузера)
    createBinaryExplosion(e.clientX, e.clientY);
});

function createBinaryExplosion(x, y) {
    const particleCount = 15; // Количество частиц

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        
        // Случайная цифра 0 или 1
        particle.innerText = Math.random() > 0.5 ? '1' : '0';
        
        // Добавляем классы
        particle.classList.add('binary-particle');
        if (Math.random() > 0.5) particle.classList.add('pink');

        // ВАЖНО: Сразу ставим координаты появления (там, где была мышь)
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        // Добавляем в body
        document.body.appendChild(particle);

        // Математика разлета
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150; 

        // Вычисляем смещение по X и Y
        const tx = Math.cos(angle) * velocity + 'px';
        const ty = Math.sin(angle) * velocity + 'px';

        // Передаем эти значения в CSS переменные элемента
        particle.style.setProperty('--tx', tx);
        particle.style.setProperty('--ty', ty);

        // Запускаем анимацию (1.5 секунды)
        particle.style.animation = `particleFly 1.5s ease-out forwards`;

        // Удаляем элемент из памяти после завершения анимации
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }
}



/* =========================================
   6. ПРИНУДИТЕЛЬНОЕ СКАЧИВАНИЕ ФАЙЛА
   ========================================= */
function forceDownload(url, fileName) {
    // 1. Получаем файл
    fetch(url)
        .then(response => response.blob()) // Превращаем в объект данных (Blob)
        .then(blob => {
            // 2. Создаем временную ссылку в памяти браузера
            const blobUrl = window.URL.createObjectURL(blob);
            
            // 3. Создаем невидимый элемент ссылки
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName; // Имя, под которым сохранится файл
            
            // 4. Добавляем, кликаем и удаляем
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 5. Очищаем память
            window.URL.revokeObjectURL(blobUrl);
            
            // Лог в терминал (для красоты)
            addLogEntry(`DOWNLOAD: ${fileName} success`);
        })
        .catch(err => {
            console.error('Ошибка загрузки:', err);
            addLogEntry(`ERROR: Download failed`);
            alert("Ошибка: Не удалось загрузить файл. Проверьте, лежит ли он в папке file/");
        });
}


