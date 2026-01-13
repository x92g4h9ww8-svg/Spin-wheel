
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const result = document.getElementById('result');
const winSound = document.getElementById('win-sound');

const prizes = ['10% Off', 'Free Shipping', '$5 Gift Card', 'Try Again', '20% Off'];
const colors = ['#f44336', '#4CAF50', '#2196F3', '#FFEB3B', '#9C27B0'];

let angle = 0;
let spinning = false;

function drawWheel() {
  const arcSize = (2 * Math.PI) / prizes.length;
  for (let i = 0; i < prizes.length; i++) {
    const startAngle = angle + i * arcSize;
    const endAngle = startAngle + arcSize;
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, startAngle, endAngle);
    ctx.fill();
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(startAngle + arcSize / 2);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(prizes[i], 140, 10);
    ctx.restore();
  }
}

function spin() {
  if (spinning) return;
  spinning = true;
  const spins = Math.random() * 2000 + 3000;
  const duration = 3000;
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    if (elapsed < duration) {
      angle += spins * (1 - elapsed / duration) * 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWheel();
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      angle %= 2 * Math.PI;
      const index = Math.floor((prizes.length - (angle / (2 * Math.PI)) * prizes.length) % prizes.length);
      const prize = prizes[index];
      result.innerText = `🎉 You won: ${prize} 🎉`;
      winSound.play();
    }
  }

  requestAnimationFrame(animate);
}

drawWheel();
