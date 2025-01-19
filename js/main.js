const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// PID parameters
let kp = parseFloat(document.getElementById('kp').value);
let ki = parseFloat(document.getElementById('ki').value);
let kd = parseFloat(document.getElementById('kd').value);
let target = parseFloat(document.getElementById('target').value);

// System state
let position = 100;
let velocity = 0;
let integral = 0;
let previousError = 0;

// Constants
const dt = 0.1; // Time step

// Update PID parameters on input change
document.getElementById('kp').addEventListener('input', () => {
  kp = parseFloat(document.getElementById('kp').value);
});

document.getElementById('ki').addEventListener('input', () => {
  ki = parseFloat(document.getElementById('ki').value);
});

document.getElementById('kd').addEventListener('input', () => {
  kd = parseFloat(document.getElementById('kd').value);
});

document.getElementById('target').addEventListener('input', () => {
  target = parseFloat(document.getElementById('target').value);
});

function pidController() {
  const error = target - position;
  integral += error * dt;
  const derivative = (error - previousError) / dt;
  const output = kp * error + ki * integral + kd * derivative;

  previousError = error;
  return output;
}

function updateSystem() {
  const force = pidController();
  velocity += force * dt;
  position += velocity * dt;

  // Simple damping to simulate resistance
  velocity *= 0.95;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw target position
  ctx.beginPath();
  ctx.moveTo(target, 0);
  ctx.lineTo(target, canvas.height);
  ctx.strokeStyle = 'red';
  ctx.stroke();

  // Draw current position
  ctx.beginPath();
  ctx.arc(position, canvas.height / 2, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
}

function loop() {
  updateSystem();
  draw();
  requestAnimationFrame(loop);
}

loop();