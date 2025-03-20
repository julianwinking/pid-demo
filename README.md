# PID Controller Demo

An interactive, browser-based demo that visually explains how PID (Proportional-Integral-Derivative) controllers work. This tool allows users to adjust PID parameters in real-time and observe their effect on system stability and performance.

![PID Demo Screenshot](images/step_1.png)

## Table of Contents
- [PID Controller Demo](#pid-controller-demo)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Run Locally](#run-locally)
    - [Try the Live Demo](#try-the-live-demo)
  - [Usage](#usage)
  - [Contributing](#contributing)
    - [How to Contribute](#how-to-contribute)
  - [License](#license)

## Introduction

PID controllers are fundamental components in control systems engineering, widely used in industrial automation, robotics, and process control. This demo offers an intuitive and interactive way to explore PID tuning concepts directly in the browser—no additional software required.

It is designed for:
- Students learning control theory
- Engineers looking to visualize PID tuning effects
- Enthusiasts exploring feedback control systems

## Features

- Interactive sliders to tune PID parameters: **Kp**, **Ki**, and **Kd**
- Real-time visualization of system response to input changes
- Frequency-domain analysis with Nyquist and Bode plots
- Educational deep-dive on PID controller concepts and tuning methods
- Reset functionality for quick experimentation and learning

## Getting Started

### Run Locally
1. Clone the repository:
    ```bash
    git clone https://github.com/julianwinking/pid-demo.git
    ```
2. Navigate to the project directory:
    ```bash
    cd pid-demo
    ```
3. Open the demo:
    ```bash
    open index.html
    ```
    Or simply double-click `index.html` in your file explorer.

### Try the Live Demo  
👉 [PID Controller Demo](https://winki.ng/projects/pid-demo/index.html)

## Usage

1. Adjust the **Kp**, **Ki**, and **Kd** sliders to tune the PID controller.
2. Observe changes in the system's behavior on the live chart.
3. Explore the frequency-domain plots to understand stability and performance characteristics.
4. Use the **Reset** button to restore default parameters and restart the simulation.

## Contributing

Contributions and feedback are welcome! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request.

### How to Contribute
1. Fork the repository.
2. Create a new feature branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Describe your changes"
    ```
4. Push to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Open a pull request describing your contribution.

## License

This project is licensed under the [MIT License](LICENSE).