document.getElementById('model1-btn').addEventListener('click', function() {
    document.getElementById('model1').style.display = 'flex';
    document.getElementById('deepdive').style.display = 'none';
});

document.getElementById('tutorial-btn').addEventListener('click', function() {
    document.getElementById('tutorial-popup').style.display = 'block';
});

document.getElementById('deepdive-btn').addEventListener('click', function() {
    document.getElementById('model1').style.display = 'none';
    document.getElementById('deepdive').style.display = 'flex';
    // Remove the call to loadDeepDiveContent
    // loadDeepDiveContent();
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('tutorial-popup').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('model1').style.display = 'flex';
    document.getElementById('deepdive').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('introduction-btn').addEventListener('click', () => {
        document.getElementById('introduction-section').style.display = 'block';
        document.getElementById('controllers-section').style.display = 'none';
    });

    document.getElementById('controllers-btn').addEventListener('click', () => {
        document.getElementById('introduction-section').style.display = 'none';
        document.getElementById('controllers-section').style.display = 'block';
    });
});

// Function to handle menu activation
function activateMenuItem(menuId) {
    if (menuId === 'tutorial-btn') return; // Skip activation for the tutorial button

    // Remove 'active' class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add 'active' class to the clicked menu item
    const activeItem = document.getElementById(menuId);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Event listeners for menu items
document.getElementById('tutorial-btn').addEventListener('click', () => {
    document.getElementById('tutorial-popup').style.display = 'block';
});

document.getElementById('model1-btn').addEventListener('click', () => {
    activateMenuItem('model1-btn');
    // ...additional logic for showing the model1 section...
});

document.getElementById('deepdive-btn').addEventListener('click', () => {
    activateMenuItem('deepdive-btn');
    // ...additional logic for showing the deep dive section...
});

let activeModel = "model1";

function switchModel(newModel) {
    const models = ["model1", "model2"];
    models.forEach((model) => {
        const modelElement = document.getElementById(model);
        const buttonElement = document.getElementById(`${model}-btn`);
        if (model === newModel) {
            modelElement.style.display = "flex";
            buttonElement.classList.add("active");
        } else {
            modelElement.style.display = "none";
            buttonElement.classList.remove("active");
        }
    });

    // Ensure Deep Dive view is hidden
    document.getElementById("deepdive").style.display = "none";
    document.getElementById("deepdive-btn").classList.remove("active"); // Remove active state from Deep Dive menu

    // Stop calculations for the previous model and start the new one
    if (newModel === "model1") {
        startModel1();
        stopModel2();
    } else if (newModel === "model2") {
        startModel2();
        stopModel1();
    }

    activeModel = newModel;
}

// Update Deep Dive button logic to deactivate other models
document.getElementById("deepdive-btn").addEventListener("click", () => {
    document.getElementById("model1").style.display = "none";
    document.getElementById("model2").style.display = "none"; // Ensure Model 2 is hidden
    document.getElementById("deepdive").style.display = "flex";

    // Deactivate other menu items
    document.getElementById("model1-btn").classList.remove("active");
    document.getElementById("model2-btn").classList.remove("active");
    document.getElementById("deepdive-btn").classList.add("active");

    // Show the "Introduction" article by default
    showDeepDiveSection('introduction-section');
});

function startModel1() {
    console.log("Starting Model 1...");
    // Logic to start Model 1 calculations
    if (typeof startModel1Logic === "function") {
        startModel1Logic();
    }
}

function stopModel1() {
    console.log("Stopping Model 1...");
    // Logic to stop Model 1 calculations
    if (typeof stopModel1Logic === "function") {
        stopModel1Logic();
    }
}

function startModel2() {
    console.log("Starting Model 2...");
    // Logic to start Model 2 calculations
    if (typeof startModel2Logic === "function") {
        startModel2Logic();
    }
}

function stopModel2() {
    console.log("Stopping Model 2...");
    // Logic to stop Model 2 calculations
    if (typeof stopModel2Logic === "function") {
        stopModel2Logic();
    }
}

// Event listeners for model switching
document.getElementById("model1-btn").addEventListener("click", () => switchModel("model1"));
document.getElementById("model2-btn").addEventListener("click", () => switchModel("model2"));

// Initialize with Model 1 active
switchModel("model1");

// Event listener for info links
document.querySelectorAll('.info-link, .clickable').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.currentTarget.getAttribute('data-target');
        showDeepDiveSection(target);
    });
});

function showDeepDiveSection(target) {
    const sections = document.querySelectorAll('#deepdive-container > div');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(target);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    document.getElementById('model1').style.display = 'none';
    document.getElementById('model2').style.display = 'none';
    document.getElementById('deepdive').style.display = 'flex';

    // Activate the Deep Dive menu item
    activateMenuItem('deepdive-btn');
}

function loadDeepDiveContent(target) {
    const deepDiveContainer = document.getElementById('deepdive-container');
    deepDiveContainer.innerHTML = ''; // Clear existing content

    let content = '';
    switch (target) {
        case 'kp-info':
            content = `
                <h2>Proportional Gain (Kp)</h2>
                <p>The proportional gain (Kp) determines how strongly the controller reacts to the current error. A higher Kp results in a faster response but may cause overshooting.</p>
            `;
            break;
        case 'ki-info':
            content = `
                <h2>Integral Gain (Ki)</h2>
                <p>The integral gain (Ki) accumulates the error over time, helping to eliminate steady-state error. However, too high a value can cause oscillations.</p>
            `;
            break;
        case 'kd-info':
            content = `
                <h2>Derivative Gain (Kd)</h2>
                <p>The derivative gain (Kd) predicts future error based on its rate of change, providing damping and improving stability.</p>
            `;
            break;
        // Add cases for other parameters like mass, target, amplitude, frequency, and noise
        default:
            content = '<h2>Information Not Found</h2>';
    }

    deepDiveContainer.innerHTML = content;
    document.getElementById('model1').style.display = 'none';
    document.getElementById('model2').style.display = 'none';
    document.getElementById('deepdive').style.display = 'flex';

    // Activate the Deep Dive menu item
    activateMenuItem('deepdive-btn');
}

// Function to highlight the active deep dive menu item
function activateDeepDiveMenuItem(targetId) {
    // Remove 'active' class from all deep dive menu items
    document.querySelectorAll('#deepdive-navigation li').forEach(item => {
        item.classList.remove('active');
    });

    // Add 'active' class to the clicked menu item
    const activeItem = document.querySelector(`#deepdive-navigation li[data-target="${targetId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Update the showDeepDiveSection function to include menu highlighting
function showDeepDiveSection(targetId) {
    // Hide all sections
    document.querySelectorAll('#deepdive-container > div').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Highlight the active menu item
    activateDeepDiveMenuItem(targetId);

    // Ensure the deep dive view is visible
    document.getElementById('model1').style.display = 'none';
    document.getElementById('model2').style.display = 'none';
    document.getElementById('deepdive').style.display = 'flex';

    // Activate the Deep Dive menu item in the main navigation
    activateMenuItem('deepdive-btn');
}

// Event listener for deep dive navigation
document.querySelectorAll('#deepdive-navigation .clickable').forEach(item => {
    item.addEventListener('click', (event) => {
        const target = event.currentTarget.getAttribute('data-target');
        showDeepDiveSection(target);
    });
});

// Event listener for info buttons in the model views
document.querySelectorAll('.info-link').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.currentTarget.getAttribute('data-target');
        showDeepDiveSection(target);
    });
});

let currentStep = 1;
const totalSteps = document.querySelectorAll('.tutorial-step').length;

document.getElementById('next-step').addEventListener('click', () => {
    if (currentStep < totalSteps) {
        document.getElementById(`step-${currentStep}`).style.display = 'none';
        currentStep++;
        document.getElementById(`step-${currentStep}`).style.display = 'block';
    }
    updateNavigationButtons();
});

document.getElementById('prev-step').addEventListener('click', () => {
    if (currentStep > 1) {
        document.getElementById(`step-${currentStep}`).style.display = 'none';
        currentStep--;
        document.getElementById(`step-${currentStep}`).style.display = 'block';
    }
    updateNavigationButtons();
});

function updateNavigationButtons() {
    document.getElementById('prev-step').disabled = currentStep === 1;
    document.getElementById('next-step').disabled = currentStep === totalSteps;
}

// Reset tutorial to the first step when closed
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep = 1;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updateNavigationButtons();
});

document.getElementById('tutorial-btn').addEventListener('click', () => {
    // Open the tutorial popup without modifying the active menu item
    document.getElementById('tutorial-popup').style.display = 'block';
});