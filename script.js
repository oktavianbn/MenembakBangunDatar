const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 1024;
canvas.height = 768;

const bullets = [];
const enemy = { x: 950, y: canvas.height / 2, size: 40 };
const player = { x: 50, y: canvas.height / 2, size: 30 };
let score1 = 0;
let score2 = 0;

function drawPlayerOne() {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(player.x, player.y - player.size);
  ctx.lineTo(player.x - player.size, player.y + player.size);
  ctx.lineTo(player.x + player.size, player.y + player.size);
  ctx.closePath();
  ctx.fill();
}

function drawPlayerTwo() {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.moveTo(enemy.x, enemy.y - enemy.size);
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5;
    const x = enemy.x + enemy.size * Math.cos(angle);
    const y = enemy.y + enemy.size * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets.forEach((bullet, index) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
    bullet.x += bullet.dx;
    if (bullet.x < 0 || bullet.x > canvas.width) {
      bullets.splice(index, 1);
    }
  });
}

function detectPlayerCollision() {
  bullets.forEach((bullet, bulletIndex) => {
    const dx = bullet.x - player.x;
    const dy = bullet.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player.size) {
      bullets.splice(bulletIndex, 1);
      score2++;
    }
  });
}

function detectEnemyCollision() {
  bullets.forEach((bullet, bulletIndex) => {
    const dx = bullet.x - enemy.x;
    const dy = bullet.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemy.size) {
      bullets.splice(bulletIndex, 1);
      score1++;
    }
  });
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score Player 1: " + score1, 20, 30);
  ctx.fillText("Score Player 2: " + score2, 20, 60);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayerOne();
  drawPlayerTwo();
  drawBullets();
  detectEnemyCollision();
  detectPlayerCollision();
  drawScore();
  requestAnimationFrame(update);
}

const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === "e") {
    bullets.push({
      x: player.x + player.size + 10,
      y: player.y,
      radius: 5,
      dx: 5,
    });
  }

  if (e.key === "l") {
    bullets.push({
      x: enemy.x - enemy.size - 10,
      y: enemy.y,
      radius: 5,
      dx: -5,
    });
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function movePlayerTwo() {
  if (keys["ArrowLeft"] && enemy.x > canvas.width / 2) enemy.x -= 5;
  if (keys["ArrowRight"] && enemy.x < canvas.width - 20) enemy.x += 5;
  if (keys["ArrowUp"] && enemy.y > 0) enemy.y -= 5;
  if (keys["ArrowDown"] && enemy.y < canvas.height - 20) enemy.y += 5;
  requestAnimationFrame(movePlayerTwo);
}

function movePlayerOne() {
  if (keys["a"] && player.x > 0) player.x -= 5;
  if (keys["d"] && player.x < canvas.width / 2 - 20) player.x += 5;
  if (keys["w"] && player.y > 0) player.y -= 5;
  if (keys["s"] && player.y < canvas.height - 20) player.y += 5;
  requestAnimationFrame(movePlayerOne);
}

update();
movePlayerOne();
movePlayerTwo();