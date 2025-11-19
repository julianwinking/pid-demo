# PID Controller Visualization

A lightweight, browser-based simulation designed to bridge the gap between control theory equations and intuitive understanding. I built this to provide a visual feedback loop for tuning PID parameters on a standard second-order system without the overhead of setting up MATLAB or Python environments.

![PID Demo Screenshot](images/step_1.png)

## Table of Contents

- [Overview](#overview)
- [Simulation Models](#simulation-models)
- [Key Capabilities](#key-capabilities)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [License](#license)

## Overview

This tool provides a browser-based simulation for tuning PID controllers. It combines time-domain visualization with frequency-domain analysis to demonstrate the relationship between control parameters and system stability.

## Simulation Models

The application features two distinct physical models:

- **Mass-Spring-Damper**: A stable, linear system ideal for understanding basic PID concepts.
- **Ball and Beam**: An inherently unstable system that challenges users to balance a rolling ball on a tilting beam.

## Key Capabilities

- **Real-time Tuning**: Adjust $K_p$, $K_i$, and $K_d$ gains with immediate visual feedback on the step response.
- **Dual Domain Analysis**: Simultaneous rendering of time-domain response and frequency-domain stability (Bode/Nyquist), allowing users to correlate gain margin/phase margin with overshoot and settling time.
- **Zero Dependencies**: Written in vanilla JavaScript. No build steps, `npm install`, or backend required.

## Quick Start

Since this is a client-side static application, you can run it directly.

### Local Execution

#### Option A: Git (Recommended)

1. Clone the repo:
   ```bash
   git clone https://github.com/julianwinking/pid-demo.git
   ```
2. Open `index.html` in any modern browser.

#### Option B: Direct Download

1. [Download Source Code (ZIP)](https://github.com/julianwinking/pid-demo/archive/refs/heads/main.zip)
2. Extract the folder and double-click `index.html`.

### Live Version

You can view the deployed instance here:  
[winki.ng/projects/pid-demo](https://winki.ng/projects/pid-demo)

## Usage Guide

The simulation initializes with a standard overdamped system.

1. **P-Term**: Increase $K_p$ to improve rise time. Note the emergence of steady-state error.
2. **I-Term**: Introduce $K_i$ to eliminate steady-state error. Observe the potential for windup or oscillation if set too high.
3. **D-Term**: Apply $K_d$ to dampen the overshoot caused by the integral term.
4. **Stability Analysis**: Use the bottom charts to check the Nyquist plot. If the locus encircles the critical point $(-1, 0)$, the system has become unstable.

## License

Open source under the [MIT License](LICENSE).
