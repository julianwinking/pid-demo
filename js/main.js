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
    activateMenuItem('tutorial-btn');
    // ...additional logic for showing the tutorial section...
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