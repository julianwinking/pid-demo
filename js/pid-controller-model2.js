// Copy of the PID controller logic for Model 2
function calculateBodeData2(Kp, Ki, Kd, frequencies) {
    const magnitude = [];
    const phase = [];

    frequencies.forEach((omega) => {
        if (omega === 0) omega = 1e-10; // Schutz gegen Division durch Null
        if (omega > 1e6) omega = 1e6; // Begrenze omega, um ungültige Werte zu vermeiden

        const jw = math.complex(0, omega); // jω
        const pid = Kp + Ki / jw + Kd * jw; // PID-Übertragungsfunktion

        magnitude.push(20 * Math.log10(math.abs(pid))); // Betrag in dB
        phase.push((math.arg(pid) * 180) / Math.PI); // Phase in Grad
    });

    return { magnitude, phase };
}

// Add additional logic for Model 2 if needed

// Copy of pid-controller-model1.js logic for Model 2
function startModel2Logic() {
    console.log("Model 2 logic started.");
    // Add Model 2-specific logic here
}

function stopModel2Logic() {
    console.log("Model 2 logic stopped.");
    // Add logic to stop Model 2 calculations
}
