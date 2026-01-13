const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultText = document.getElementById('resultText');
const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');

const segments = [
  '5% OFF',
  '10% OFF',
  '15% OFF',
  '20% OFF',
  'No this time ☹️'
];

const colors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];
let startAngle = 0;

function drawWheel() {
  const arc = 2 * Math.PI / segments.length;
  for (let i = 0; i < segments.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, angle, angle + arc);
    ctx.fill();
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(angle + arc / 2);
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-serif';
    ctx.fillText(segments[i], 40, 0);
    ctx.restore();
  }
}

drawWheel();

function spinWheel() {
  const spinDegrees = Math.floor(3600 + Math.random() * 720);
  const spinDuration = 4000;
  const finalAngle = (spinDegrees % 360) * Math.PI / 180;
  const arc = 2 * Math.PI / segments.length;
  const winningIndex = segments.length - Math.floor((finalAngle % (2 * Math.PI)) / arc) - 1;
  spinSound.play();
  let start = null;
  function rotate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const angle = (spinDegrees * Math.PI / 180) * (progress / spinDuration);
    startAngle = angle % (2 * Math.PI);
    ctx.clearRect(0, 0, 300, 300);
    drawWheel();
    if (progress < spinDuration) {
      requestAnimationFrame(rotate);
    } else {
      winSound.play();
      const prize = segments[winningIndex];
      if (prize.includes('%')) {
        resultText.innerHTML = `🎉 Congratulations! You just won an extra ${prize} off your remodeling project!`;
      } else {
        resultText.innerHTML = `😞 ${prize}`;
      }
    }
  }
  requestAnimationFrame(rotate);
}

spinButton.addEventListener('click', spinWheel);