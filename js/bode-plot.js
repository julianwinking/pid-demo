// Funktion zur Berechnung des Frequenzgangs eines PID-Reglers
function calculateBodeData(Kp, Ki, Kd, frequencies) {
    const magnitude = [];
    const phase = [];

    frequencies.forEach((omega) => {
        const jw = math.complex(0, omega); // jω
        const pid = math.add(Kp, math.divide(Ki, jw), math.multiply(Kd, jw)); // PID transfer function

        magnitude.push(20 * Math.log10(math.abs(pid))); // Magnitude in dB
        phase.push((math.arg(pid) * 180) / Math.PI); // Phase in degrees
    });

    return { magnitude, phase };
}

// Corrected function to calculate Nyquist data
function calculateNyquistData(Kp, Ki, Kd, frequencies) {
    const real = [];
    const imag = [];

    frequencies.forEach((omega) => {
        const jw = math.complex(0, omega); // jω
        const pid = math.add(Kp, math.divide(Ki, jw), math.multiply(Kd, jw)); // PID transfer function

        real.push(math.re(pid)); // Real part
        imag.push(math.im(pid)); // Imaginary part
    });

    return { real, imag };
}

// Ensure the math.js library is loaded before using it
if (typeof math === 'undefined') {
    console.error('Math.js library is not loaded. Please include the Math.js script in your HTML.');
}

// Frequenzbereich definieren - using wider range and more points for better visualization
const frequencies = Array.from({ length: 300 }, (_, i) => Math.pow(10, (i / 50) - 3)); // Range from 0.001 to 1000 rad/s

// Debugging: Frequenzen überprüfen
console.log("Frequencies range:", frequencies[0], "to", frequencies[frequencies.length-1]);

// Ensure DOM elements exist before starting
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - starting plotting functions");
    
    // Check if plot containers exist
    if (!document.getElementById('bode-plot')) {
        console.error('Element with ID "bode-plot" not found in the document.');
        return;
    }
    
    if (!document.getElementById('nyquist-plot')) {
        console.error('Element with ID "nyquist-plot" not found in the document.');
        return;
    }
    
    // Default PID parameters if sliders aren't available
    let Kp = 1.0;
    let Ki = 0.5;
    let Kd = 0.1;
    
    // Try to get slider values if they exist
    try {
        if (document.getElementById("kp")) {
            Kp = parseFloat(document.getElementById("kp").value) || Kp;
        }
        if (document.getElementById("ki")) {
            Ki = parseFloat(document.getElementById("ki").value) || Ki;
        }
        if (document.getElementById("kd")) {
            Kd = parseFloat(document.getElementById("kd").value) || Kd;
        }
    } catch (e) {
        console.warn("Error reading slider values, using defaults:", e);
    }

    // Debugging: PID-Parameter überprüfen
    console.log("Using PID Parameters: Kp =", Kp, ", Ki =", Ki, ", Kd =", Kd);

    // Simple function to render both plots
    function renderPlots(Kp, Ki, Kd) {
        console.log("Rendering plots with Kp =", Kp, ", Ki =", Ki, ", Kd =", Kd);
        
        try {
            // Bode plot
            const bodeData = calculateBodeData(Kp, Ki, Kd, frequencies);
            
            // Calculate proper axis ranges
            const magMin = Math.min(...bodeData.magnitude) - 10;
            const magMax = Math.max(...bodeData.magnitude) + 10;
            const phaseMin = Math.min(...bodeData.phase) - 10;
            const phaseMax = Math.max(...bodeData.phase) + 10;
            
            console.log(`Magnitude range: ${magMin} to ${magMax}, Phase range: ${phaseMin} to ${phaseMax}`);
            
            const magnitudeTrace = {
                x: frequencies,
                y: bodeData.magnitude,
                type: "scatter",
                mode: "lines",
                name: "Magnitude (dB)",
                line: { color: "blue" }
            };

            const phaseTrace = {
                x: frequencies,
                y: bodeData.phase,
                type: "scatter",
                mode: "lines",
                name: "Phase (°)",
                line: { color: "red" },
                yaxis: "y2"
            };

            const bodeLayout = {
                title: "Bode Plot",
                xaxis: { 
                    title: "Frequency (rad/s)", 
                    type: "log",
                    range: [-3, 3]  // Explicit log range from 0.001 to 1000
                },
                yaxis: { 
                    title: "Magnitude (dB)",
                    range: [magMin, magMax]  // Dynamic range based on data
                },
                yaxis2: { 
                    title: "Phase (°)", 
                    overlaying: "y", 
                    side: "right",
                    range: [phaseMin, phaseMax]  // Dynamic range based on data
                },
                legend: { orientation: "h", y: -0.2 },  // Position legend below the plot
                plot_bgcolor: "#f3f3f3",
                paper_bgcolor: "#f3f3f3",
                margin: { l: 60, r: 60, t: 50, b: 60 }  // Add more margin for axis labels
            };

            console.log("Plotting Bode plot...");
            Plotly.newPlot("bode-plot", [magnitudeTrace, phaseTrace], bodeLayout);
            console.log("Bode plot rendered successfully");
            
            // Nyquist plot
            const nyquistData = calculateNyquistData(Kp, Ki, Kd, frequencies);
            
            const nyquistTrace = {
                x: nyquistData.real,
                y: nyquistData.imag,
                type: "scatter",
                mode: "lines",
                name: "PID Controller",
                line: { color: "green" }
            };

            const nyquistLayout = {
                title: "Nyquist Plot",
                xaxis: { title: "Real Part" },
                yaxis: { 
                    title: "Imaginary Part",
                    scaleanchor: "x",  // Make the axes equal scale
                    scaleratio: 1      // 1:1 ratio
                },
                plot_bgcolor: "#f3f3f3",
                paper_bgcolor: "#f3f3f3"
            };

            console.log("Plotting Nyquist plot...");
            Plotly.newPlot("nyquist-plot", [nyquistTrace], nyquistLayout);
            console.log("Nyquist plot rendered successfully");
            
        } catch (e) {
            console.error("Error rendering plots:", e);
        }
    }

    // Event-Listener for PID parameter sliders
    try {
        const sliders = ['kp', 'ki', 'kd'].map(id => document.getElementById(id)).filter(el => el !== null);
        
        if (sliders.length > 0) {
            sliders.forEach(slider => {
                slider.addEventListener("input", function() {
                    try {
                        const newKp = document.getElementById("kp") ? 
                            parseFloat(document.getElementById("kp").value) || Kp : Kp;
                        const newKi = document.getElementById("ki") ? 
                            parseFloat(document.getElementById("ki").value) || Ki : Ki;
                        const newKd = document.getElementById("kd") ? 
                            parseFloat(document.getElementById("kd").value) || Kd : Kd;
                        
                        renderPlots(newKp, newKi, newKd);
                    } catch (e) {
                        console.error("Error updating plots from sliders:", e);
                    }
                });
            });
            console.log("Slider event listeners attached");
        } else {
            console.warn("No PID parameter sliders found in document");
        }
    } catch (e) {
        console.error("Error setting up slider listeners:", e);
    }

    // Initial plot rendering
    renderPlots(Kp, Ki, Kd);
});
