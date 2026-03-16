# 🖥️ Process Scheduling Simulator (OS PBL)

A premium, interactive web-based simulator designed to visualize and compare CPU Scheduling Algorithms. This project bridges the gap between theoretical Operating System concepts and practical visualization.

---

## 🚀 Key Features

- **6 Algorithms Supported**: 
    - First Come First Serve (FCFS)
    - Shortest Job First (SJF - Non-Preemptive)
    - Shortest Remaining Time First (SRTF - Preemptive SJF)
    - Priority Scheduling (Non-Preemptive)
    - Priority Scheduling (Preemptive)
    - Round Robin (RR) with configurable Time Quantum
- **Real-time Visualization**:
    - **Animated Gantt Chart**: Watch the CPU execute processes step-by-step with smooth transitions.
    - **Performance Analytics**: Interactive bar charts (using Chart.js) comparing Waiting Time and Turnaround Time.
- **Comparison Engine**: Run all algorithms simultaneously to benchmark performance for the same set of processes.
- **Modern UI**: Dark-themed, responsive dashboard built with a professional glassmorphism design system.

---

## 📂 Project Structure & File Guide

### 1. Backend Logic (Django)
- `scheduler_app/algorithms.py`: **The Brain.** Contains the mathematical implementation of all 6 scheduling algorithms. 
    - `fcfs()`, `sjf_non_preemptive()`, `sjf_preemptive()`, etc.
    - `calculate_metrics()`: A shared utility that computes WT and TAT based on the generated Gantt chart sequences.
- `scheduler_app/views.py`: **The Bridge.** Handles API requests from the frontend.
    - `home()`: Renders the dashboard.
    - `simulate()`: An API endpoint that accepts JSON process data, executes the requested algorithm, and returns structured results (Gantt blocks, averages, and metrics).
    - `compare_all()`: Executes all algorithms for benchmarking.
- `scheduler_app/urls.py`: Defines the application's URL paths (`/` and `/simulate/`).

### 2. Frontend & Design
- `templates/index.html`: **The Dashboard.** The main entry point. It uses Django template tags and contains the layout for inputs, the Gantt chart container, and the results section.
- `static/css/style.css`: **The Design System.** Features a modern dark-mode palette, glassmorphism card effects, custom CSS animations, and responsive grid layouts.
- `static/js/main.js`: **The Interactivity.** 
    - Handles dynamic table rows (Adding/Removing processes).
    - Manages the `fetch` API calls to the Django backend.
    - Implements the **Async Rendering Engine** for the animated Gantt chart.
    - Initializes and updates the **Chart.js** performance graphs.

### 3. Project Configuration
- `scheduler_project/settings.py`: Configured to handle static files and template directories.
- `scheduler_project/urls.py`: Roots the main URL configuration to the `scheduler_app`.

---

## 🛠️ How to Run

1. **Install Dependencies**:
   ```bash
   pip install django
   ```

2. **Run Migrations** (Initial setup):
   ```bash
   python manage.py migrate
   ```

3. **Launch the Server**:
   ```bash
   python manage.py runserver
   ```

4. **Open in Browser**:
   Navigate to `http://127.0.0.1:8000`

---

## 🧠 Concepts Explained

- **Waiting Time (WT)**: The total time a process spends in the ready queue.
  - `WT = Turnaround Time - Burst Time`
- **Turnaround Time (TAT)**: Total time from arrival to completion.
  - `TAT = Completion Time - Arrival Time`
- **Preemption**: The ability of the OS to interrupt a running process to assign the CPU to a higher-priority or shorter process (seen in SRTF and Priority-P).

---

## 👥 Team Collaboration Notes
- When adding a new algorithm, implement it in `algorithms.py` and add the mapping in `views.py`.
- If modifying the UI, all style tokens are defined in the `:root` of `style.css` for easy Global changes.
