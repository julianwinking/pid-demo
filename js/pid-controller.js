const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// PID parameters
let kp = parseFloat(document.getElementById('kp').value);
let ki = parseFloat(document.getElementById('ki').value);
let kd = parseFloat(document.getElementById('kd').value);
let target = parseFloat(document.getElementById('target').value);

// Additional parameters
let mass = parseFloat(document.getElementById('mass').value);
let amplitude = parseFloat(document.getElementById('amplitude').value);
let frequency = parseFloat(document.getElementById('frequency').value);
let noise = parseFloat(document.getElementById('noise').value); // New noise parameter

// System state
let position = 800;
let velocity = 20;
let integral = 0;
let previousError = 0;
let time = 0;

// Constants
const dt = 0.1; // Time step

// Data structure to hold chart values
const chartData = {
  labels: [],
  pValues: [],
  iValues: [],
  dValues: []
};

// Chart.js setup
const pidChartCtx = document.getElementById('pid-chart').getContext('2d');
const pidChart = new Chart(pidChartCtx, {
  type: 'line',
  data: {
    labels: chartData.labels,
    datasets: [
      { label: 'P', data: chartData.pValues, borderColor: 'red', fill: false },
      { label: 'I', data: chartData.iValues, borderColor: 'green', fill: false },
      { label: 'D', data: chartData.dValues, borderColor: 'blue', fill: false }
    ]
  },
  options: {
    scales: {
      x: { title: { display: true, text: 'Time (s)' } },
      y: { title: { display: true, text: 'Value' }, beginAtZero: true }
    }
  }
});

// Update PID parameters on input change
document.getElementById('kp').addEventListener('input', () => {
  kp = parseFloat(document.getElementById('kp').value);
  document.getElementById('kp-value').textContent = kp;
});

document.getElementById('ki').addEventListener('input', () => {
  ki = parseFloat(document.getElementById('ki').value);
  document.getElementById('ki-value').textContent = ki;
});

document.getElementById('kd').addEventListener('input', () => {
  kd = parseFloat(document.getElementById('kd').value);
  document.getElementById('kd-value').textContent = kd;
});

document.getElementById('target').addEventListener('input', () => {
  target = parseFloat(document.getElementById('target').value);
  document.getElementById('target-value').textContent = target;
});

// Update additional parameters on input change
document.getElementById('mass').addEventListener('input', () => {
  mass = parseFloat(document.getElementById('mass').value);
  document.getElementById('mass-value').textContent = mass;
});

document.getElementById('amplitude').addEventListener('input', () => {
  amplitude = parseFloat(document.getElementById('amplitude').value);
  document.getElementById('amplitude-value').textContent = amplitude;
});

document.getElementById('frequency').addEventListener('input', () => {
  frequency = parseFloat(document.getElementById('frequency').value);
  document.getElementById('frequency-value').textContent = frequency;
});

document.getElementById('noise').addEventListener('input', () => {
  noise = parseFloat(document.getElementById('noise').value);
  document.getElementById('noise-value').textContent = noise;
});

// Reset button event listener
document.getElementById('reset-button').addEventListener('click', () => {
  location.reload();
});

document.getElementById('toggle-chart-button').addEventListener('click', function() {
    const pidChart = document.getElementById('pid-chart');
    pidChart.style.display = pidChart.style.display === 'none' ? 'block' : 'none';
});

function pidController() {
  const error = target - position;
  integral += error * dt;
  const derivative = (error - previousError) / dt;
  const p = kp * error;
  const i = ki * integral;
  const d = kd * derivative;
  const output = p + i + d;

  previousError = error;

  if (chartData.labels.length > 200) {
    chartData.labels.pop();
    chartData.pValues.shift();
    chartData.iValues.shift();
    chartData.dValues.shift();
  }

  // Update chart data
  chartData.labels.push((-20 + chartData.labels.length * dt).toFixed(1));
  chartData.pValues.push(p);
  chartData.iValues.push(i);
  chartData.dValues.push(d);

  pidChart.update();

  return output;
}

function updateSystem() {
  const force = pidController();
  const acceleration = force / mass; // Calculate acceleration based on mass
  velocity += acceleration * dt;
  position += velocity * dt;

  // Simple damping to simulate resistance
  velocity *= 0.95;

  // Update time
  time += dt;

  // Update target with oscillation
  if (amplitude !== 0 && frequency !== 0) {
    target = parseFloat(document.getElementById('target').value) + amplitude * Math.sin(2 * Math.PI * frequency * time);
  }

  // Add noise to the position
  if (noise > 0) {
    position += (Math.random() * 2 - 1) * noise;
  }
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
