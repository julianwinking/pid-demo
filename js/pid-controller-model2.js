
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');

// PID parameters for Model 2
let kp2 = parseFloat(document.getElementById('kp2').value);
let ki2 = parseFloat(document.getElementById('ki2').value);
let kd2 = parseFloat(document.getElementById('kd2').value);
let mass2 = parseFloat(document.getElementById('mass2').value);
let beamInertia = parseFloat(document.getElementById('beamInertia').value);
let target2 = parseFloat(document.getElementById('target2').value);
let amplitude2 = parseFloat(document.getElementById('amplitude2').value);
let frequency2 = parseFloat(document.getElementById('frequency2').value);
let noise2 = parseFloat(document.getElementById('noise2').value);

// System state for Model 2 (Ball and Beam)
let ballPosition = 0; // 0 is center
let ballVelocity = 0;
let beamAngle = 0; // Radians
let desiredBeamAngle = 0; // Radians
let beamAngularVelocity = 0; // Radians per second
let integral2 = 0;
let previousError2 = 0;
let time2 = 0;
let currentTarget2 = target2;

// Constants
const dt2 = 0.02; // Time step
const gravity = 1000; // Scaled gravity (pixels/s^2)
const beamLength = 600;
const ballRadius = 10; // Radius of the ball
const maxPos = beamLength / 2 - ballRadius; // Boundary position

// Data structure to hold chart values
const chartData2 = {
  labels: Array.from({ length: 200 }, (_, i) => (i * dt2).toFixed(2)),
  pValues: Array(200).fill(0),
  iValues: Array(200).fill(0),
  dValues: Array(200).fill(0)
};

// Chart.js setup for Model 2
const pidChartCtx2 = document.getElementById('pid-chart2').getContext('2d');
const pidChart2 = new Chart(pidChartCtx2, {
  type: 'line',
  data: {
    labels: chartData2.labels,
    datasets: [
      { label: 'P', data: chartData2.pValues, borderColor: 'red', fill: false, tension: 0.4 },
      { label: 'I', data: chartData2.iValues, borderColor: 'green', fill: false, tension: 0.4 },
      { label: 'D', data: chartData2.dValues, borderColor: 'blue', fill: false, tension: 0.4 }
    ]
  },
  options: {
    animation: {
      duration: 0,
      easing: 'easeInOutQuad'
    },
    scales: {
      x: { title: { display: true, text: 'Time (s)' } },
      y: { title: { display: true, text: 'Value' }, beginAtZero: true }
    }
  }
});

// Update PID parameters on input change
document.getElementById('kp2').addEventListener('input', () => {
  kp2 = parseFloat(document.getElementById('kp2').value);
  document.getElementById('kp2-value').textContent = kp2;
});

document.getElementById('ki2').addEventListener('input', () => {
  ki2 = parseFloat(document.getElementById('ki2').value);
  document.getElementById('ki2-value').textContent = ki2;
});

document.getElementById('kd2').addEventListener('input', () => {
  kd2 = parseFloat(document.getElementById('kd2').value);
  document.getElementById('kd2-value').textContent = kd2;
});

document.getElementById('mass2').addEventListener('input', () => {
  mass2 = parseFloat(document.getElementById('mass2').value);
  document.getElementById('mass2-value').textContent = mass2;
});

document.getElementById('beamInertia').addEventListener('input', () => {
  beamInertia = parseFloat(document.getElementById('beamInertia').value);
  document.getElementById('beamInertia-value').textContent = beamInertia;
});

document.getElementById('target2').addEventListener('input', () => {
  target2 = parseFloat(document.getElementById('target2').value);
  document.getElementById('target2-value').textContent = target2;
});

document.getElementById('amplitude2').addEventListener('input', () => {
  amplitude2 = parseFloat(document.getElementById('amplitude2').value);
  document.getElementById('amplitude2-value').textContent = amplitude2;
});

document.getElementById('frequency2').addEventListener('input', () => {
  frequency2 = parseFloat(document.getElementById('frequency2').value);
  document.getElementById('frequency2-value').textContent = frequency2;
});

document.getElementById('noise2').addEventListener('input', () => {
  noise2 = parseFloat(document.getElementById('noise2').value);
  document.getElementById('noise2-value').textContent = noise2;
});

document.getElementById('reset-button2').addEventListener('click', () => {
    ballPosition = 0;
    ballVelocity = 0;
    beamAngle = 0;
    desiredBeamAngle = 0;
    beamAngularVelocity = 0;
    integral2 = 0;
    previousError2 = 0;
    time2 = 0;
    // Reset chart
    chartData2.pValues.fill(0);
    chartData2.iValues.fill(0);
    chartData2.dValues.fill(0);
    pidChart2.update();
});

function pidController2() {
  // Calculate dynamic target
  currentTarget2 = target2;
  if (amplitude2 > 0 && frequency2 > 0) {
      currentTarget2 += amplitude2 * Math.sin(2 * Math.PI * frequency2 * time2);
  }

  const error = currentTarget2 - ballPosition;
  integral2 += error * dt2;
  const derivative = (error - previousError2) / dt2;
  
  // PID output controls the beam angle
  // Scale the gains because the output is an angle (small value)
  // while the error is in pixels (large value).
  const scale = 0.0005; 
  
  const p = kp2 * error * scale;
  const i = ki2 * integral2 * scale;
  const d = kd2 * derivative * scale;
  
  let output = p + i + d;

  // Limit the beam angle
  const maxAngle = Math.PI / 4; // 45 degrees
  if (output > maxAngle) output = maxAngle;
  if (output < -maxAngle) output = -maxAngle;

  previousError2 = error;

  chartData2.pValues.pop();
  chartData2.iValues.pop();
  chartData2.dValues.pop();

  chartData2.pValues.unshift(p);
  chartData2.iValues.unshift(i);
  chartData2.dValues.unshift(d);

  pidChart2.update();

  return output;
}

function updateSystem2() {
  desiredBeamAngle = pidController2();
  
  // Simulate Beam Dynamics (Inertia)
  // The PID output is the "desired" angle, but the beam has inertia.
  // We model this as a servo motor trying to reach the desired angle.
  // Torque = k * (desired - current) - damping * velocity
  const k_motor = 50; // Stiffness of the servo
  const damping_beam = 10; // Damping of the servo/beam system
  
  const torque = k_motor * (desiredBeamAngle - beamAngle) - damping_beam * beamAngularVelocity;
  const angularAcceleration = torque / beamInertia;
  
  beamAngularVelocity += angularAcceleration * dt2;
  beamAngle += beamAngularVelocity * dt2;

  // Physics: a = g * sin(theta)
  // Positive angle (CW) -> Positive acceleration (Right)
  // We scale acceleration by (5 / mass2) to simulate inertia effects
  // Default mass is 5, so at mass=5, behavior is standard gravity.
  const acceleration = gravity * Math.sin(beamAngle) * (5 / mass2);
  
  ballVelocity += acceleration * dt2;
  ballPosition += ballVelocity * dt2;

  // Add noise to the position
  if (noise2 > 0) {
    ballPosition += (Math.random() * 2 - 1) * noise2;
  }

  // Boundaries (Bounce off walls)
  if (ballPosition > maxPos) {
      ballPosition = maxPos;
      ballVelocity *= -0.6; // Bounce with energy loss
  } else if (ballPosition < -maxPos) {
      ballPosition = -maxPos;
      ballVelocity *= -0.6; // Bounce with energy loss
  }

  // Simple damping
  ballVelocity *= 0.99;

  // Update time
  time2 += dt2;
}

function draw2() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  
  const cx = canvas2.width / 2;
  const cy = canvas2.height / 2;

  ctx2.save();
  ctx2.translate(cx, cy);
  ctx2.rotate(beamAngle);

  // Draw Beam
  ctx2.beginPath();
  ctx2.rect(-beamLength / 2, -5, beamLength, 10);
  ctx2.fillStyle = '#333';
  ctx2.fill();

  // Draw Walls at ends of beam
  ctx2.fillStyle = '#555';
  ctx2.fillRect(-beamLength / 2 - 5, -25, 5, 30); // Left wall
  ctx2.fillRect(beamLength / 2, -25, 5, 30);      // Right wall

  // Draw Target Marker on Beam
  ctx2.beginPath();
  ctx2.moveTo(currentTarget2, -15);
  ctx2.lineTo(currentTarget2, 5);
  ctx2.strokeStyle = 'red';
  ctx2.lineWidth = 2;
  ctx2.stroke();

  // Draw Ball
  ctx2.beginPath();
  ctx2.arc(ballPosition, -15, ballRadius, 0, Math.PI * 2);
  ctx2.fillStyle = 'orange';
  ctx2.fill();

  ctx2.restore();

  // Draw Fulcrum (Triangle)
  ctx2.beginPath();
  ctx2.moveTo(cx, cy + 10);
  ctx2.lineTo(cx - 20, cy + 50);
  ctx2.lineTo(cx + 20, cy + 50);
  ctx2.closePath();
  ctx2.fillStyle = '#666';
  ctx2.fill();

  // Display Angle Information
  ctx2.font = '14px monospace';
  ctx2.fillStyle = '#333';
  ctx2.textAlign = 'center';
  const desiredDeg = (desiredBeamAngle * 180 / Math.PI).toFixed(1);
  const actualDeg = (beamAngle * 180 / Math.PI).toFixed(1);
  ctx2.fillText(`Desired Angle (Soll): ${desiredDeg}°`, cx, cy + 80);
  ctx2.fillText(`Actual Angle (Ist):   ${actualDeg}°`, cx, cy + 100);
}

let model2AnimationId;

window.startModel2Logic = function() {
    if (!model2AnimationId) {
        loop2();
    }
};

window.stopModel2Logic = function() {
    if (model2AnimationId) {
        cancelAnimationFrame(model2AnimationId);
        model2AnimationId = null;
    }
};

function loop2() {
  updateSystem2();
  draw2();
  model2AnimationId = requestAnimationFrame(loop2);
}
