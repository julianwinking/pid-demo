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

// Frequenzbereich definieren
const frequencies = Array.from({ length: 500 }, (_, i) => Math.pow(10, i / 100));

// Debugging: Frequenzen überprüfen
console.log("Frequencies:", frequencies);

// PID-Parameter
const Kp = 1.0;
const Ki = 0.5;
const Kd = 0.1;

// Debugging: PID-Parameter überprüfen
console.log("PID Parameters: Kp =", Kp, ", Ki =", Ki, ", Kd =", Kd);

// Bode-Daten berechnen
const bodeData = calculateBodeData(Kp, Ki, Kd, frequencies);

// Debugging: Bode-Daten überprüfen
console.log("Bode Data:", bodeData);

// Nyquist-Daten berechnen
const nyquistData = calculateNyquistData(Kp, Ki, Kd, frequencies);

// Debugging: Nyquist-Daten überprüfen
console.log("Nyquist Data:", nyquistData);

// Plotly-Daten vorbereiten
const magnitudeTrace = {
    x: frequencies,
    y: bodeData.magnitude,
    type: "scatter",
    mode: "lines",
    name: "Magnitude (dB)",
    line: { color: "blue" },
};

const phaseTrace = {
    x: frequencies,
    y: bodeData.phase,
    type: "scatter",
    mode: "lines",
    name: "Phase (°)",
    line: { color: "red" },
    yaxis: "y2",
};

// Plotly-Daten für die Ortskurve vorbereiten
const nyquistTrace = {
    x: nyquistData.real,
    y: nyquistData.imag,
    type: "scatter",
    mode: "lines",
    name: "Nyquist Curve",
    line: { color: "green" },
};

// Layout für das Diagramm
const layout = {
    title: "Bode Plot",
    xaxis: {
        title: "Frequency (rad/s)",
        type: "log",
    },
    yaxis: {
        title: "Magnitude (dB)",
    },
    yaxis2: {
        title: "Phase (°)",
        overlaying: "y",
        side: "right",
    },
    legend: { x: 0.5, y: -0.3, orientation: "h" }, // Move legend below the chart
    plot_bgcolor: "#f3f3f3", // Match simulation container background
    paper_bgcolor: "#f3f3f3", // Match simulation container background
    margin: { l: 50, r: 50, t: 50, b: 50 }, // Adjust margins to prevent overlap
};

// Layout für die Ortskurve
const nyquistLayout = {
    title: "Nyquist Plot",
    xaxis: {
        title: "Real Part",
    },
    yaxis: {
        title: "Imaginary Part",
    },
    legend: { x: 0.5, y: -0.3, orientation: "h" }, // Move legend below the chart
    plot_bgcolor: "#f3f3f3", // Match simulation container background
    paper_bgcolor: "#f3f3f3", // Match simulation container background
    margin: { l: 50, r: 50, t: 50, b: 50 }, // Adjust margins to prevent overlap
};

// Diagramm rendern
Plotly.newPlot("bode-plot", [magnitudeTrace, phaseTrace], layout);

// Ortskurve rendern
Plotly.newPlot("nyquist-plot", [nyquistTrace], nyquistLayout);

// Funktion zum Aktualisieren der Plots
function updatePlots(Kp, Ki, Kd, currentFrequency) {
    const bodeData = calculateBodeData(Kp, Ki, Kd, frequencies);

    // Update Bode plot
    const magnitudeTrace = {
        x: frequencies,
        y: bodeData.magnitude,
        type: "scatter",
        mode: "lines",
        name: "Magnitude (dB)",
        line: { color: "blue" },
    };

    const phaseTrace = {
        x: frequencies,
        y: bodeData.phase,
        type: "scatter",
        mode: "lines",
        name: "Phase (°)",
        line: { color: "red" },
        yaxis: "y2",
    };

    const currentFrequencyLine = {
        x: [currentFrequency, currentFrequency],
        y: [Math.min(...bodeData.magnitude), Math.max(...bodeData.magnitude)],
        type: "scatter",
        mode: "lines",
        name: "Current Frequency",
        line: { color: "orange", dash: "dot" },
    };

    const bodeLayout = {
        title: "Bode Plot",
        xaxis: { 
            title: "Frequency (rad/s)", 
            type: "log",
            range: [Math.log10(currentFrequency / 10), Math.log10(currentFrequency * 10)] // Adjust range dynamically
        },
        yaxis: { title: "Magnitude (dB)" },
        yaxis2: { title: "Phase (°)", overlaying: "y", side: "right" },
        plot_bgcolor: "#f3f3f3",
        paper_bgcolor: "#f3f3f3",
    };

    Plotly.newPlot("bode-plot", [magnitudeTrace, phaseTrace, currentFrequencyLine], bodeLayout);

    // Update Nyquist plot
    updateNyquistPlot(Kp, Ki, Kd, currentFrequency);
}

// Update Nyquist plot
function updateNyquistPlot(Kp, Ki, Kd, currentFrequency) {
    const nyquistData = calculateNyquistData(Kp, Ki, Kd, frequencies);

    // Calculate current frequency point
    const jw = math.complex(0, currentFrequency);
    const pidAtCurrentFreq = math.add(Kp, math.divide(Ki, jw), math.multiply(Kd, jw));

    const nyquistTrace = {
        x: nyquistData.real,
        y: nyquistData.imag,
        type: "scatter",
        mode: "lines",
        name: "Nyquist Curve",
        line: { color: "green" },
    };

    const currentNyquistPoint = {
        x: [math.re(pidAtCurrentFreq)],
        y: [math.im(pidAtCurrentFreq)],
        type: "scatter",
        mode: "markers",
        name: "Current Frequency",
        marker: { color: "orange", size: 10 },
    };

    const nyquistLayout = {
        title: "Nyquist Plot",
        xaxis: { title: "Real Part" },
        yaxis: { title: "Imaginary Part" },
        plot_bgcolor: "#f3f3f3",
        paper_bgcolor: "#f3f3f3",
    };

    Plotly.newPlot("nyquist-plot", [nyquistTrace, currentNyquistPoint], nyquistLayout);
}

// Event-Listener für Slider
document.querySelectorAll("input[type='range']").forEach((slider) => {
    slider.addEventListener("input", () => {
        const Kp = parseFloat(document.getElementById("kp").value);
        const Ki = parseFloat(document.getElementById("ki").value);
        const Kd = parseFloat(document.getElementById("kd").value);
        const currentFrequency = parseFloat(document.getElementById("frequency").value);

        updatePlots(Kp, Ki, Kd, currentFrequency);
    });
});

// Initiale Plots rendern
const initialKp = parseFloat(document.getElementById("kp").value);
const initialKi = parseFloat(document.getElementById("ki").value);
const initialKd = parseFloat(document.getElementById("kd").value);
const initialFrequency = parseFloat(document.getElementById("frequency").value);

updatePlots(initialKp, initialKi, initialKd, initialFrequency);
