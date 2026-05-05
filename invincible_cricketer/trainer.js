const canvas = document.getElementById('training-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const reactionDisp = document.getElementById('reaction-time');
const accuracyDisp = document.getElementById('accuracy');

let ball = { x: 0, y: 0, radius: 10, dx: 5, dy: 5, color: '#c5a059' };
let isActive = false;
let startTime;
let hits = 0;
let totalTaps = 0;

function resize() {
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight * 0.7;
}

window.addEventListener('resize', resize);
resize();

function spawnBall() {
    ball.x = Math.random() * (canvas.width - 40) + 20;
    ball.y = Math.random() * (canvas.height - 40) + 20;
    ball.dx = (Math.random() - 0.5) * 20;
    ball.dy = (Math.random() - 0.5) * 20;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function update() {
    if (!isActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw trail
    ctx.fillStyle = 'rgba(197, 160, 89, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) ball.dy = -ball.dy;

    drawBall();
    requestAnimationFrame(update);
}

canvas.addEventListener('mousedown', (e) => {
    if (!isActive) return;
    
    totalTaps++;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dist = Math.hypot(mouseX - ball.x, mouseY - ball.y);
    
    if (dist < ball.radius + 10) {
        hits++;
        const reaction = Date.now() - startTime;
        reactionDisp.innerText = reaction + 'ms';
        ball.dx *= 1.1; // Increase speed
        ball.dy *= 1.1;
        startTime = Date.now();
    }
    
    accuracyDisp.innerText = Math.round((hits / totalTaps) * 100) + '%';
});

startBtn.addEventListener('click', () => {
    isActive = true;
    hits = 0;
    totalTaps = 0;
    spawnBall();
    startTime = Date.now();
    startBtn.innerText = 'Reset Session';
    update();
});
