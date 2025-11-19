// Function to calculate Open Loop Transfer Function L(s) = C(s) * P(s)
function calculateOpenLoopData(Kp, Ki, Kd, frequencies, modelType, params) {
    const magnitude = [];
    const phase = [];
    const real = [];
    const imag = [];

    frequencies.forEach((omega) => {
        const jw = math.complex(0, omega); // jω
        const s = jw;
        
        // Controller C(s)
        const pid = math.add(Kp, math.divide(Ki, jw), math.multiply(Kd, jw)); 

        // Plant P(s)
        let plant;
        if (modelType === 'model1') {
            // Model 1: Mass-Spring-Damper (approx)
            // P(s) = 1 / (m*s^2 + d*s)
            // d/m = 0.5 based on code (v *= 0.95 per 0.1s)
            const m = params.mass || 5;
            const d = 0.5 * m; 
            const denom = math.add(math.multiply(m, math.pow(s, 2)), math.multiply(d, s));
            plant = math.divide(1, denom);
        } else {
            // Model 2: Ball and Beam
            // P(s) = P_beam(s) * P_ball(s)
            // P_beam(s) = 50 / (J*s^2 + 10*s + 50)  (Servo dynamics)
            // P_ball(s) = K_ball / s^2
            // K_ball = g * 5 / m. With g=1000, K_ball = 5000/m.
            
            const J = params.beamInertia || 10;
            const m = params.mass || 5;
            const K_ball = 5000 / m;
            
            // Beam Transfer Function
            const beamDenom = math.add(math.multiply(J, math.pow(s, 2)), math.multiply(10, s), 50);
            const P_beam = math.divide(50, beamDenom);
            
            // Ball Transfer Function
            const P_ball = math.divide(K_ball, math.pow(s, 2));
            
            plant = math.multiply(P_beam, P_ball);
        }

        // Open Loop L(s) = C(s) * P(s)
        const openLoop = math.multiply(pid, plant);

        magnitude.push(20 * Math.log10(math.abs(openLoop))); // Magnitude in dB
        phase.push((math.arg(openLoop) * 180) / Math.PI); // Phase in degrees
        real.push(math.re(openLoop));
        imag.push(math.im(openLoop));
    });

    return { magnitude, phase, real, imag };
}

// Ensure the math.js library is loaded
if (typeof math === 'undefined') {
    console.error('Math.js library is not loaded. Please include the Math.js script in your HTML.');
}

// Frequenzbereich definieren
const frequencies = Array.from({ length: 500 }, (_, i) => Math.pow(10, (i / 100) - 2)); // Range from 0.01 to 1000 rad/s

// Debugging
console.log("Frequencies range:", frequencies[0], "to", frequencies[frequencies.length-1]);

// Start plotting functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - starting plotting functions");
    
    // Simple function to render both plots
    function renderPlots(Kp, Ki, Kd, modelType, bodeId, nyquistId) {
        // Get model parameters
        const params = {};
        if (modelType === 'model1') {
            params.mass = parseFloat(document.getElementById('mass')?.value) || 5;
        } else {
            params.mass = parseFloat(document.getElementById('mass2')?.value) || 5;
            params.beamInertia = parseFloat(document.getElementById('beamInertia')?.value) || 10;
        }

        console.log(`Rendering plots for ${modelType} with Kp=${Kp}, Ki=${Ki}, Kd=${Kd}, Params:`, params);
        
        // Check if elements exist
        if (!document.getElementById(bodeId) || !document.getElementById(nyquistId)) {
            console.warn(`Plot containers ${bodeId} or ${nyquistId} not found.`);
            return;
        }

        try {
            // Calculate Open Loop Data
            const data = calculateOpenLoopData(Kp, Ki, Kd, frequencies, modelType, params);
            
            // Bode Plot
            // Calculate proper axis ranges
            // Filter out -Infinity for log scale
            const validMags = data.magnitude.filter(m => isFinite(m));
            const magMin = Math.max(-100, Math.min(...validMags) - 10); // Clamp min to -100dB
            const magMax = Math.min(100, Math.max(...validMags) + 10);  // Clamp max to 100dB
            
            // Unwrap phase to avoid jumps from 180 to -180
            // Simple unwrap logic could be added here if needed, but for now raw phase is okay
            // Usually phase is between -270 and 90 for these systems
            
            const magnitudeTrace = {
                x: frequencies,
                y: data.magnitude,
                type: "scatter",
                mode: "lines",
                name: "Magnitude (dB)",
                line: { color: "blue" }
            };

            const phaseTrace = {
                x: frequencies,
                y: data.phase,
                type: "scatter",
                mode: "lines",
                name: "Phase (°)",
                line: { color: "red" },
                yaxis: "y2"
            };

            const bodeLayout = {
                title: "Bode Plot (Open Loop)",
                xaxis: { 
                    title: "Frequency (rad/s)", 
                    type: "log",
                    range: [-2, 3] 
                },
                yaxis: { 
                    title: "Magnitude (dB)",
                    range: [magMin, magMax]
                },
                yaxis2: { 
                    title: "Phase (°)", 
                    overlaying: "y", 
                    side: "right",
                    range: [-270, 90] // range for stability analysis
                },
                legend: { 
                    orientation: "h", 
                    y: -0.4, 
                    x: 0.5, 
                    xanchor: 'center'
                },
                plot_bgcolor: "#f3f3f3",
                paper_bgcolor: "#f3f3f3",
                margin: { l: 60, r: 60, t: 50, b: 100 }
            };

            const config = { responsive: true };

            Plotly.newPlot(bodeId, [magnitudeTrace, phaseTrace], bodeLayout, config);
            
            // Nyquist plot
            const nyquistTrace = {
                x: data.real,
                y: data.imag,
                type: "scatter",
                mode: "lines",
                name: "Open Loop L(s)",
                line: { color: "green" }
            };

            // Critical Point (-1, 0)
            const criticalPoint = {
                x: [-1],
                y: [0],
                mode: 'markers',
                type: 'scatter',
                name: 'Critical Point (-1, 0)',
                marker: { color: 'red', size: 10, symbol: 'x' }
            };

            const nyquistLayout = {
                title: "Nyquist Plot (Open Loop)",
                xaxis: { title: "Real Part", range: [-15, 15] },
                yaxis: { 
                    title: "Imaginary Part",
                    scaleanchor: "x",
                    scaleratio: 1,
                    range: [-15, 15]
                },
                plot_bgcolor: "#f3f3f3",
                paper_bgcolor: "#f3f3f3"
            };

            Plotly.newPlot(nyquistId, [nyquistTrace, criticalPoint], nyquistLayout, config);
            
        } catch (e) {
            console.error("Error rendering plots:", e);
        }
    }

    // Setup listeners for Model 1
    const sliders1 = ['kp', 'ki', 'kd', 'mass'];
    sliders1.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", function() {
                const Kp = parseFloat(document.getElementById("kp").value) || 0;
                const Ki = parseFloat(document.getElementById("ki").value) || 0;
                const Kd = parseFloat(document.getElementById("kd").value) || 0;
                renderPlots(Kp, Ki, Kd, "model1", "bode-plot", "nyquist-plot");
            });
        }
    });

    // Setup listeners for Model 2
    const sliders2 = ['kp2', 'ki2', 'kd2', 'mass2', 'beamInertia'];
    sliders2.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", function() {
                const Kp = parseFloat(document.getElementById("kp2").value) || 0;
                const Ki = parseFloat(document.getElementById("ki2").value) || 0;
                const Kd = parseFloat(document.getElementById("kd2").value) || 0;
                renderPlots(Kp, Ki, Kd, "model2", "bode-plot2", "nyquist-plot2");
            });
        }
    });

    // Initial plot rendering for Model 1
    let Kp1 = 1.0, Ki1 = 0.1, Kd1 = 0.01;
    if (document.getElementById("kp")) Kp1 = parseFloat(document.getElementById("kp").value);
    if (document.getElementById("ki")) Ki1 = parseFloat(document.getElementById("ki").value);
    if (document.getElementById("kd")) Kd1 = parseFloat(document.getElementById("kd").value);
    renderPlots(Kp1, Ki1, Kd1, "model1", "bode-plot", "nyquist-plot");
    
    // Initial plot rendering for Model 2
    let Kp2 = 1.0, Ki2 = 0.1, Kd2 = 0.01;
    if (document.getElementById("kp2")) Kp2 = parseFloat(document.getElementById("kp2").value);
    if (document.getElementById("ki2")) Ki2 = parseFloat(document.getElementById("ki2").value);
    if (document.getElementById("kd2")) Kd2 = parseFloat(document.getElementById("kd2").value);
    
    renderPlots(Kp2, Ki2, Kd2, "model2", "bode-plot2", "nyquist-plot2");
});
