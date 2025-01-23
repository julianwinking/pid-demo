const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// PID parameters
let kp = parseFloat(document.getElementById('kp').value);
let ki = parseFloat(document.getElementById('ki').value);
let kd = parseFloat(document.getElementById('kd').value);
let target = parseFloat(document.getElementById('target').value);

// System state
let position = 200;
let velocity = 0;
let integral = 0;
let previousError = 0;

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
      y: { title: { display: true, text: 'Value' } }
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

// Reset button event listener
document.getElementById('reset-button').addEventListener('click', () => {
  location.reload();
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

  // Update chart data
  chartData.labels.push((chartData.labels.length * dt).toFixed(1));
  chartData.pValues.push(p);
  chartData.iValues.push(i);
  chartData.dValues.push(d);

  pidChart.update();

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