// Funktion zur Berechnung des Frequenzgangs eines PID-Reglers
function calculateBodeData(Kp, Ki, Kd, frequencies) {
    const magnitude = [];
    const phase = [];

    frequencies.forEach((omega) => {
        if (omega === 0) omega = 1e-10; // Schutz gegen Division durch Null
        if (omega > 1e6) omega = 1e6; // Begrenze omega, um ungültige Werte zu vermeiden

        const jw = math.complex(0, omega); // jω
        const pid = Kp + Ki / jw + Kd * jw; // PID-Übertragungsfunktion

        // Debugging: Überprüfe die Berechnung
        console.log(`omega: ${omega}, jw: ${jw}, pid: ${pid}`);

        if (!isNaN(math.abs(pid))) {
            magnitude.push(20 * Math.log10(math.abs(pid))); // Betrag in dB
            phase.push((math.arg(pid) * 180) / Math.PI); // Phase in Grad
        } else {
            magnitude.push(NaN);
            phase.push(NaN);
        }
    });

    return { magnitude, phase };
}

// Funktion zur Berechnung der Ortskurve (Nyquist-Diagramm)
function calculateNyquistData(Kp, Ki, Kd, frequencies) {
    const real = [];
    const imag = [];

    frequencies.forEach((omega) => {
        if (omega === 0) omega = 1e-10; // Schutz gegen Division durch Null
        if (omega > 1e6) omega = 1e6; // Begrenze omega, um ungültige Werte zu vermeiden

        const jw = math.complex(0, omega); // jω
        const pid = Kp + Ki / jw + Kd * jw; // PID-Übertragungsfunktion

        // Debugging: Überprüfe die Berechnung
        console.log(`omega: ${omega}, jw: ${jw}, pid: ${pid}`);

        if (!isNaN(math.abs(pid))) {
            real.push(math.re(pid)); // Realteil
            imag.push(math.im(pid)); // Imaginärteil
        } else {
            real.push(NaN);
            imag.push(NaN);
        }
    });

    return { real, imag };
}

// Frequenzbereich definieren
const frequencies = Array.from({ length: 500 }, (_, i) => 0.1 * Math.pow(10, i / 100));

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
    title: "Bode-Diagramm des PID-Reglers",
    xaxis: {
        title: "Frequenz (rad/s)",
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
    legend: { x: 0.1, y: 1.1 },
};

// Layout für die Ortskurve
const nyquistLayout = {
    title: "Ortskurve (Nyquist-Diagramm) des PID-Reglers",
    xaxis: {
        title: "Realteil",
    },
    yaxis: {
        title: "Imaginärteil",
    },
    legend: { x: 0.1, y: 1.1 },
};

// Diagramm rendern
Plotly.newPlot("bode-plot", [magnitudeTrace, phaseTrace], layout);

// Ortskurve rendern
Plotly.newPlot("nyquist-plot", [nyquistTrace], nyquistLayout);

// Funktion zum Aktualisieren der Plots
function updatePlots(Kp, Ki, Kd, currentFrequency) {
    // Bode-Daten berechnen
    const bodeData = calculateBodeData(Kp, Ki, Kd, frequencies);

    // Nyquist-Daten berechnen
    const nyquistData = calculateNyquistData(Kp, Ki, Kd, frequencies);

    // Markierung der aktuellen Frequenz
    const currentMagnitude = 20 * Math.log10(math.abs(Kp + Ki / math.complex(0, currentFrequency) + Kd * math.complex(0, currentFrequency)));
    const currentPhase = (math.arg(Kp + Ki / math.complex(0, currentFrequency) + Kd * math.complex(0, currentFrequency)) * 180) / Math.PI;

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

    const currentFrequencyTrace = {
        x: [currentFrequency],
        y: [currentMagnitude],
        type: "scatter",
        mode: "markers",
        name: "Current Frequency",
        marker: { color: "orange", size: 10 },
    };

    const nyquistTrace = {
        x: nyquistData.real,
        y: nyquistData.imag,
        type: "scatter",
        mode: "lines",
        name: "Nyquist Curve",
        line: { color: "green" },
    };

    const currentNyquistTrace = {
        x: [math.re(Kp + Ki / math.complex(0, currentFrequency) + Kd * math.complex(0, currentFrequency))],
        y: [math.im(Kp + Ki / math.complex(0, currentFrequency) + Kd * math.complex(0, currentFrequency))],
        type: "scatter",
        mode: "markers",
        name: "Current Frequency",
        marker: { color: "orange", size: 10 },
    };

    // Layouts
    const bodeLayout = {
        title: "Bode-Diagramm des PID-Reglers",
        xaxis: {
            title: "Frequenz (rad/s)",
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
        legend: { x: 0.1, y: 1.1 },
    };

    const nyquistLayout = {
        title: "Ortskurve (Nyquist-Diagramm) des PID-Reglers",
        xaxis: {
            title: "Realteil",
        },
        yaxis: {
            title: "Imaginärteil",
        },
        legend: { x: 0.1, y: 1.1 },
    };

    // Plots aktualisieren
    Plotly.newPlot("bode-plot", [magnitudeTrace, phaseTrace, currentFrequencyTrace], bodeLayout);
    Plotly.newPlot("nyquist-plot", [nyquistTrace, currentNyquistTrace], nyquistLayout);
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
